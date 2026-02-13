# Sky RTGGuide - Rainbow Tourism Group AI Assistant

AI-powered chatbot for Rainbow Tourism Group (RTG) employees to access company policies, dress codes, ISO standards, and internal documentation instantly.

## 🎯 Features

- **RAG (Retrieval-Augmented Generation)** - Uses ChromaDB vector database to retrieve relevant document sections
- **Groq-Powered AI** - Fast inference with Llama 3.1 or Mixtral models
- **Document Processing** - Automatically chunks and indexes PDF documents
- **Source Citations** - Shows which policy documents were used to generate answers
- **Modern UI** - Clean, responsive chat interface built with Next.js and Tailwind CSS

## 📁 Project Structure

```
chatbot/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts    # Chat API endpoint
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main chat page
│   ├── components/
│   │   └── ChatInterface.tsx     # Chat UI component
│   ├── lib/
│   │   └── vectorStore.ts        # ChromaDB integration
│   └── scripts/
│       └── ingestDocuments.ts    # PDF ingestion script
├── data/                          # PDF policy documents
└── chroma_data/                   # Vector database storage (auto-generated)
```

## 🚀 Setup Instructions

### 1. Prerequisites

- **Node.js** 18+ installed
- **Python** 3.8+ installed (required for ChromaDB)
- **Groq API Key** (free at [console.groq.com](https://console.groq.com))

### 2. Install Dependencies

```bash
npm install
```

### 3. Start ChromaDB Server

ChromaDB needs to run as a local server. Open a **new terminal** and run:

```bash
# Install ChromaDB
pip install chromadb

# Start the server
chroma run --path ./chroma_data --port 8000
```

Keep this terminal running. ChromaDB will be available at `http://localhost:8000`.

### 4. Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

**Get your Groq API key:**
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up/login (free account available)
3. Navigate to API Keys section
4. Create a new API key

### 5. Ingest Policy Documents

Process the PDFs in the `data/` folder and add them to ChromaDB:

```bash
npm run ingest
```

You should see output like:
```
Found 7 PDF files to process...
Processing: COD-Code of Conduct.pdf
✓ Extracted 15234 characters from COD-Code of Conduct.pdf
...
✓ Successfully added 142 chunks to the vector store
✓ Document ingestion complete!
```

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the chatbot! 🎉

## 📝 Usage

### Sample Questions

- "What is the dress code for front desk staff?"
- "Tell me about RTG's code of conduct"
- "What are the ISO ISMS standards we follow?"
- "Can you explain the internet usage policy?"
- "What does the Quality Policy say about customer service?"

### Re-ingesting Documents

If you add new PDFs to the `data/` folder or update existing ones:

1. **Delete the old data:**
   ```bash
   Remove-Item -Recurse -Force chroma_data
   ```

2. **Restart ChromaDB server** (see step 3 above)

3. **Re-run ingestion:**
   ```bash
   npm run ingest
   ```

## 🔧 Configuration

### Changing the AI Model

Edit [src/app/api/chat/route.ts](src/app/api/chat/route.ts) and change the `model` parameter:

```typescript
model: 'llama-3.1-70b-versatile',  // Default (best quality)
// or
model: 'mixtral-8x7b-32768',       // Faster, good quality
// or  
model: 'llama-3.1-8b-instant',     // Fastest
```

### Adjusting Chunk Size

Edit [src/lib/vectorStore.ts](src/lib/vectorStore.ts):

```typescript
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,    // Increase for more context per chunk
  chunkOverlap: 200,  // Overlap between chunks
});
```

## 🔐 Future Enhancements

- [ ] Microsoft Entra ID (Azure AD) authentication
- [ ] Admin dashboard for document management
- [ ] Conversation history persistence
- [ ] Analytics and usage tracking
- [ ] Multi-language support

## 🛠 Technology Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **AI/ML:** Groq SDK, LangChain, ChromaDB
- **Document Processing:** pdf-parse
- **Language:** TypeScript

## 📄 License

Internal use only - Rainbow Tourism Group

## 👥 Support

For technical assistance, contact the RTG IT Department.
