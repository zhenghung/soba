import {
    RESPONSE_JSON,
    RESPONSE_TEXT,
} from '../resources/properties';

export const NextTeam = (currentTeam, numberOfTeams) => {
    return (currentTeam + 1) % numberOfTeams;
};

export const TranslateTeamDisplayed = (teamNumber) => {
    return String.fromCharCode(teamNumber + 65);
};

export const CapitaliseFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

export const CommaBetweenWords = (words) => {
    let concatenatedString = '';
    words.map((each, index) => {
        if (index === 0) {
            concatenatedString += each;
        } else {
            concatenatedString += `, ${each}`;
        }
    });
    return concatenatedString;
};

export const PostRequest = (
    URL, reqBody, responseType, handler, errorHandler) => {
    fetch(URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reqBody),
    }).then(response => {
        if (response.status === 200) {
            switch (responseType) {
                case RESPONSE_JSON:
                    return response.json();
                case RESPONSE_TEXT:
                    return response.text();
                default:
                    console.error('responseType provided invalid: ', responseType);
            }
        }
        throw new Error(response.statusText);
    }).then(data => handler(data)).catch(error => {
        if (errorHandler) errorHandler(error);
    });
};

export const CheckEnoughPlayers = (numberOfTeams, teams, min_players_per_team) => {
    return true; // TODO: FOR DEVELOPMENT

    for (let i = 0; i < teams.length; i++) {
        if (teams[i].length < min_players_per_team) {
            return false;
        }
    }
    return true;
};

export const CheckTeamsContainPlayer = (teams, name) => {
    for (let i = 0; i < teams.length; i++) {
        for (let j = 0; j < teams[i].length; j++) {
            if (teams[i][j].playerName === name) {
                return true;
            }
        }
    }
    return false;
};

