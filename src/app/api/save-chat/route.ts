import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chats } = body;

    if (!chats) {
      return NextResponse.json(
        { error: 'Chat data is required' },
        { status: 400 }
      );
    }

    // Save to database - upsert the backup
    const data = typeof chats === 'string' ? chats : JSON.stringify(chats);

    // Delete existing backups and create new one
    await db.chatBackup.deleteMany({});
    await db.chatBackup.create({
      data: { data },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save chat error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save chat' },
      { status: 500 }
    );
  }
}
