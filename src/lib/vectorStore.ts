import { ChromaClient, CloudClient } from 'chromadb';
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

// Support both local Docker and ChromaDB Cloud
const client = process.env.CHROMA_API_KEY && process.env.CHROMA_TENANT
  ? new CloudClient({
      apiKey: process.env.CHROMA_API_KEY,
      tenant: process.env.CHROMA_TENANT,
      database: process.env.CHROMA_DATABASE || 'RTG-Policy-database1',
    })
  : new ChromaClient({
      path: 'http://localhost:8000',
    });

export const COLLECTION_NAME = 'rtg_policies';

export async function getOrCreateCollection() {
  try {
    const collection = await client.getOrCreateCollection({
      name: COLLECTION_NAME,
      metadata: { 'hnsw:space': 'cosine' },
    });
    return collection;
  } catch (error) {
    console.error('Error creating collection:', error);
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
    
    const results = await collection.query({
      queryTexts: [queryText],
      nResults,
    });

    return results;
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
}
