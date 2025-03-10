/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/api/stories/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { generateStory } from '@/lib/claude';
import { generateStoryWithChatGPT } from '@/lib/openai';
import { authOptions } from '../auth/authOptions';

export async function POST(request: any) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { memoryId, scheduledFor, aiModel = 'claude' } = await request.json();
    
    console.log('Story generation request:', { memoryId, scheduledFor, aiModel });
    
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
    
    console.log(`Calling ${aiModel === 'chatgpt' ? 'ChatGPT' : 'Claude'} API...`);
    
    // Generate story using selected AI
    let storyContent;
    if (aiModel === 'chatgpt') {
      storyContent = await generateStoryWithChatGPT({
        ...memory,
        partnerName: memory.user.partnerName || 'my love',
        date: memory.date.toISOString(),
      });
    } else {
      storyContent = await generateStory({
        ...memory,
        partnerName: memory.user.partnerName || 'my love',
        date: memory.date.toISOString(),
      });
    }
    
    console.log('Story generated successfully');
    
    // Create a title based on memory title
    const storyTitle = `Story about ${memory.title}`;
    
    // Create the story in the database
    const story = await prisma.story.create({
      data: {
        title: storyTitle,
        content: storyContent,
        memoryId: memory.id,
        userId: session.user.id,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        deliveryStatus: 'PENDING',
        aiModel: aiModel || 'claude',
      },
    });
    
    console.log('Story saved to database with ID:', story.id);
    
    return NextResponse.json(story);
  } catch (error) {
    console.log('error creating story', error);
    console.error('Error creating story:', error);
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 });
  }
}


// GET /api/stoires - Retrieve all memories for the logged in user
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