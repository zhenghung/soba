<img src="https://github.com/zhenghung/soba-game/raw/master/doc_images/logo.png" width=50% />

# Soba
[![npm version](https://badge.fury.io/js/soba-game.svg)](https://badge.fury.io/js/soba-game)

> Soba is a simple React-based web game engine.
> By using higher-order components, Soba manages the generic socket.io messages and injecting additional functions as props.
> Integrating with Soba allows web games to be made more lightweight.

### More Resources
1. For a detailed description and explanation of how the games work with flowcharts and diagrams.
    * [Framework Architecture](./Architecture.md)
2. Guidelines for designing games based on the framework, also describes the behaviour of the higher-order components.
    * [Game Design Document](./GameDesignDoc.md)

### Introduction
Soba is a npm module create to provide higher-order components for simplifying and streamlining the web-based social games using socket.io's communication.

This architecture and flow was designed with a game in mind, but was then tweaked to be more generic to allow different turn-based games to be created this way.

### Example projects
1. Articulate
    * Game Link: https://articulate-game.herokuapp.com/
    * Source Code 
        * Front-end: https://github.com/chriz218/articulate
        * Back-end: https://github.com/zhenghung/articulate-be

### Usage and Quickstart
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

### Feedback
This is a new project and really needs more sets of eyes. Work is being done and new releases will be made. If you're having trouble getting it to work for your project, or have ideas of how it can be improved, please create an issue or get in touch with me at: 
> zhenghung.chuah@gmail.com
