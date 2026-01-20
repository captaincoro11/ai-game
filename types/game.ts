export interface Player {
    id : string , 
    name : string ,
    score : number
}

export interface GameWord {
    french : string ,
    english : string ,
    difficulty ?: string
}

export interface GameState {
    gameId : string ,
    status : 'waiting' | 'active' | 'finished',
    admin : {
        id : string,
        name : string
    },
    players : Player[];
    currentWord : GameWord | null , 
    currentRound : number,
    maxRounds : number , 
    lastUpdated : number
}