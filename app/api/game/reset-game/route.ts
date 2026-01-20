import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    await prisma.game.deleteMany({});
    
    return NextResponse.json({ success: true, message: 'Game reset' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset' }, { status: 500 });
  }
}
