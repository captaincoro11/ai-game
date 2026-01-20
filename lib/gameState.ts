import { GameStatus } from '../app/generated/prisma/enums';
import {prisma} from './prisma';

export async function getOrCreateGame(){
    let game = await prisma.game.findFirst({
        where : {
            status : {in : ['WAITING', 'ACTIVE']}
        },
        include: {
            players : {
                orderBy : {position : 'asc'}
            }
        }
    });

    if(!game) {
        game = await prisma.game.create({
            data : {
                adminId : 'admin1',
                adminName : 'Admin',
                players : {
                    create : [
                        {name : 'Player 1' ,position : 1},
                        { name: 'Player 2', position: 2 },
                        { name: 'Player 3', position: 3 },
                        { name: 'Player 4', position: 4 },
                        { name: 'Player 5', position: 5 }
                    ]
                }
            },
            include : {
                players : {
                    orderBy : {position : 'asc'}
                }
            }
        });
    }

    return game;
}

export async function updateGameWord(gameId : string , french : string , english : string) {
    return await prisma.game.update({
        where : {id : gameId},
        data : {
            currentWordFrench : french,
            currentWordEnglish : english ,
            currentRound : {increment : 1} 
        },
        include : {
            players : {
                orderBy : {position : 'asc'}
            }
        }
    });
}

export async function updatePlayerScore(playerId : string , points : number) {
    return await prisma.player.update({
        where : { id : playerId},
        data : {
            score : {
                increment : points
            }
        }
    });
}

export async function startGame(gameId : string) {
    return await prisma.game.update({
        where : {id : gameId},
        data : {
            status : GameStatus.ACTIVE,
            currentRound : 0,
            players : {
                updateMany : {
                    where : {},
                    data : {score : 0}
                }
            }
        },
        include : {
            players : {
                orderBy : {position : 'asc'}
            }
        }
    });
}

export async function finishGame(gameId: string) {
  return await prisma.game.update({
    where: { id: gameId },
    data: { status: GameStatus.FINISHED }
  });
}