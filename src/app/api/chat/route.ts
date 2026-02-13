import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { queryDocuments } from '@/lib/vectorStore';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

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
      systemPrompt = `You are Sky RTGGuide, the official AI assistant for Rainbow Tourism Group (RTG) employees. Your role is to help employees understand and navigate RTG's policies, procedures, and guidelines.

Your personality:
- Professional yet friendly - like talking to a knowledgeable HR representative
- Clear and accurate - RTG policies must be communicated correctly
- Helpful and patient - employees rely on you for important information
- Use "we" when referring to RTG (e.g., "Our dress code policy states...")
- Always start conversations with "Refreshing Day!" as per RTG greeting standards

IMPORTANT RULES:
- ONLY answer questions using the RTG policy documents provided below
- Be accurate and specific - this is official company policy information
- If the context contains the answer, provide it clearly
- Never make up or assume information not in the documents
- Keep answers focused on what's in the RTG documents

Context from RTG Policy Documents:
${context}

Answer the employee's question based on the information above. Be clear, accurate, and helpful.`;

    } else {
      // No relevant policy documents found
      systemPrompt = `You are Sky RTGGuide, the official AI assistant for Rainbow Tourism Group (RTG) employees.

Your personality:
- Professional yet friendly
- Honest about limitations
- Always start with "Refreshing Day!" as per RTG standards

IMPORTANT: The question asked is not covered in the RTG policy documents you have access to.

Politely let the employee know that:
1. This specific information isn't in your current knowledge base
2. Suggest they contact HR or their supervisor for this information
3. Mention they can also check the company intranet or official RTG communications

Keep it brief, friendly, and professional.`;
    }

    // Call Groq API to generate response
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3, // Lower temperature for more focused, accurate responses
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
