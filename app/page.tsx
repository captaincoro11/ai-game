// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');

  const handleJoinAsAdmin = () => {
    router.push('/admin');
  };

  const handleJoinAsPlayer = () => {
    if (playerName.trim()) {
      localStorage.setItem('playerName', playerName);
      router.push('/player');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center sticky flex justify-between">
          <p className="text-xl font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
             French Word Game
          </p>
          <p className="text-sm md:text-md font-mono text-gray-600">
            Test your French vocabulary skills with friends!
          </p>
        </div>
        <div className=' border-2 border-black'/>

        {/* Main Cards */}
        <div className="grid mt-12 md:grid-cols-2 gap-6">
          {/* Admin Card */}
          <Card className="border-2 hover:transition-transform shadow-2xl transition-all hover:shadow-xl">
              <CardTitle className="text-2xl text-center font-mono"> Join as Admin</CardTitle>
              <CardDescription className=" text-gray-600 font-mono text-center">
                Control the game and generate French words
              </CardDescription>
            <CardContent className="pt-6">
              <ul className="space-y-3 mb-6 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  Generate French words with AI
                </li>
                <div className=' border'/>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  Control game rounds
                </li>
                <div className=' border'/>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  View live scores
                </li>
                <div className=' border'/>
              </ul>
              <Button 
                onClick={handleJoinAsAdmin}
                className="w-full mt-12 font-mono bg-purple-600 hover:bg-purple-700 hover:cursor-pointer"
                size="lg"
              >
                Start as Admin
              </Button>
            </CardContent>
          </Card>

          {/* Player Card */}
          <Card className="border-2 shadow-2xl transition-all hover:shadow-xl">
            {/* <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg"> */}
              <CardTitle className="text-2xl font-mono text-center"> Join as Player</CardTitle>
              <CardDescription className="text-gray-600 text-center font-mono ">
                Translate French words and earn points
              </CardDescription>
            {/* </CardHeader> */}
            <CardContent className="pt-6">
              <ul className="space-y-3 mb-6 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  Translate French words to English
                </li>
                <div className=' border'/>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  Earn points for correct answers
                </li>
                <div className=' border'/>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  Compete with 5 players
                </li>
                <div className=' border'/>
              </ul>
              <div className="space-y-3">
                <Input
                  placeholder="Enter your name..."
                  value={playerName}
                  onChange={(e : any) => setPlayerName(e.target.value)}
                  className="text-lg p-4"
                  onKeyDown={(e : any) => e.key === 'Enter' && handleJoinAsPlayer()}
                />
                <Button 
                  onClick={handleJoinAsPlayer}
                  className="w-full font-mono bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  disabled={!playerName.trim()}
                >
                  Join Game
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Info */}
        <Card className="mt-8 bg-white/50 shadow-2xl font-mono backdrop-blur">
          <CardHeader>
            <CardTitle>How to Play</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-4xl mb-2">1️⃣</div>
                <h3 className="font-semibold mb-1">Admin Generates</h3>
                <p className="text-sm text-gray-600">Admin clicks to generate a French word using AI</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">2️⃣</div>
                <h3 className="font-semibold mb-1">Players Translate</h3>
                <p className="text-sm text-gray-600">Players type the English translation</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">3️⃣</div>
                <h3 className="font-semibold mb-1">Earn Points</h3>
                <p className="text-sm text-gray-600">Get 1 point for exact, 0.75 for close, 0.5 for partial</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
