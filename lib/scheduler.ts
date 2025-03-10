/* eslint-disable @typescript-eslint/no-explicit-any */
// /lib/scheduler.js - Updated to use partner's phone number
import cron from 'node-cron';
import prisma from './db';
import { sendWhatsAppMessage } from './whatsapp';

// Initialize the scheduler
export function initScheduler() {
  // Run every hour to check for stories that need to be delivered
  cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled delivery check:', new Date().toISOString());
    
    const now = new Date();
    
    try {
      // Find stories scheduled for delivery
      const storiesToDeliver = await prisma.story.findMany({
        where: {
          scheduledFor: {
            lte: now,
          },
          deliveryStatus: 'PENDING',
        },
        include: {
          user: {
            select: {
              phoneNumber: true,
              partnerPhoneNumber: true,
              name: true,
              partnerName: true,
            },
          },
          memory: {
            select: {
              title: true,
            },
          },
        },
      });
      
      console.log(`Found ${storiesToDeliver.length} stories to deliver`);
      
      // Process each story
      for (const story of storiesToDeliver) {
        try {
          // Use partner's phone number if available, otherwise fall back to user's number
          const deliveryPhoneNumber = story.user.partnerPhoneNumber || story.user.phoneNumber;
          
          if (!deliveryPhoneNumber) {
            console.log(`No phone number for delivery (story ${story.id}), marking as failed`);
            await prisma.story.update({
              where: { id: story.id },
              data: { deliveryStatus: 'FAILED' },
            });
            continue;
          }
          
          // Format message for the recipient
          let recipientName = story.user.partnerName || 'loved one';
          let senderName = story.user.name || 'Someone special';
          
          // If sending to self rather than partner, adjust the message
          if (!story.user.partnerPhoneNumber && story.user.phoneNumber) {
            recipientName = 'you';
            senderName = 'your partner';
          }
          
          // Format the message for WhatsApp
          const message = `
🌟 Memory Storyteller 🌟

A special memory for ${recipientName}:

"${story.title}"

${story.content.substring(0, 2000)}${story.content.length > 2000 ? '...' : ''}

Sent with ❤️ from ${senderName}
          `.trim();
          
          console.log(`Sending story ${story.id} to ${deliveryPhoneNumber}`);
          
          // Send the message via Green API
          await sendWhatsAppMessage(deliveryPhoneNumber, message);
          
          // Update delivery status
          await prisma.story.update({
            where: { id: story.id },
            data: { deliveryStatus: 'SENT' },
          });
          
          console.log(`Successfully delivered story ${story.id}`);
          
          // Add a delay between messages to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 3000));
          
        } catch (error) {
          console.error(`Error delivering story ${story.id}:`, error);
          
          // Update delivery status on failure
          await prisma.story.update({
            where: { id: story.id },
            data: { deliveryStatus: 'FAILED' },
          });
        }
      }
    } catch (error) {
      console.error('Error in scheduled delivery job:', error);
    }
  });
  
  console.log('Story delivery scheduler initialized');
}

// Helper function for manual delivery of a story
export async function deliverStory(storyId: any) {
  try {
    // Get the story with user info
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: { 
        user: {
          select: {
            phoneNumber: true,
            partnerPhoneNumber: true,
            name: true,
            partnerName: true,
          },
        },
      },
    });
    
    if (!story) {
      throw new Error('Story not found');
    }
    
    // Use partner's phone number if available, otherwise fall back to user's number
    const deliveryPhoneNumber = story.user.partnerPhoneNumber || story.user.phoneNumber;
    
    if (!deliveryPhoneNumber) {
      throw new Error('No phone number available for delivery');
    }
    
    // Format message for the recipient
    let recipientName = story.user.partnerName || 'loved one';
    let senderName = story.user.name || 'Someone special';
    
    // If sending to self rather than partner, adjust the message
    if (!story.user.partnerPhoneNumber && story.user.phoneNumber) {
      recipientName = 'you';
      senderName = 'your partner';
    }
    
    // Format the message for WhatsApp
    const message = `
🌟 Memory Storyteller 🌟

A special memory for ${recipientName}:

"${story.title}"

${story.content.substring(0, 2000)}${story.content.length > 2000 ? '...' : ''}

Sent with ❤️ from ${senderName}
    `.trim();
    
    // Send the message via Green API
    await sendWhatsAppMessage(deliveryPhoneNumber, message);
    
    // Update delivery status
    await prisma.story.update({
      where: { id: story.id },
      data: { deliveryStatus: 'SENT' },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error delivering story:', error);
    
    // Update delivery status on failure if we have a storyId
    if (storyId) {
      await prisma.story.update({
        where: { id: storyId },
        data: { deliveryStatus: 'FAILED' },
      });
    }
    
    throw error;
  }
}

// Initialize scheduler for production builds
if (process.env.NODE_ENV === 'production') {
  initScheduler();
}