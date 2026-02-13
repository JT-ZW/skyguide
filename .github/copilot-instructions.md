# Sky RTGGuide - Copilot Instructions

## Project Overview
Sky RTGGuide is an AI-powered RAG (Retrieval-Augmented Generation) chatbot for Rainbow Tourism Group employees. It provides instant access to company policies, dress codes, ISO standards, and internal documentation.

## Technology Stack
- **Framework:** Next.js 16 with TypeScript and App Router
- **Styling:** Tailwind CSS
- **AI/ML:** Groq API (Llama 3.1), LangChain, ChromaDB vector database
- **Document Processing:** pdf-parse for PDF extraction

## Key Components
- `src/components/ChatInterface.tsx` - Main chat UI with message history
- `src/app/api/chat/route.ts` - API endpoint handling RAG queries
- `src/lib/vectorStore.ts` - ChromaDB integration for vector search
- `src/scripts/ingestDocuments.ts` - PDF ingestion and chunking
- `data/` - Contains 7 policy PDF documents

## Development Guidelines
- ChromaDB server must be running on port 8000 before testing
- GROQ_API_KEY environment variable is required
- Use `npm run ingest` to process documents before first use
- Follow Next.js App Router conventions
- Use TypeScript for type safety

## Future Features
- Microsoft Entra ID (Azure AD) authentication
- Admin dashboard for document management
- Conversation history persistence
