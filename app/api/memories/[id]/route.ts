/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/db';
import { authOptions } from '../../auth/authOptions';
import fs from 'fs';
import path from 'path';


// GET /api/memories/[id] - Retrieve a specific memory
export async function GET(request: any, { params }: {params: any}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const memory = await prisma.memory.findUnique({
      where: {
        id: params.id,
      },
      include: {
        photos: true,
      },
    });
    
    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }
    
    if (memory.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to access this memory' }, { status: 403 });
    }
    
    return NextResponse.json(memory);
  } catch (error) {
    console.error('Error fetching memory:', error);
    return NextResponse.json({ error: 'Failed to fetch memory' }, { status: 500 });
  }
}

// PUT /api/memories/[id] - Update a memory
export async function PUT(request: any, { params }: {params: any}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Check if memory exists and belongs to user
    const existingMemory = await prisma.memory.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!existingMemory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }
    
    if (existingMemory.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to update this memory' }, { status: 403 });
    }
    
    const data = await request.json();
    
    // Update the memory
    const memory = await prisma.memory.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        date: new Date(data.date),
        location: data.location,
        people: data.people,
        description: data.description,
        feelings: data.feelings,
        sensoryDetails: data.sensoryDetails,
        significance: data.significance,
      },
    });
    
    // Handle photos update if needed
    // This would be more complex in a real app
    
    return NextResponse.json(memory);
  } catch (error) {
    console.error('Error updating memory:', error);
    return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
  }
}

// DELETE /api/memories/[id] - Delete a memory
// Function to check if a directory is empty
function isDirEmpty(dirname: string): boolean {
  try {
    const files = fs.readdirSync(dirname);
    return files.length === 0;
  } catch (error) {
    console.error(`Error checking if directory is empty: ${dirname}`, error);
    return false;
  }
}

export async function DELETE(request: any, { params }:{params: any}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Check if memory exists and belongs to user
    const existingMemory = await prisma.memory.findUnique({
      where: {
        id: params.id,
      },
      include: {
        photos: true, // Include photos to get their paths
      },
    });
    
    if (!existingMemory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }
    
    if (existingMemory.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this memory' }, { status: 403 });
    }
    
    // Track unique directories that need to be checked later
    const directories = new Set<string>();
    
    // Delete the actual image files
    if (existingMemory.photos && existingMemory.photos.length > 0) {
      for (const photo of existingMemory.photos) {
        try {
          // Get the file path from the photo URL
          // Example: if URL is /uploads/userId/filename.jpg, we need to delete public/uploads/userId/filename.jpg
          const relativePath = photo.url;
          const filePath = path.join(process.cwd(), 'public', relativePath);
          
          // Store the directory for later cleanup check
          const dirPath = path.dirname(filePath);
          directories.add(dirPath);
          
          // Check if file exists
          if (fs.existsSync(filePath)) {
            // Delete the file
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
          }
        } catch (fileError) {
          // Log error but continue with deletion process
          console.error(`Error deleting file for photo ${photo.id}:`, fileError);
        }
      }
    }
    
    // Delete associated photos from database
    await prisma.photo.deleteMany({
      where: {
        memoryId: params.id,
      },
    });
    
    // Delete associated stories
    await prisma.story.deleteMany({
      where: {
        memoryId: params.id,
      },
    });
    
    // Delete the memory
    await prisma.memory.delete({
      where: {
        id: params.id,
      },
    });
    
    // Clean up empty directories
    directories.forEach(dir => {
      try {
        if (isDirEmpty(dir)) {
          fs.rmdirSync(dir);
          console.log(`Removed empty directory: ${dir}`);
          
          // Check if parent directory is now empty
          const parentDir = path.dirname(dir);
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
          
          // Only remove parent if it's not the main uploads directory
          if (parentDir !== uploadsDir && isDirEmpty(parentDir)) {
            fs.rmdirSync(parentDir);
            console.log(`Removed empty parent directory: ${parentDir}`);
          }
        }
      } catch (dirError) {
        console.error(`Error removing directory: ${dir}`, dirError);
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  }
}