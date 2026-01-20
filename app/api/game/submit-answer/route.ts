import { getOrCreateGame, updatePlayerScore } from "../../../../lib/gameState";
import { calculateSimilarity, getPointsFromSimilarity } from "../../../../lib/scoring";
import { NextResponse } from "next/server";

export async function POST(req : Request) {
    try {
        const {playerId , answer} = await req.json();
        const game = await getOrCreateGame();

        if(!game.currentWordEnglish) {
            return NextResponse.json({
                error : 'No active word'
            }, {
                status : 400
            })
        }

        const player = game.players.find((p: any) => p.id === playerId);
        if(!player ) {
            return NextResponse.json({
                error : 'Player not found'
            }, {
                status : 404
            });
        }
        // TODO :- similarity and points calc
        const similarity = calculateSimilarity(answer , game.currentWordEnglish);
        const points  = getPointsFromSimilarity(similarity);

        if(points > 0){
            await updatePlayerScore(playerId,points);
        }

        return NextResponse.json({
            correct : points > 0,
            points, 
            similarity : Math.round(similarity*100),
            correctAnswer : points < 1 ? game.currentWordEnglish : undefined
        })
    } catch (error) {
        return NextResponse.json({
            error : "Failed to submit answer"
        }, {
            status : 500
        })   
    }
}