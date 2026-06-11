import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const backup = await db.chatBackup.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!backup) {
      return NextResponse.json({ chats: null });
    }

    let chats;
    try {
      chats = JSON.parse(backup.data);
    } catch {
      chats = backup.data;
    }

    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Load chat error:', error);
    return NextResponse.json(
      { chats: null, error: 'Failed to load chat' },
      { status: 500 }
    );
  }
}
