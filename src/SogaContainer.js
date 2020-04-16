import React, {useEffect, useState} from 'react';
import {SOCKET_EMIT_BROADCAST_GAMESTATE, SOCKET_ON_SOCKETID, SOCKET_ON_UPDATE_GAMESTATE} from './resources/properties';

const WithSoga = (AppComponent, socketConnect) =>
    function Soga(props) {
        const [socket, setSocket] = useState(socketConnect);
        const [socketId, setSocketId] = useState('');
        const [gameState, setGameState] = useState({teams: [[], []]});

        /**
         * Broadcasts gameState updates so that all connected clients are in sync
         * Usually used inside a setGameState function
         * @param newGameState
         */
        function broadcastGameState(newGameState) {
            socket.emit(SOCKET_EMIT_BROADCAST_GAMESTATE, newGameState, () => {
                console.log('Broadcasting GameState: ', newGameState);
            });
        }

        /**
         * Receives a new gameState coming from another client that ran broadcastGameState()
         * Updates our own gameState to be in sync with other clients
         */
        useEffect(() => {
            socket.on(SOCKET_ON_UPDATE_GAMESTATE, (newGameState) => {
                console.log('Updating GameState', newGameState);
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
                console.log('Registered SocketId: ', socketId);
                setSocketId(socketId);
            });
            return () => {
                socket.off(SOCKET_ON_SOCKETID);
            };
        });

        return (
            <AppComponent
                socket={socket}
                setSocket={setSocket}
                socketId={socketId}
                setSocketId={setSocketId}
                gameState={gameState}
                setGameState={setGameState}
                broadcastGameState={broadcastGameState}
            />
        );
    };

export default WithSoga;