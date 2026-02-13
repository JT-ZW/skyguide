# ChromaDB Cloud Setup Guide

## ✅ Code Updated
Your project is now configured to work with ChromaDB Cloud!

## 📝 Next Steps

### 1. Add Your ChromaDB Cloud Credentials

Open your `.env.local` file and replace the placeholder values with your actual credentials from ChromaDB Cloud:

```env
CHROMA_URL=https://your-actual-tenant.api.trychroma.com
CHROMA_API_KEY=your_actual_api_key_from_chromadb
```

**Where to find these:**
- Log into [ChromaDB Cloud Dashboard](https://www.trychroma.com)
- Go to Settings or API section
- Copy your Tenant URL and API Key

### 2. Upload Your Documents to ChromaDB Cloud

You have **11 PDF documents** (257 chunks) that need to be uploaded. Run the ingestion script:

```bash
npm run ingest
```

This will:
- ✅ Connect to ChromaDB Cloud (using your credentials)
- ✅ Create the `rtg_policies` collection
- ✅ Process all 11 PDFs in the `/data` folder
- ✅ Upload 257 chunks with embeddings

**Documents that will be uploaded:**
1. BIS Policies edited.pdf
2. COD-Code of Conduct edited.pdf
3. Dress Codes and Greetings.pdf
4. Internet Usage Policy (1).pdf
5. ISO Standards (1) (1).pdf
6. ISO-BSMS & ISMS.pdf
7. Quality Policy.pdf
8. RTG Way.pdf
9. Values (Part of RTG Way) (1).pdf
10. BIS Policies (1).pdf (0 chars - may skip)
11. COD-Code of Conduct.pdf (0 chars - may skip)

### 3. Test Locally with ChromaDB Cloud

Start your development server:

```bash
npm run dev
```

Then test by asking a question in the chatbot. It should now connect to ChromaDB Cloud instead of localhost!

### 4. Verify Everything Works

Test these questions:
- "What's the dress code for employees?"
- "Tell me about ISO standards"
- "What are RTG's core values?"

If you get accurate responses, your ChromaDB Cloud setup is working! ✅

### 5. Deploy to Vercel

Once everything works locally:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Configure ChromaDB Cloud for production"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add Environment Variables:
     - `GROQ_API_KEY`
     - `TAVILY_API_KEY`
     - `CHROMA_URL`
     - `CHROMA_API_KEY`
   - Click Deploy

3. **Done!** Your chatbot will work on Vercel with ChromaDB Cloud! 🎉

---

## 🔄 Switching Between Local and Cloud

The code now supports **both** setups:

### Use Local Docker ChromaDB:
```env
# Comment out or remove these lines in .env.local
# CHROMA_URL=...
# CHROMA_API_KEY=...
```
Make sure your Docker ChromaDB is running on port 8000.

### Use ChromaDB Cloud:
```env
# Add these lines in .env.local
CHROMA_URL=https://your-tenant.api.trychroma.com
CHROMA_API_KEY=your_api_key
```

---

## 🚨 Troubleshooting

### Error: "Failed to connect to ChromaDB"
- ✓ Check your CHROMA_URL is correct
- ✓ Verify your CHROMA_API_KEY is valid
- ✓ Ensure you're connected to the internet

### Error: "Collection not found"
- Run `npm run ingest` to create the collection and upload documents

### Slow responses after switching to cloud
- ChromaDB Cloud may have slightly higher latency than localhost
- This is normal and won't be noticeable to users

---

## 📊 What Changed in Your Code

### `src/lib/vectorStore.ts`
- Now checks for `CHROMA_URL` and `CHROMA_API_KEY` environment variables
- Uses ChromaDB Cloud if credentials are present
- Falls back to localhost:8000 if credentials are missing
- Added authentication support for cloud

### Benefits:
- ✅ Works on Vercel (serverless)
- ✅ No Docker required in production
- ✅ Managed service (automatic scaling, backups)
- ✅ Same code works locally and in production

---

**Ready to continue?** Add your ChromaDB Cloud credentials to `.env.local` and run `npm run ingest`!
