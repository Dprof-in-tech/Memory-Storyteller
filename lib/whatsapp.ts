/* eslint-disable @typescript-eslint/no-explicit-any */
export async function sendWhatsAppMessage(phoneNumber: any, message: any) {
  try {
    // Green API credentials from environment variables
    const instanceId = process.env.GREEN_API_INSTANCE_ID;
    const apiTokenId = process.env.GREEN_API_TOKEN;
    
    if (!instanceId || !apiTokenId) {
      throw new Error('Green API credentials not configured');
    }

    // Format phone number - remove any non-digit characters and ensure no leading +
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    
    // Green API endpoint for sending messages
    const url = `https://api.green-api.com/waInstance${instanceId}/sendMessage/${apiTokenId}`;
    
    // Send the message
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId: `${formattedPhone}@c.us`,
        message: message
      })
    });

    const data = await response.json();
    
    // Check if message was sent successfully
    if (!data.idMessage) {
      throw new Error(`Failed to send message: ${JSON.stringify(data)}`);
    }
    
    console.log(`Message sent successfully with ID: ${data.idMessage}`);
    return data;
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
}

// Function to send message with a file attachment (for future feature enhancements)
export async function sendWhatsAppFileMessage(phoneNumber: any, caption: any, fileUrl: any, fileName: any) {
  try {
    // Green API credentials from environment variables
    const instanceId = process.env.GREEN_API_INSTANCE_ID;
    const apiTokenId = process.env.GREEN_API_TOKEN;
    
    if (!instanceId || !apiTokenId) {
      throw new Error('Green API credentials not configured');
    }

    // Format phone number
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    
    // Green API endpoint for sending file by URL
    const url = `https://api.green-api.com/waInstance${instanceId}/sendFileByUrl/${apiTokenId}`;
    
    // Send the file message
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId: `${formattedPhone}@c.us`,
        fileName: fileName,
        caption: caption,
        urlFile: fileUrl
      })
    });

    const data = await response.json();
    
    // Check if message was sent successfully
    if (!data.idMessage) {
      throw new Error(`Failed to send file message: ${JSON.stringify(data)}`);
    }
    
    console.log(`File message sent successfully with ID: ${data.idMessage}`);
    return data;
  } catch (error: any) {
    console.error('Error sending WhatsApp file message:', error);
    throw new Error(`Failed to send WhatsApp file message: ${error.message}`);
  }
}