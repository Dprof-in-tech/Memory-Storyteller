/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai';

// Initialize the OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStoryWithChatGPT(memory: any) {
  try {
    
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
      5. Keep the story between 300-400 words.
      6. End with a reflection on why this memory matters to our relationship.
      7. Make the narrative flow naturally, incorporating all the relevant details provided.
      8. Use descriptive language that evokes the emotions mentioned.
    `;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a skilled storyteller specializing in romantic, personal narratives.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    
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
    
    return storyContent;
  } catch (error:any) {
 
    // If it's an OpenAI API error, log more details
    if (error.response) {
      console.error('OpenAI API error data:', error.response.data);
    }
    
    throw new Error(`ChatGPT API error: ${error.message}`);
  }
}