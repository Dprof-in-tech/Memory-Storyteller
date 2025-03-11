/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { deliverStory } from '@/lib/scheduler';

// POST /api/stories/[id]/deliver - Manually deliver a story
export async function POST(request: any, { params }: {params: any}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { id } = params;
  
  if (!id) {
    return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
  }
  
  try {
    // Use the deliverStory function from scheduler.js
    await deliverStory(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error delivering story:', error);
    
    return NextResponse.json({ 
      error: 'Failed to deliver story',
      message: error.message
    }, { status: 500 });
  }
}