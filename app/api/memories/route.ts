/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/api/memories/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/db';
import { authOptions } from '../auth/authOptions';

// GET /api/memories - Retrieve all memories for the logged in user
export async function GET(request: any) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const memories = await prisma.memory.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    return NextResponse.json(memories);
  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
  }
}

// POST /api/memories - Create a new memory
export async function POST(request: any) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    // Create the memory
    const memory = await prisma.memory.create({
      data: {
        title: data.title,
        date: new Date(data.date),
        location: data.location,
        people: data.people,
        description: data.description,
        feelings: data.feelings,
        sensoryDetails: data.sensoryDetails,
        significance: data.significance,
        user: {
          connect: { id: session.user.id },
        },
      },
    });
    
    // If there are photos, create them
    // Note: In a real app, you'd upload the files to a storage service first
    if (data.photos && data.photos.length > 0) {
      await prisma.photo.createMany({
        data: data.photos.map((photo: any) => ({
          url: photo,
          memoryId: memory.id,
        })),
      });
    }
    
    return NextResponse.json(memory);
  } catch (error) {
    console.error('Error creating memory:', error);
    return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 });
  }
}