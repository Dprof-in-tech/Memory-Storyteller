/* eslint-disable @typescript-eslint/no-explicit-any */
import { Anthropic } from '@anthropic-ai/sdk';

// Correctly initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateStory(memory: any) {
  try {
    
    // Extract metadata fields if they exist
    const metadata = memory.metadata || {};
    
    const prompt = `
    Create a heartfelt story based on this memory:
    
    CONTEXT:
    - Title: ${memory.title}
    - Date: ${new Date(memory.date).toLocaleDateString()}
    - Location: ${memory.location || ''}
    - Weather/Time: ${metadata.timeAndWeather || ''}
    - People: ${memory.people || ''} ${metadata.peopleActions ? `(${metadata.peopleActions})` : ''} ${metadata.peopleAppearance ? `(${metadata.peopleAppearance})` : ''}
    - Before: ${metadata.leadUp || ''}
    - Key Moment: ${metadata.keyMoment || ''}
    - Scene: ${memory.description || ''}
    
    FEELINGS:
    - Initial: ${metadata.initialFeeling || ''}
    - Journey: ${metadata.emotionalJourney || ''}
    - Strongest: ${metadata.strongestEmotion || ''}
    - Overall: ${memory.feelings || ''}
    
    MEANING:
    - Impact: ${metadata.impact || ''} 
    - Would change: ${metadata.wouldChange || ''}
    - Significance: ${memory.significance || ''}
    - Sensory details: ${memory.sensoryDetails || ''}
    
    REQUIREMENTS:
    Write 300-400 words in first person to ${memory.partnerName || 'my love'}. Warm, intimate tone with sensory details. Clear beginning, middle, end. Conclude with why this memory matters to our relationship. Use natural flow and evocative language.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [
        { role: 'user', content: prompt }
      ],
    });
    
    // Use type assertion to tell TypeScript we know the structure
    return (response.content[0] as any).text;
  } catch (error: any) {
    console.error('Error generating story with Claude:', error);
    throw new Error(`Claude API error: ${error.message}`);
  }
}