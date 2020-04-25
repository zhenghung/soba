# Game Design Document
SobaParentContainer is the core parent higher-order component. It initialises a some states and injects props essential to use the rest of the framework.

### Content
1. [SobaParentContainer](#sobaparentcontainer)
2. [SobaTeamLobbyContainer](#sobateamlobbycontainer)
3. [GameState Design](#gamestate-design)

### SobaParentContainer
Higher-order component wrapper function
```
SobaParentContainer(App, socketConnect)
```
`App` : Parent component for the application

`socketConnect`: Second argument required for this function, this is the socket.io-client object initialised with a backend and transport type

Example: 
```
const socketConnect = io("https://mygame.game.com/", {transports: ['websocket']});
export default SobaParentContainer(App, socketConnect);
```
#### Injected props
* `socket` : The socketConnect passed into SobaParentContainer
* `setSocket` : setState for socket
* `socketId` : randomly set on connection to the backend server
* `setSocketId` : setState for socketId
* `gameState` : Main object for tracking game's current state (see [section](#gamestate-design) for more details)
* `setGameState` : setState for gameState
* `broadcastGameState` : function to emit the updatedGameState to every connected client within the room
    * Parameter (only one): (see [section](#gamestate-design) for more details) 
    ```
    newGameState: {
        roomCode: <(boolean) value for if the joiner is the host>,
        "hostName": "Potato",
        "numberOfTeams": 2,
        "teams": [
        ]
    }
    ```

### SobaTeamLobbyContainer
Higher-order component wrapper function
```
SobaTeamLobbyContainer(LobbyComponent)
```
`LobbyComponent` : Lobby component for the application, designed to be a child of the Parent component

The LobbyComponent itself must contain the following props received from its parent:
* `socket` : Injected from SobaParentContainer
* `gameState` : Injected from SobaParentContainer
* `setGameState` : Injected from SobaParentContainer
* `broadcastGameState` : Injected from SobaParentContainer
* `isHost` : boolean value showing the player's role (true if creating room, false if joining existing room)
* `playerName` : string value for the player's set name 
* `playerTeam` : int value for the team the player is in within the gameState's team object's index
* `setPlayerTeam` : setState for `playerTeam`
* `playerRejectedInvalidRoomCallback` (OPTIONAL) : callback function if joining an invalid room
* `playerRejectedNameTakenCallback` (OPTIONAL) : callback function if joining a room with another player that already has the same name

#### Injected props
* `isLoading` : set to true in the beginning until gameState contains the object `teams`
* `error` : object to handle player joining errors, recommended alternative to handling invalidRoom and nameTaken.
    * Invalid Room Code, room doesn't exist
    ```
    {
        error: true,
        type: "ERROR_INVALID_ROOM_CODE",
        message: 'Invalid roomCode, room doesn't exist',
    }
    ```
    * Name Already Taken
    ```
    {
        error: true,
        type: "ERROR_PLAYER_NAME_TAKEN",
        message: 'playerName already taken',
    }
    ```
  
* `joinRoom` : function to join the player to a given room
    * Parameter (only one):  
    ```
    joinPayLoad: {
        isHost: <(boolean) value for if the joiner is the host>,
        playerName: <(string) value for the playerName>, 
        socketId: <(string) value for the socket provided id>, 
        roomCode: <(string) value for the roomCode>
    }
    ```
* `changeTeam` : function to change the player's team within gameState
    * Parameter (only one):  
    ```
    newTeam: <(int) value that is the index of the team in gameState.teams the player wishes to change to>
    ```


### GameState Design
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
                "socketId": {{RANDOM ID}}
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


Example of an implemented *GAMESTATE* in game
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
                "socketId":"fjsanhdHDOASD"
            },
            {
                "playerName":"John",
                "socketId":"gjrvoeigvjSFDIOA"
            },
        ],
        [
            {
                "playerName":"Jack",
                "socketId":"879f8hNFHASOIDJ"
            },
            {
                "playerName":"Pie",
                "socketId":"87483021JFISOAJFD"
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

