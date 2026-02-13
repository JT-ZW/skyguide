# Quick Start Guide for Sky RTGGuide

This guide will get you up and running in under 5 minutes.

## ⚡ Quick Setup

### Step 1: Start ChromaDB (Terminal 1)
```powershell
# Install ChromaDB (one time only)
pip install chromadb

# Start the server
chroma run --path ./chroma_data --port 8000
```
**Keep this terminal open!**

### Step 2: Add Your Groq API Key (Terminal 2)
```powershell
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add your API key
# Get one free at: https://console.groq.com
```

### Step 3: Ingest Documents
```powershell
npm run ingest
```
Wait for: ✓ Document ingestion complete!

### Step 4: Start the Chatbot
```powershell
npm run dev
```
Open: http://localhost:3000

## 🎯 Testing

Try these questions:
- "What is the RTG dress code?"
- "Tell me about the code of conduct"
- "What are the ISO standards?"

## ❓ Troubleshooting

**"Cannot connect to ChromaDB"**
→ Make sure ChromaDB server is running in Terminal 1

**"Groq API key is not configured"**
→ Check that .env.local exists with `GROQ_API_KEY=your_key`

**"No relevant documents found"**
→ Run `npm run ingest` to process the PDFs

## 🔄 Re-ingesting Documents

If you add new PDFs:
```powershell
# Delete old data
Remove-Item -Recurse -Force chroma_data

# Restart ChromaDB server (Terminal 1)
chroma run --path ./chroma_data --port 8000

# Re-ingest (Terminal 2)
npm run ingest
```

## 📚 Documents Location

All policy PDFs are in the `data/` folder:
- Code of Conduct
- Dress Codes and Greetings
- ISO Standards (BSMS & ISMS)
- Quality Policy
- RTG Way
- Internet Usage Policy
- BIS Policies

That's it! You're ready to use Sky RTGGuide! 🚀
