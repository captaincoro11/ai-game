import { getOrCreateGame } from "../../../../lib/gameState";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const game = await getOrCreateGame();
        const publicState = {
            id : game.id,
            status : game.status , 
            currentRound : game.currentRound , 
            maxRounds : game.maxRounds,
            admin : {
                id : game.adminId,
                name : game.adminName
            },
            players : game.players.map((p : any) => ({
                id : p.id,
                name : p.name , 
                score : p.score , 
                position : p.position
            })),
            currentWord : game.currentWordFrench ? {
                french : game.currentWordFrench 
            } : null,
            updatedAt : game.updatedAt
        };

        return NextResponse.json(publicState);

    } catch (error) {   
        return NextResponse.json({
            error : "Failed to get game state"
        }, {
            status : 500
        })
    }
}