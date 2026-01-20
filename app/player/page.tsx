// app/player/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Check, X, Loader2, Trophy } from 'lucide-react';

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

export default function PlayerView() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    show: boolean;
    correct: boolean;
    points: number;
    similarity: number;
    correctAnswer?: string;
  } | null>(null);

  useEffect(() => {
    const name = localStorage.getItem('playerName') || '';
    setPlayerName(name);
    fetchGameState(name);
    const interval = setInterval(fetchGameState, 2000);
    return () => clearInterval(interval);
  }, []);

 const fetchGameState = async (name?: string) => {
  try {
    const res = await fetch('/api/game/state');
    const data = await res.json();

    setGameState(data);

    if (name && !playerId) {
      const player = data.players.find((p: Player) => p.name === name);
      if (player) setPlayerId(player.id);
    }
  } catch (e) {
    console.error(e);
  }
};


  const submitAnswer = async () => {
    if (!answer.trim() || !playerId) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/game/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, answer: answer.trim() })
      });
      const data = await res.json();
      
      setFeedback({
        show: true,
        correct: data.correct,
        points: data.points,
        similarity: data.similarity,
        correctAnswer: data.correctAnswer
      });
      
      setAnswer('');
      await fetchGameState();
      
      // Hide feedback after 3 seconds
      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
    setSubmitting(false);
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const currentPlayer = gameState.players.find(p => p.id === playerId);
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const playerRank = sortedPlayers.findIndex(p => p.id === playerId) + 1;
  const progress = (gameState.currentRound / gameState.maxRounds) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            🎮 {playerName}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <Badge variant={gameState.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {gameState.status}
            </Badge>
            <span className="text-gray-600">
              Round {gameState.currentRound} / {gameState.maxRounds}
            </span>
          </div>
        </div>

        {/* Progress */}
        <Progress value={progress} className="mb-6 h-2" />

        {/* Player Stats */}
        {currentPlayer && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-900">{currentPlayer.score.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Your Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-purple-900">#{playerRank}</div>
                <div className="text-sm text-gray-600">Your Rank</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-green-900">{gameState.maxRounds - gameState.currentRound}</div>
                <div className="text-sm text-gray-600">Rounds Left</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Game Area */}
        {gameState.status === 'WAITING' && (
          <Alert>
            <AlertDescription className="text-center text-lg">
              ⏳ Waiting for admin to start the game...
            </AlertDescription>
          </Alert>
        )}

        {gameState.status === 'ACTIVE' && gameState.currentWord && (
          <Card className="border-2 font-mono border-blue-300 shadow-xl">
            {/* <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"> */}
              <CardTitle className="text-center text-2xl">Translate this word</CardTitle>
            {/* </CardHeader> */}
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-blue-900 mb-4">
                  {gameState.currentWord.french}
                </div>
                <Badge variant="outline">French → English</Badge>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Type English translation..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                  className="text-xl h-14"
                  disabled={submitting}
                />
                <Button
                  onClick={()=>submitAnswer()}
                  disabled={submitting || !answer.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                  ) : (
                    'Submit Answer'
                  )}
                </Button>
              </div>

              {/* Feedback */}
              {feedback?.show && (
                <Alert className={`mt-4 ${feedback.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center gap-2">
                    {feedback.correct ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                    <AlertDescription className={feedback.correct ? 'text-green-800' : 'text-red-800'}>
                      <div className="font-semibold">
                        {feedback.correct ? '✅ Correct!' : '❌ Incorrect'}
                      </div>
                      <div className="text-sm">
                        Points earned: {feedback.points} | Similarity: {feedback.similarity}%
                      </div>
                      {feedback.correctAnswer && (
                        <div className="text-sm mt-1">
                          Correct answer: <strong>{feedback.correctAnswer}</strong>
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {gameState.status === 'FINISHED' && (
          <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-center text-3xl flex items-center justify-center gap-2">
                <Trophy className="h-8 w-8 text-yellow-600" />
                Game Over!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-lg text-gray-600 mb-2">Your Final Score</div>
                <div className="text-5xl font-bold text-blue-900">{currentPlayer?.score.toFixed(2)}</div>
                <div className="text-xl text-gray-600 mt-2">Rank: #{playerRank}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mini Leaderboard */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded ${
                    player.id === playerId ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold w-6">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <span className="font-medium">{player.name}</span>
                  </div>
                  <span className="font-bold text-lg">{player.score.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
