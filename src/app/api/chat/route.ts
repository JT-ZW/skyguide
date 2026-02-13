import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { queryDocuments } from '@/lib/vectorStore';
import { tavily } from '@tavily/core';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// Initialize Tavily client for web search
const tavilyClient = tavily({ 
  apiKey: process.env.TAVILY_API_KEY || '' 
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

    // First, classify the question type using AI
    const classificationPrompt = `Classify this question as either "POLICY" or "GENERAL":

Question: "${message}"

Rules:
- POLICY: Questions about RTG policies, procedures, dress codes, employee conduct, ISO standards, company rules, guidelines, work protocols
- GENERAL: Questions about company history, general knowledge, current events, weather, locations, general Zimbabwe/tourism info, or anything not specifically about internal policies

Respond with only one word: POLICY or GENERAL`;

    const classification = await groq.chat.completions.create({
      messages: [{ role: 'user', content: classificationPrompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 10,
    });

    const questionType = classification.choices[0]?.message?.content?.trim().toUpperCase() || 'POLICY';

    // Query relevant documents from ChromaDB
    const results = await queryDocuments(message, 5);
    
    // Extract the relevant context and check distances (similarity scores)
    const context = results.documents[0]?.join('\n\n') || '';
    const distances = results.distances?.[0] || [];
    
    // Check if we have relevant policy documents
    const hasRelevantContext = context && distances && distances.length > 0 && distances[0] !== null && distances[0] < 0.8;

    let systemPrompt = '';
    let webContext = '';

    // Route based on question type and available context
    if (questionType === 'POLICY' && hasRelevantContext) {
      // Use policy documents for RTG policy questions
      systemPrompt = `You are Sky, a friendly and helpful AI assistant for Rainbow Tourism Group (RTG) employees. 

Your personality:
- Conversational and warm - like chatting with a knowledgeable coworker
- Use natural, human language - avoid being robotic or overly formal
- Be direct and helpful - no need for excessive apologies
- Enthusiastic about helping with RTG policies and procedures
- Never mention sources, documents, or references in your responses - just provide the information naturally

Use the context below from RTG's official documents to answer the question. Be clear and accurate while keeping a friendly tone. Answer as if you simply know the information.

Context from RTG Documents:
${context}`;

    } else {
      // Use web search for general questions or when policy docs aren't helpful
      try {
        if (process.env.TAVILY_API_KEY) {
          const searchResponse = await tavilyClient.search(message, {
            maxResults: 3,
            searchDepth: 'basic',
          });

          webContext = searchResponse.results
            .map((result: { title: string; content: string }) => 
              `${result.title}\n${result.content}`
            )
            .join('\n\n');
        }
      } catch (webError) {
        console.error('Web search error:', webError);
        // Continue without web results
      }

      if (webContext) {
        systemPrompt = `You are Sky, a friendly AI assistant for Rainbow Tourism Group (RTG) employees.

Your personality:
- Conversational and natural - like a helpful friend
- Direct and clear - no need for excessive formality
- Never mention sources, websites, or where the information came from
- Keep it brief and useful

This question is about general knowledge rather than RTG policies. Here's current information:

${webContext}

Use this info to give a helpful, friendly answer. Keep it natural and conversational - answer as if you simply know the information.`;
      } else {
        // No web search available - be friendly about it
        systemPrompt = `You are Sky, a friendly AI assistant for Rainbow Tourism Group (RTG) employees.

Your personality:
- Conversational and understanding - like a helpful coworker
- Honest about limitations without being apologetic
- Suggest practical alternatives
- Keep it natural and brief

This question is outside the RTG policy documents I have access to, and web search isn't currently available. Respond naturally - acknowledge you can't help with this specific question, but stay friendly and suggest alternatives like checking the company website, asking HR, or using a search engine.`;
      }
    }

    // Call Groq API with the appropriate context
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7, // Increased for more natural, conversational responses
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
