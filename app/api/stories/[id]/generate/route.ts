/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/api/stories/[id]/generate/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { generateStory } from '@/lib/claude';
import { generateStoryWithChatGPT } from '@/lib/openai';
import { authOptions } from '@/app/api/auth/authOptions';

export async function POST(request: any, { params }: { params: any }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { id } = params;
  
  if (!id) {
    return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
  }
  
  try {
    // Get the story with memory and user info
    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        memory: true,
        user: {
          select: {
            partnerName: true,
          },
        },
      },
    });
    
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    
    if (story.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to access this story' }, { status: 403 });
    }
    
    // Update status to processing
    await prisma.story.update({
      where: { id },
      data: {
        metadata: {
          generationStatus: 'PROCESSING'
        }
      }
    });
    
    // Generate story content in a non-blocking way
    generateStoryContentAsync(story);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Story generation started'
    });
  } catch (error) {
    console.error('Error starting story generation:', error);
    return NextResponse.json({ error: 'Failed to start story generation' }, { status: 500 });
  }
}

// This function runs asynchronously and doesn't block the response
async function generateStoryContentAsync(story: any) {
  try {
    console.log(`Starting async generation for story ${story.id} using ${story.aiModel}`);
    
    // Prepare memory data for story generation
    const memoryData = {
      ...story.memory,
      partnerName: story.user.partnerName || 'my love',
      date: story.memory.date.toISOString(),
    };
    
    // Generate story using selected AI
    let storyContent;
    if (story.aiModel === 'chatgpt') {
      storyContent = await generateStoryWithChatGPT(memoryData);
    } else {
      storyContent = await generateStory(memoryData);
    }
    
    console.log(`Story generation successful for story ${story.id}`);
    
    // Update the story with the generated content
    await prisma.story.update({
      where: { id: story.id },
      data: {
        content: storyContent,
        metadata: {
          generationStatus: 'COMPLETED',
          completedAt: new Date().toISOString()
        }
      },
    });
    
    console.log(`Story ${story.id} updated with generated content`);
  } catch (error) {
    console.error(`Error generating story content for story ${story.id}:`, error);
    
    // Update the story to indicate failure
    await prisma.story.update({
      where: { id: story.id },
      data: {
        content: "We encountered an issue while creating your story. Please try again.",
        metadata: {
          generationStatus: 'FAILED',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      },
    });
  }
}