import React, {useEffect, useState} from 'react';
import {
    ERROR_INVALID_ROOM_CODE,
    ERROR_PLAYER_NAME_TAKEN,
    SOCKET_EMIT_JOIN_ROOM,
    SOCKET_EMIT_LEAVE_ROOM,
    SOCKET_EMIT_REJECT_PLAYER,
    SOCKET_ON_PLAYER_JOINED,
    SOCKET_ON_PLAYER_JOINED_FAILED,
    SOCKET_ON_PLAYER_REJECTED,
} from '../resources/properties';
import {CheckTeamsContainPlayer} from './util';

export default function SobaTeamLobbyContainer(LobbyComponent, config) {
    return function LobbyTeamStrand(props) {
        const {
            socket, isHost, gameState, setGameState,
            setPlayerTeam, playerName, broadcastGameState,
            playerRejectedInvalidRoomCallback, playerRejectedNameTakenCallback,
        } = props;
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState({error: false, type: '', message: ''});
        const gameStateRef = React.useRef(gameState);

        /**
         * setIsLoading to false once gameState has the key 'teams'
         */
        useEffect(() => {
            gameStateRef.current = gameState;
            if (isLoading && gameState.hasOwnProperty('teams')) {
                setIsLoading(false);
            }
        }, [gameState]);

        /**
         * Listens for new players joining the room
         * As Host, updates gameState and broadcasts it
         */
        useEffect(() => {
            socket.on(SOCKET_ON_PLAYER_JOINED, (res) => {
                if (isHost) {
                    console.log('New Joiner: ', res.playerName);
                    if (res.isHost) {
                        setGameState(prevGameState => {
                            const {teams} = prevGameState;
                            teams[0] = [{playerName: res.playerName, socketId: res.socketId}];
                            return {...prevGameState, teams};
                        });
                    } else {
                        if (CheckTeamsContainPlayer(gameStateRef.current.teams, res.playerName)) {
                            /** Reject Player for having the same name*/
                            socket.emit(SOCKET_EMIT_REJECT_PLAYER,
                                {roomCode: gameStateRef.current.roomCode, playerName: res.playerName}, () => {
                                });
                        } else {
                            /** Add Player to room and broadcast*/
                            setGameState(prevGameState => {
                                const {teams} = prevGameState;
                                teams[0].push({playerName: res.playerName, socketId: res.socketId});
                                const newGameState = {...prevGameState, teams};
                                broadcastGameState(newGameState);
                                return newGameState;
                            });
                        }
                    }
                }
            });
            return () => {
                socket.off(SOCKET_ON_PLAYER_JOINED);
            };
        });

        /**
         * For joiners, fail if their name is already taken
         */
        useEffect(() => {
            socket.on(SOCKET_ON_PLAYER_REJECTED, (res) => {
                if (res.playerName === playerName && !gameStateRef.current.roomCode &&
                    gameStateRef.current.roomCode !== res.roomCode) {
                    socket.emit(SOCKET_EMIT_LEAVE_ROOM, res.roomCode, () => {
                        setError({
                            error: true,
                            type: ERROR_PLAYER_NAME_TAKEN,
                            message: 'Error: playerName already taken',
                        });
                        if (playerRejectedNameTakenCallback !== undefined) {
                            return playerRejectedNameTakenCallback;
                        }
                    });
                }
            });
            return () => {
                socket.off(SOCKET_ON_PLAYER_REJECTED);
            };
        });

        /**
         * For joiners, fail if they entered a wrong room code
         */
        useEffect(() => {
            socket.on(SOCKET_ON_PLAYER_JOINED_FAILED, (res) => {
                if (res.playerName === playerName) {
                    setError({
                        error: true,
                        type: ERROR_INVALID_ROOM_CODE,
                        message: 'Error: Invalid room code',
                    });
                    if (playerRejectedInvalidRoomCallback !== undefined) playerRejectedInvalidRoomCallback();
                }
            });
            return () => {
                socket.off(SOCKET_ON_PLAYER_JOINED_FAILED);
            };
        });

        /**
         * Runs for every player (including host) upon entering room
         * In hosts case, runs after retrieving the gameState
         * Defaults to Team 0
         * @param joinPayload
         */
        const joinRoom = (joinPayload) => {
            socket.emit(SOCKET_EMIT_JOIN_ROOM, joinPayload, error => {
                if (error) alert(error);
                setPlayerTeam(0);
            });
        };

        return (
            <LobbyComponent
                {...props}
                joinRoom={joinRoom}
                isLoading={isLoading}
                error={error}
            />
        );
    };
}