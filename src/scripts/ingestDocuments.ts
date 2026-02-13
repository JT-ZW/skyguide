import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { addDocuments } from '../lib/vectorStore';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function extractTextFromPDF(filePath: string): Promise<string> {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();
  return docs.map(doc => doc.pageContent).join('\n');
}

async function ingestAllDocuments() {
  const dataDir = path.join(process.cwd(), 'data');
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.pdf'));

  console.log(`Found ${files.length} PDF files to process...`);

  const documents = [];

  for (const file of files) {
    console.log(`Processing: ${file}`);
    const filePath = path.join(dataDir, file);
    
    try {
      const text = await extractTextFromPDF(filePath);
      documents.push({
        text,
        metadata: {
          source: file,
          type: 'policy',
          timestamp: new Date().toISOString(),
        },
      });
      console.log(`✓ Extracted ${text.length} characters from ${file}`);
    } catch (error) {
      console.error(`✗ Error processing ${file}:`, error);
    }
  }

  console.log(`\nIngesting ${documents.length} documents into ChromaDB...`);
  
  try {
    const chunksAdded = await addDocuments(documents);
    console.log(`✓ Successfully added ${chunksAdded} chunks to the vector store`);
  } catch (error) {
    console.error('✗ Error ingesting documents:', error);
    throw error;
  }
}

// Run the ingestion
ingestAllDocuments()
  .then(() => {
    console.log('\n✓ Document ingestion complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Ingestion failed:', error);
    process.exit(1);
  });
