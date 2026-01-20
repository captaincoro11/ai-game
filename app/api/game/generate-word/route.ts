import { finishGame, getOrCreateGame, updateGameWord } from "../../../../lib/gameState";
import { generateFrenchWord } from "../../../../lib/llm";
import { NextResponse } from "next/server";

export async function POST(req : Request){
    try {
        const game = await getOrCreateGame();
        const {difficulty} = await req.json();
        if(game.status !== 'ACTIVE') {
            return NextResponse.json({
                error : 'Game not active'
            }, {
                status : 400
            });
        }

        if(game.currentRound >= game.maxRounds) {
            await finishGame(game.id);
            return NextResponse.json({
                error : 'Game finished'
            }, {
                status : 400
            })
        }
        // TODO :- generateFrenchWord using LLM
        const word = await generateFrenchWord(difficulty);
        console.log(word);
        const updateGame = await updateGameWord(game.id , word.french , word.english);

        return NextResponse.json({
            french : word.french,
            round : updateGame.currentRound,
            maxRounds : updateGame.maxRounds
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            error : 'Failed to generate words',
        }, {
            status : 500
        })
    }
}