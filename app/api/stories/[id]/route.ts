/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/db';
import { authOptions } from '../../auth/authOptions';

// GET /api/stories/[id] - Retrieve a specific story
export async function GET(request: any, { params} : {params: any}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const story = await prisma.story.findUnique({
      where: {
        id: params.id,
      },
      include: {
        memory: {
          select: {
            title: true,
            date: true,
            location: true,
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
    
    return NextResponse.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 });
  }
}

// PATCH /api/stories/[id] - Update a story (e.g., update scheduled time)
export async function PATCH(request: any, { params }: {params: any}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Check if story exists and belongs to user
    const existingStory = await prisma.story.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!existingStory) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    
    if (existingStory.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to update this story' }, { status: 403 });
    }
    
    const data = await request.json();
    
    // Update the story
    const story = await prisma.story.update({
      where: {
        id: params.id,
      },
      data: {
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : existingStory.scheduledFor,
        deliveryStatus: data.deliveryStatus || existingStory.deliveryStatus,
      },
    });
    
    return NextResponse.json(story);
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 });
  }
}

// DELETE /api/stories/[id] - Delete a story
export async function DELETE(request: any, { params }: {params: any}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Check if story exists and belongs to user
    const existingStory = await prisma.story.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!existingStory) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    
    if (existingStory.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this story' }, { status: 403 });
    }
    
    // Delete the story
    await prisma.story.delete({
      where: {
        id: params.id,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
  }
}
