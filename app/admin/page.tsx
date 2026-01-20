'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Play, RefreshCw, Trophy } from 'lucide-react';
import {toast} from "sonner"

interface Player {
  id: string;
  name: string;
  score: number;
  position: number;
}

interface GameState {
  id: string;
  status: 'WAITING' | 'ACTIVE' | 'FINISHED';
  currentRound: number;
  maxRounds: number;
  players: Player[];
  currentWord: {
    french: string;
  } | null;
}

export default function AdminDashboard() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [resetting , setResetting] = useState(false);
  
  // Fetching game state in every 2s
  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchGameState = async () => {
    try {
      const res = await fetch('/api/game/state');
      const data = await res.json();
      setGameState(data);
    } catch (error) {
      toast.error("Failed to fetch game state");
      console.error('Failed to fetch game state:', error);
    }
  };
  const resetGame = async() => {
    setResetting(true);
    try{
      await fetch('/api/game/reset-game',{method : "POST"});
      await fetchGameState();
    } catch (error) {
      toast.error('Failed to reset game');
      console.error('Failed to reset game:', error);
    }
    setResetting(false);
  }
  const startGame = async () => {
    setLoading(true);
    try {
      await fetch('/api/game/start', { method: 'POST' });
      await fetchGameState();
    } catch (error) {
      toast.error('Failed to start game');
      console.error('Failed to start game:', error);
    }
    setLoading(false);
  };

  const generateWord = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/game/generate-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty })
      });
      const data = await res.json();
      await fetchGameState();
    } catch (error) {
      toast.error('Failed to generate word');
      console.error('Failed to generate word:', error);
    }
    setGenerating(false);
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const progress = (gameState.currentRound / gameState.maxRounds) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-purple-900 mb-2">
              👑 Admin Dashboard
            </h1>
            <Badge variant={gameState.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {gameState.status}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Round Progress</div>
            <div className="text-2xl font-bold text-purple-900">
              {gameState.currentRound} / {gameState.maxRounds}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="mb-6 h-3" />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle>Game Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                {gameState.status === 'WAITING' && (
                  <Button
                    onClick={startGame}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting...</>
                    ) : (
                      <><Play className="mr-2 h-4 w-4" /> Start Game</>
                    )}
                  </Button>
                )}

                {gameState.status === 'ACTIVE' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Difficulty</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['easy', 'medium', 'hard'] as const).map((d) => (
                          <Button
                            key={d}
                            variant={difficulty === d ? 'default' : 'outline'}
                            onClick={() => setDifficulty(d)}
                            size="sm"
                            className="capitalize"
                          >
                            {d}
                          </Button>
                        ))}
                      </div>
                    </div>

                    { gameState.currentRound < gameState.maxRounds ? <Button
                      onClick={generateWord}
                      disabled={generating || gameState.currentRound >= gameState.maxRounds}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      size="lg"
                    >
                      {generating ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                      ) : (
                        <><RefreshCw className="mr-2 h-4 w-4" /> Generate Word</>
                      )}
                    </Button> : (
                      <Button onClick={resetGame}
                      // disabled={generating || gameState.currentRound >= gameState.maxRounds}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      size="lg">
                         {resetting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</>
                      ) : (
                        <><RefreshCw className="mr-2 h-4 w-4" /> Reset Game</>
                      )}
                      </Button>
                    )}
                  </>
                )}

                {gameState.status === 'FINISHED' && (
                  <Alert className="bg-green-50 border-green-200">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Game Finished! Winner: <strong>{sortedPlayers[0]?.name}</strong>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Current Word */}
            {gameState.currentWord && (
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle>Current Word</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-900 mb-2">
                      {gameState.currentWord.french}
                    </div>
                    <Badge variant="outline" className="text-sm">
                      French Word
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Live Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {sortedPlayers.map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        index === 0
                          ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300'
                          : index === 1
                          ? 'bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-gray-300'
                          : index === 2
                          ? 'bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-300'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold w-8">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{player.name}</div>
                          <div className="text-sm text-gray-600">Position {player.position}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-900">
                          {player.score.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
