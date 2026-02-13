# Sky RTGGuide - Deployment Guide

## ✅ Production Build Status
- **Build:** Successfully compiles with webpack
- **Dev Server:** Turbopack (fast development)
- **Production Build:** Webpack (stable, compatible)

## 🚨 Important: ChromaDB Limitation on Vercel

**ChromaDB requires a persistent server** and cannot run on Vercel's serverless functions.

### Solutions for Vercel Deployment:

#### Option 1: Managed ChromaDB Cloud (Recommended) ☁️
1. Sign up at [ChromaDB Cloud](https://www.trychroma.com/)
2. Create a collection and upload your documents
3. Update `.env.local`:
   ```env
   CHROMA_URL=https://your-instance.trychroma.com
   CHROMA_API_KEY=your_api_key
   ```
4. Update `src/lib/vectorStore.ts` to use ChromaDB cloud client

#### Option 2: Separate ChromaDB Server 🖥️
1. Deploy ChromaDB to a separate service:
   - Railway.app
   - Render.com
   - DigitalOcean App Platform
2. Update `.env.local` with your ChromaDB server URL
3. Ensure server is always running

#### Option 3: Alternative Vector Database 🔄
Consider switching to a serverless-friendly vector database:
- **Pinecone** (Serverless vector database)
- **Supabase pgvector** (PostgreSQL with vector support)
- **Upstash Vector** (Redis-based vector DB)

## 📋 Pre-Deployment Checklist

### Environment Variables (.env.local → Vercel)
Required for Vercel:
```env
# Required
GROQ_API_KEY=your_groq_api_key

# Optional (enables web search)
TAVILY_API_KEY=your_tavily_api_key

# ChromaDB (if using cloud/external server)
CHROMA_URL=your_chromadb_url
CHROMA_API_KEY=your_chromadb_api_key
```

### Files to Include in Git
```bash
# Commit these files:
✅ src/
✅ public/
✅ package.json
✅ next.config.ts
✅ tailwind.config.ts
✅ tsconfig.json
✅ .env.example (not .env.local!)
✅ DEPLOYMENT.md

# DO NOT commit:
❌ .env.local
❌ node_modules/
❌ .next/
❌ data/ (PDFs contain sensitive policy info)
```

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Sky RTGGuide chatbot"
git branch -M main
git remote add origin https://github.com/yourusername/sky-rtgguide.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure Project:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
4. Add Environment Variables (from checklist above)
5. Click **Deploy**

### 3. Post-Deployment
- Test all functionality on production URL
- Verify chat responses are accurate
- Check web search (if Tavily enabled)
- Monitor for any errors in Vercel logs

## 🔧 Current Build Configuration

**Development:**
```bash
npm run dev  # Uses Turbopack for fast reload
```

**Production:**
```bash
npm run build  # Uses webpack for stable builds
npm start      # Runs production server
```

## 📊 Current Status

### ✅ Working in Production
- Next.js 16 with App Router
- React Server Components
- Tailwind CSS styling
- Groq API (Llama 3.3)
- Tavily web search
- RTG corporate branding
- Professional UI/UX
- TypeScript type safety

### ⚠️ Requires Setup for Vercel
- ChromaDB vector database (needs cloud or external server)
- Document ingestion (run manually or setup CI/CD)

## 📝 Notes
- ChromaDB Docker container works perfectly for local development
- For production, ChromaDB needs to be hosted separately
- All other features are serverless-ready
- No authentication implemented yet (future enhancement)
