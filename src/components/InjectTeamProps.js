import React, {useState} from 'react';

const defaultConfig = {
    defaultRoomCode: '',
    defaultIsHost: false,
    defaultPlayerName: '',
    defaultTeam: 0,
    defaultNumberOfTeams: 2,
};

export default function withTeamProps(AppComponent, config) {

    config = {
        ...defaultConfig,
        ...config,
    };

    return function withTeamProps(props) {
        const [isHost, setIsHost] = useState(config.defaultIsHost);
        const [roomCode, setRoomCode] = useState(config.defaultRoomCode);
        const [playerName, setPlayerName] = useState(config.defaultPlayerName);
        const [playerTeam, setPlayerTeam] = useState(config.defaultTeam);
        const [numberOfTeams, setNumberOfTeams] = useState(config.defaultNumberOfTeams);

        return (
            <AppComponent
                {...props}
                isHost={isHost}
                setIsHost={setIsHost}
                roomCode={roomCode}
                setRoomCode={setRoomCode}
                playerName={playerName}
                setPlayerName={setPlayerName}
                playerTeam={playerTeam}
                setPlayerTeam={setPlayerTeam}
                numberOfTeams={numberOfTeams}
                setNumberOfTeams={setNumberOfTeams}
            />
        );
    };
}