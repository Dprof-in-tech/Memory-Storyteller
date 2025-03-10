/* eslint-disable @typescript-eslint/no-explicit-any */
// Ensure your Claude integration is correct
import { Anthropic } from '@anthropic-ai/sdk';

// Correctly initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateStory(memory: any) {
  try {
    console.log('Generating story with Claude for memory:', memory.title);
    
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

    console.log('Sending request to Claude API...');
    
    // Be careful with model name - make sure this is correct
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',  // Check this model name is current
      max_tokens: 1000,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    console.log('Received response from Claude API', response);
    
        // Use type assertion to tell TypeScript we know the structure
        return (response.content[0] as any).text;

  } catch (error: any) {
    console.error('Error generating story with Claude:', error);
    throw new Error(`Claude API error: ${error.message}`);
  }
}