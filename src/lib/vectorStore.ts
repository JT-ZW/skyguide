import { CloudClient } from 'chromadb';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

// Load environment variables (for npm run ingest script)
if (typeof window === 'undefined') {
  // Only load dotenv in Node.js environment (not in browser/edge runtime)
  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (e) {
    // dotenv might not be available in all environments
  }
}

// ChromaDB Cloud client (production-ready)
if (!process.env.CHROMA_API_KEY || !process.env.CHROMA_TENANT) {
  throw new Error('ChromaDB Cloud credentials are required. Please set CHROMA_API_KEY and CHROMA_TENANT environment variables.');
}

const client = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE || 'RTG-Policy-database1',
});

export const COLLECTION_NAME = 'rtg_policies';

// Simple embedding function using Cohere API directly
async function generateEmbedding(text: string): Promise<number[]> {
  const cohereKey = process.env.COHERE_API_KEY;
  
  if (!cohereKey) {
    throw new Error('COHERE_API_KEY environment variable is not set');
  }
  
  const response = await fetch('https://api.cohere.ai/v1/embed', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cohereKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      texts: [text],
      model: 'embed-english-light-v3.0',
      input_type: 'search_query',
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Cohere API error: ${response.status} ${response.statusText} - ${errorData}`);
  }

  const data = await response.json();
  return data.embeddings[0];
}

export async function getOrCreateCollection() {
  try {
    // Get existing collection (already has embeddings from ingestion)
    const collection = await client.getCollection({
      name: COLLECTION_NAME,
    });
    return collection;
  } catch (error) {
    console.error('Error getting collection:', error);
    throw error;
  }
}

export async function addDocuments(documents: { text: string; metadata: Record<string, string | number> }[]) {
  const collection = await getOrCreateCollection();
  
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const allChunks: string[] = [];
  const allMetadata: Record<string, string | number>[] = [];
  const allIds: string[] = [];

  for (const doc of documents) {
    const chunks = await textSplitter.splitText(doc.text);
    
    chunks.forEach((chunk, i) => {
      allChunks.push(chunk);
      allMetadata.push({
        ...doc.metadata,
        chunkIndex: i,
      });
      allIds.push(`${doc.metadata.source}_chunk_${i}`);
    });
  }

  if (allChunks.length > 0) {
    await collection.add({
      ids: allIds,
      documents: allChunks,
      metadatas: allMetadata,
    });
  }

  return allChunks.length;
}

export async function queryDocuments(queryText: string, nResults: number = 5) {
  try {
    const collection = await getOrCreateCollection();
    
    // Generate embedding for the query using Cohere
    const queryEmbedding = await generateEmbedding(queryText);
    
    // Query using the embedding vector
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults,
    });

    return results;
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
}
