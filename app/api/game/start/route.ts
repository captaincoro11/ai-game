import { getOrCreateGame, startGame } from "../../../../lib/gameState";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const game = await getOrCreateGame();
        const updateGame = await startGame(game.id);

        return NextResponse.json({
            success : true,
            game : updateGame
        });
    } catch (error) {
        return NextResponse.json({
            error : "Failed to start game"
        }, {
            status : 500
        })
    }
}