/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { authOptions } from '../auth/authOptions';

// GET /api/stories - Retrieve all stories for the logged in user
export async function GET(request: any) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const stories = await prisma.story.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: { // Include related memory data
        memory: {
          select: {
            title: true,
          },
        },
      },
    });
    
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

// POST /api/stories - Create a new story placeholder
export async function POST(request: any) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { memoryId, scheduledFor, aiModel = 'claude' } = await request.json();
    
    // Retrieve the memory with user information
    const memory = await prisma.memory.findUnique({
      where: { id: memoryId },
      include: { 
        user: {
          select: {
            partnerName: true,
          },
        },
      },
    });
    
    console.log('Memory found:', memory ? 'Yes' : 'No');
    
    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }
    
    if (memory.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to access this memory' }, { status: 403 });
    }
    
    // Create a title based on memory title
    const storyTitle = `Story about ${memory.title}`;
    
    // Create a placeholder story in the database
    const story = await prisma.story.create({
      data: {
        title: storyTitle,
        content: "Your story is being crafted with care...",
        memoryId: memory.id,
        userId: session.user.id,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        deliveryStatus: 'PENDING',
        aiModel: aiModel || 'claude',
        // Add metadata to track generation status
        metadata: {
          generationStatus: 'PENDING'
        }
      },
    });
    
    console.log('Story placeholder created with ID:', story.id);
    
    return NextResponse.json({
      id: story.id,
      status: 'pending',
      message: 'Story creation started'
    });
  } catch (error) {
    console.log('Error creating story placeholder:', error);
    console.error('Error creating story placeholder:', error);
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 });
  }
}