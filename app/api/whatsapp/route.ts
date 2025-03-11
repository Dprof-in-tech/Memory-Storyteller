/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(request: any) {
  try {
    const { storyId } = await request.json();
    
    // Get the story with user info
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: { 
        user: true,
        memory: true,
      },
    });
    
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    
    if (!story.user.phoneNumber) {
      return NextResponse.json({ 
        error: 'User has no phone number for WhatsApp delivery' 
      }, { status: 400 });
    }
    
    // Format the message (you might want to limit the length for WhatsApp)
    const message = `
🌟 Memory Storyteller 🌟

"${story.title}"

${story.content.substring(0, 1000)}${story.content.length > 1000 ? '...' : ''}

[View the full story at ${process.env.NEXT_PUBLIC_APP_URL}/stories/${story.id}]
    `.trim();
    
    // Send the message via WhatsApp
    await sendWhatsAppMessage(story.user.phoneNumber, message);
    
    // Update delivery status
    await prisma.story.update({
      where: { id: story.id },
      data: { deliveryStatus: 'SENT' },
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    
    // Update delivery status on failure
    if (error.storyId) {
      await prisma.story.update({
        where: { id: error.storyId },
        data: { deliveryStatus: 'FAILED' },
      });
    }
    
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
