import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { queryDocuments } from '@/lib/vectorStore';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        response: "Oops! I'm not properly configured yet. Please ask an administrator to add the Groq API key.",
      });
    }

    // Query RTG policy documents from ChromaDB
    const results = await queryDocuments(message, 5);
    
    // Extract the relevant context and check distances (similarity scores)
    const context = results.documents[0]?.join('\n\n') || '';
    const distances = results.distances?.[0] || [];
    
    // Check if we have relevant policy documents (distance < 0.8 means good match)
    const hasRelevantContext = context && distances && distances.length > 0 && distances[0] !== null && distances[0] < 0.8;

    let systemPrompt = '';

    if (hasRelevantContext) {
      // We found relevant RTG policy information
      systemPrompt = `You are Sky, a knowledgeable and friendly colleague at Rainbow Tourism Group (RTG). You help employees navigate company policies and procedures naturally, as if you're having a conversation over coffee.

Your style:
- Conversational and warm - talk like a helpful coworker, not a robot
- Confident and knowledgeable - you know RTG inside and out
- Natural flow - reference previous parts of the conversation when relevant
- Use "we" and "our" when talking about RTG (e.g., "Our dress code policy...")
- Greet new conversations with "Refreshing Day!" (RTG standard greeting)
- Keep responses focused and practical - get to the point but stay friendly

IMPORTANT:
- Give clear, direct answers based on the policy information provided
- If you're confident about something in the docs, state it naturally
- Don't apologize or say "I don't know" - instead, guide them helpfully
- If something specific isn't covered, acknowledge what you DO know, then suggest next steps

RTG Policy Information:
${context}

Remember: You're having a conversation. Keep track of what was discussed before and build on it naturally.`;

    } else {
      // No relevant policy documents found - but stay confident
      systemPrompt = `You are Sky, a helpful colleague at Rainbow Tourism Group (RTG).

Your style:
- Conversational and supportive - like talking to a friendly coworker
- Confident in what you know, helpful about what you don't
- Natural conversation flow - remember what was discussed before

SITUATION: This specific question isn't directly covered in the policy documents you have immediate access to.

How to respond:
- Acknowledge their question warmly
- Share any related information you DO have from the conversation context
- Smoothly suggest where they can get the specific details: "For the exact details on this, the HR team would have the most current information" or "Your supervisor can help with the specifics here"
- Offer to help with related questions
- Keep it natural - don't make it sound like a failure, just part of being helpful

Stay conversational and supportive. Guide them confidently to the right resource.`;
    }

    // Build conversation messages with history
    const conversationMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history for context
    if (history && history.length > 0) {
      history.forEach((msg: { role: string; content: string }) => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          conversationMessages.push({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          });
        }
      });
    }

    // Add current message
    conversationMessages.push({ role: 'user', content: message });

    // Call Groq API to generate response
    const completion = await groq.chat.completions.create({
      messages: conversationMessages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5, // Balanced for natural but accurate responses
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || 'I apologize, but I wasn\'t able to generate a response. Could you try rephrasing your question?';

    return NextResponse.json({
      response: responseText,
    });

  } catch (error: unknown) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { error: `I encountered an issue while processing your request: ${errorMessage}` },
      { status: 500 }
    );
  }
}
