# SoBa
Socket.io-Based web game framework

### Content
1. Example projects
2. Installation and Quickstart
3. Introduction
4. Architecture
5. GameState Design Doc

### Example projects
1. Articulate
    * Game Link: https://articulate-hoc.herokuapp.com/
    * Source Code 
        * Front-end: https://github.com/chriz218/articulate
        * Back-end: https://github.com/zhenghung/articulate-be

### Installation and Quickstart
1. Install the npm modules in your React project directory.
    ```
    $ npm install --save soba-game socket.io-client
    ```
2. Import SobaParentContainer in your highest-level component (e.g. App.js), as well as `socket.io-client`.
    ```
    import io from 'socket.io-client';
    import {SobaParentContainer} from 'soba-game';
    ```
3. Initialise a socket.io-client connection and modify the export default for the component as follows.
    ```
    const socketConnect = io(BACKEND_ENDPOINT, {transports: ['websocket']});
    export default SobaParentContainer(App, socketConnect);
    ```
4. This will also inject a few props into your component so add them to the props. The final App.js component will look something like this.
    ```
    import React from 'react';
    import io from 'socket.io-client';
    import {SobaParentContainer} from 'soba-game';
    function App(props){
        const {socket, socketId, gameState, 
            setGameState, broadcastGameState} = props;
        .
        .
        return (
            <HomePage
                setPage={setPage}
                socketId={socketId}
            />
        )
    }
    const socketConnect = io("https://mygame.game.com/", {transports: ['websocket']});
    export default SobaParentContainer(App, socketConnect);
    ```
   
### Introduction
Soba is a npm module create to provide higher-order components for simplifying and streamlining the web-based social games using socket.io's communication.

This architecture and flow was designed with a game in mind, but was then tweaked to be more generic to allow different turn-based games to be created this way.

### Architecture
WIP

### GameState Design Doc
This section will outline the design of the *GAMESTATE* object that will form the basis of the socket.io powered game.
The *GAMESTATE* object is used to synchronise the players' devices, keeping track of the current state of the game without having a database in the backend.

The following will only contain **required** elements within the gamestate, other elements can be added to suit the type of game.

##### Team-based games
```
{
    "roomCode": {{ROOM CODE}}
    "currentState": {{STATE OF THE GAME}}
    "teams": [
        [
            {
                "id": {{RANDOM ID}}
                "playerName": {{NAME OF PLAYER}}
            }
            .
            .
            .
        ]
        .
        .
        .
    ]
}
```




Example of a implemented *GAMESTATE* in game
```
{
    "roomCode": "951",
    "hostName": "Potato",
    "numberOfTeams": 2,
    "currentState": "game",
    "teams":[
        [
            {
                "playerName":"Potato",
                "id":"fjsanhdHDOASD"
            },
            {
                "playerName":"John",
                "id":"gjrvoeigvjSFDIOA"
            },
        ],
        [
            {
                "playerName":"Jack",
                "id":"879f8hNFHASOIDJ"
            },
            {
                "playerName":"Pie",
                "id":"87483021JFISOAJFD"
            },
        ]
    ],
    "turns":3,
    "usedWords":{
        "object":[],
        "action":[],
        "nature":["Rose"],
        "world":[],
        "person":["Harry Potter"],
        "random":[]
    },
    "currentTurn":{
        "phase":"planning",
        "team":0,
        "category":"object",
        "word": "Table",
        "describer":["John"],
        "guesser":["Potato"]
    },
    "gamePositions":[0,0]
}
```
