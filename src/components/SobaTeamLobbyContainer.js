import React, {useEffect, useState} from 'react';
import {
    SOCKET_EMIT_LEAVE_ROOM,
    SOCKET_EMIT_REJECT_PLAYER,
    SOCKET_ON_PLAYER_JOINED,
    SOCKET_ON_PLAYER_REJECTED,
} from '../resources/properties';
import {CheckTeamsContainPlayer} from './util';

export function SobaTeamLobbyContainer(LobbyComponent, config) {
    const {playerRejectedLeaveRoomCallback, } = config;
    return function LobbyTeamStrand(props) {
        const {socket, isHost, gameState, setGameState, broadcastGameState} = props;
        const [isLoading, setIsLoading] = useState(true);
        const gameStateRef = React.useRef(gameState);

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
                                {roomCode: gameStateRef.current.roomCode, playerName: res.playerName}, () => {});
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
                    socket.emit(SOCKET_EMIT_LEAVE_ROOM, res.roomCode, playerRejectedLeaveRoomCallback);
                }
            });
            return () => {
                socket.off(SOCKET_ON_PLAYER_REJECTED);
            };
        });

        return (
            <LobbyComponent
                {...props}

            />
        );
    };
}