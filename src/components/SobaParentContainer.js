import React, {useEffect, useState} from 'react';
import {
    SOCKET_EMIT_BROADCAST_GAMESTATE,
    SOCKET_EMIT_LEAVE_ROOM,
    SOCKET_EMIT_SOCKETID,
    SOCKET_ON_SOCKETID,
    SOCKET_ON_UPDATE_GAMESTATE,
} from '../resources/properties';

const defaultConfig = {
    defaultSocketId: '',
    defaultGameState: {},
    logging: false,
};

export default function SobaParentContainer(AppComponent, socketConnect, config) {
    if (socketConnect === undefined || !socketConnect) {
        throw new Error('SobaParentContainer\'s 2nd argument must be a valid socket.io-client function');
    }

    config = {
        ...defaultConfig,
        ...config,
    };

    return function SobaBowl(props) {
        const [socket, setSocket] = useState(socketConnect);
        const [socketId, setSocketId] = useState(config.defaultSocketId);
        const [gameState, setGameState] = useState(config.defaultGameState);

        /** Request for a SocketId from server upon load, check connection*/
        useEffect(() => {
            socket.emit(SOCKET_EMIT_SOCKETID, {}, (error) => {
                if (error) alert(error);
            });
        }, []);

        /**
         * Broadcasts gameState updates so that all connected clients are in sync
         * Usually used inside a setGameState function
         * @param newGameState
         */
        function broadcastGameState(newGameState) {
            socket.emit(SOCKET_EMIT_BROADCAST_GAMESTATE, newGameState, () => {
                if (config.logging) console.log('Broadcasting GameState: ', newGameState);
            });
        }

        /**
         * Receives a new gameState coming from another client that ran broadcastGameState()
         * Updates our own gameState to be in sync with other clients
         */
        useEffect(() => {
            socket.on(SOCKET_ON_UPDATE_GAMESTATE, (newGameState) => {
                if (config.logging) console.log('Updating GameState', newGameState);
                setGameState(newGameState);
            });
            return () => {
                socket.off(SOCKET_ON_UPDATE_GAMESTATE);
            };
        });

        /** Response from server containing the socketId*/
        useEffect(() => {
            socket.on(SOCKET_ON_SOCKETID, ({socketId}, error) => {
                if (error) alert(error);
                if (config.logging) console.log('Registered SocketId: ', socketId);
                setSocketId(socketId);
            });
            return () => {
                socket.off(SOCKET_ON_SOCKETID);
            };
        });

        /**
         * Leave socket.io room
         * @param roomCode
         * @param callback Function run after emitting socket message
         */
        function leaveRoom(roomCode, callback) {
            socket.emit(SOCKET_EMIT_LEAVE_ROOM, roomCode, callback);
        }

        return (
            <AppComponent
                {...props}
                socket={socket}
                setSocket={setSocket}
                socketId={socketId}
                setSocketId={setSocketId}
                gameState={gameState}
                setGameState={setGameState}
                broadcastGameState={broadcastGameState}
                leaveRoom={leaveRoom}
            />
        );
    };
}