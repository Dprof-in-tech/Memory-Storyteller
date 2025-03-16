// app/api/photo-upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// NOTE: formidable doesn't work properly with App Router
// We need to use the Web API FormData instead

export async function POST(request: NextRequest) {
  try {
    // Parse the FormData from the request
    const formData = await request.formData();
    
    // Get the user ID from the form data
    const userId = formData.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID not provided' }, { status: 400 });
    }
    
    // Get the filename from the form data
    const filenameFromForm = formData.get('filename');
    
    // Get the file from the form data
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Create a filename if none was provided
    const filename = filenameFromForm ? 
      String(filenameFromForm) : 
      `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Check if the uploads directory exists, if not create it
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Create user-specific directory
    const userIdString = String(userId).replace(/\s+/g, '');
    const userDir = path.join(uploadsDir, userIdString);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    // Get file data as array buffer and convert to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write file to disk
    const filePath = path.join(userDir, filename);
    fs.writeFileSync(filePath, buffer);
    
    // Return success response with the file path
    const relativePath = `/uploads/${userIdString}/${filename}`;
    
    return NextResponse.json({
      files: [{
        name: file.name,
        path: relativePath
      }]
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// This config is needed to disable the body parser
export const config = {
  api: {
    bodyParser: false,
  },
};