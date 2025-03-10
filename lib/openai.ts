/* eslint-disable @typescript-eslint/no-explicit-any */
// /lib/openai.js
import OpenAI from 'openai';

// Initialize the OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStoryWithChatGPT(memory: any) {
  try {
    console.log('Generating story with ChatGPT for memory:', memory.title);
    
    const prompt = `
      Create a heartfelt short story about this memory:
      Date: ${new Date(memory.date).toLocaleDateString()}
      Location: ${memory.location || 'Not specified'}
      Description: ${memory.description}
      Feelings: ${memory.feelings || 'Not specified'}
      Sensory details: ${memory.sensoryDetails || 'Not specified'}
      Significance: ${memory.significance || 'Not specified'}
      
      Write in first person as if I'm telling this memory to my partner named ${memory.partnerName || 'my love'}.
      Maintain a warm and intimate tone.
      Include sensory details to make the memory vivid.
      Keep the story between 300-500 words.
      End with a reflection on why this memory matters to our relationship.
    `;

    console.log('Sending request to ChatGPT API...');
    
    // Add detailed logging
    console.log('Using model:', 'gpt-4');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Changed to gpt-3.5-turbo which is more widely available
      messages: [
        { role: 'system', content: 'You are a skilled storyteller specializing in romantic, personal narratives.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log('Received response from ChatGPT API');
    console.log('Response status:', response ? 'Success' : 'Failed');
    
    // Better response handling with more detailed logging
    if (!response || !response.choices || !response.choices.length) {
      console.error('Invalid response structure:', response);
      throw new Error('Invalid response from OpenAI API - no choices returned');
    }
    
    const choice = response.choices[0];
    if (!choice.message || !choice.message.content) {
      console.error('Invalid choice structure:', choice);
      throw new Error('Invalid choice from OpenAI API - no message content');
    }
    
    const storyContent = choice.message.content.trim();
    console.log('Successfully extracted story content, length:', storyContent.length);
    
    return storyContent;
  } catch (error:any) {
    // Detailed error logging
    console.error('Error generating story with ChatGPT:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // If it's an OpenAI API error, log more details
    if (error.response) {
      console.error('OpenAI API error status:', error.response.status);
      console.error('OpenAI API error data:', error.response.data);
    }
    
    throw new Error(`ChatGPT API error: ${error.message}`);
  }
}