# 🚀 Quick Setup with Docker (Recommended)

ChromaDB has compatibility issues with Python 3.14. The easiest solution is to use Docker.

## Option 1: Docker (Easiest - 2 minutes)

### Step 1: Install Docker Desktop
Download from: https://www.docker.com/products/docker-desktop/

### Step 2: Start ChromaDB Server
```powershell
docker run -p 8000:8000 -v ${PWD}/chroma_data:/chroma/chroma chromadb/chroma:latest
```

**Keep this terminal running!**

That's it! ChromaDB is now running on http://localhost:8000

---

## Option 2: Use Python 3.11 or 3.12 (Alternative)

If you don't want to use Docker, install Python 3.11 or 3.12 (ChromaDB doesn't support 3.14 yet):

1. Download Python 3.12 from: https://www.python.org/downloads/
2. Install it
3. Create a new virtual environment:
   ```powershell
   py -3.12 -m venv .venv-chroma
   .\.venv-chroma\Scripts\Activate.ps1
   python -m pip install chromadb
   chroma run --path .\chroma_data --port 8000
   ```

---

## Next Steps (After ChromaDB is Running)

### 1. Add Groq API Key
```powershell
# Create .env.local file
Copy-Item .env.local.example .env.local

# Edit .env.local and add your key:
# GROQ_API_KEY=your_actual_key_here
```

Get your free key at: https://console.groq.com

### 2. Ingest Documents
```powershell
npm run ingest
```

### 3. Start the Chatbot
```powershell
npm run dev
```

Visit: http://localhost:3000

---

## Troubleshooting

**"Cannot connect to ChromaDB"**
- Make sure Docker container is running OR
- Python ChromaDB server is running on port 8000

**Check if ChromaDB is running:**
```powershell
curl http://localhost:8000/api/v1/heartbeat
```

You should see: `{"nanosecond heartbeat":...}`

---

## Why Docker?

✅ No Python version conflicts  
✅ Works on any system  
✅ One simple command  
✅ Isolated and clean  
✅ Easy to stop/start  

**Stop Docker ChromaDB:**
```powershell
# Press Ctrl+C in the Docker terminal
```

**Restart it anytime:**
```powershell
docker run -p 8000:8000 -v ${PWD}/chroma_data:/chroma/chroma chromadb/chroma:latest
```
