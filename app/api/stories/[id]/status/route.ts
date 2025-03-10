/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/api/stories/[id]/status/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { authOptions } from '@/app/api/auth/authOptions';

export type StoryMetadata = {
    generationStatus?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    completedAt?: string;
    error?: string;
  };

export async function GET(request: any, { params }: { params: any }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { id } = params;
  
  if (!id) {
    return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
  }
  
  try {
    const story = await prisma.story.findUnique({
      where: { id },
      select: {
        userId: true,
        content: true,
        metadata: true,
      },
    });
    
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    
    if (story.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to access this story' }, { status: 403 });
    }
    
    // Extract generation status from metadata
    const metadata = (story.metadata as StoryMetadata | null) || {};
const generationStatus = metadata.generationStatus || 'UNKNOWN';
    
    // Determine if content is the placeholder text
    const isPlaceholder = story.content === "Your story is being crafted with care...";
    
    return NextResponse.json({
      id,
      status: generationStatus,
      isComplete: generationStatus === 'COMPLETED',
      isFailed: generationStatus === 'FAILED',
      isProcessing: generationStatus === 'PROCESSING' || generationStatus === 'PENDING',
      hasContent: !isPlaceholder
    });
  } catch (error) {
    console.error('Error checking story status:', error);
    return NextResponse.json({ error: 'Failed to check story status' }, { status: 500 });
  }
}