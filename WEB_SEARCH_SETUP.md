# Setting Up Web Search (Optional)

## What Changed?
Sky RTGGuide now has enhanced capabilities:

### 1. **More Human Responses** ✨
- Warm, conversational tone - like talking to a helpful colleague
- Never blunt or dismissive
- Natural language instead of robotic responses

### 2. **Intelligent Question Routing** 🧠
- **Policy questions** → Uses ChromaDB with RTG documents
- **General questions** → Falls back to web search
- Seamless switching based on question relevance

### 3. **Web Search Capability** 🌐
For questions outside the RTG knowledge base, Sky can now search the internet to provide helpful answers while staying friendly and accurate.

## Setup Web Search (Optional but Recommended)

### Get Your Tavily API Key:
1. Go to [https://tavily.com](https://tavily.com)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier includes 1,000 searches/month

### Add to .env.local:
```env
GROQ_API_KEY=your_existing_groq_key
TAVILY_API_KEY=your_tavily_key_here
```

### Without Tavily API Key:
- Sky will still work perfectly for RTG policy questions
- For general questions, Sky will acknowledge gracefully that web search isn't available
- Still maintains the warm, conversational personality

## Test It Out! 🚀

Try asking:
- **Policy question**: "What's the dress code for front desk staff?"
- **General question**: "What's the weather like in Victoria Falls today?"
- **Out of scope**: "Tell me about artificial intelligence"

Sky will handle each appropriately with a friendly, human tone!
