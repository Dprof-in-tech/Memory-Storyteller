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
    
    // Extract metadata fields if they exist
    const metadata = memory.metadata || {};
    
    const prompt = `
      Create a heartfelt short story about this memory:
      
      BASIC DETAILS:
      Title: ${memory.title}
      Date: ${new Date(memory.date).toLocaleDateString()}
      
      SETTING THE SCENE:
      Location: ${memory.location || 'Not specified'}
      Time and Weather: ${metadata.timeAndWeather || 'Not specified'}
      Sensory Details: ${memory.sensoryDetails || 'Not specified'}
      
      CHARACTERS:
      People Present: ${memory.people || 'Not specified'}
      What They Were Doing: ${metadata.peopleActions || 'Not specified'}
      How They Looked/Acted: ${metadata.peopleAppearance || 'Not specified'}
      
      THE STORY:
      What Happened Before: ${metadata.leadUp || 'Not specified'}
      Key Moment: ${metadata.keyMoment || 'Not specified'}
      Scene Description: ${memory.description || 'Not specified'}
      
      EMOTIONS:
      Initial Feelings: ${metadata.initialFeeling || 'Not specified'}
      Emotional Journey: ${metadata.emotionalJourney || 'Not specified'}
      Strongest Emotion: ${metadata.strongestEmotion || 'Not specified'}
      General Feelings: ${memory.feelings || 'Not specified'}
      
      SIGNIFICANCE:
      Impact: ${metadata.impact || 'Not specified'}
      What I Would Change: ${metadata.wouldChange || 'Not specified'}
      Why This Memory Is Special: ${memory.significance || 'Not specified'}
      
      WRITING INSTRUCTIONS:
      1. Write in first person as if I'm telling this memory to my partner named ${memory.partnerName || 'my love'}.
      2. Maintain a warm and intimate tone.
      3. Include sensory details to make the memory vivid.
      4. Structure the story with a clear beginning, middle, and end.
      5. Keep the story between 400-600 words.
      6. End with a reflection on why this memory matters to our relationship.
      7. Make the narrative flow naturally, incorporating all the relevant details provided.
      8. Use descriptive language that evokes the emotions mentioned.
    `;

    console.log('Sending request to Claude API...');
    
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    console.log('Received response from Claude API');
    
    // Use type assertion to tell TypeScript we know the structure
    return (response.content[0] as any).text;
  } catch (error: any) {
    console.error('Error generating story with Claude:', error);
    throw new Error(`Claude API error: ${error.message}`);
  }
}