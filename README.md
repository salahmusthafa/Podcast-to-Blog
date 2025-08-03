# Podcast to Blog

Transform your podcast episodes into SEO-optimized blog posts with AI-powered transcription and summarization.

## 🚀 Features

- **Audio Transcription**: Upload podcast audio files (MP3, WAV, M4A, AAC, OGG)
- **AI Blog Generation**: Convert transcripts into structured blog posts
- **SEO Optimization**: Auto-generate titles, meta descriptions, and tags
- **Export Options**: Download as Markdown or copy to clipboard
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Dropzone** - File upload with drag & drop
- **React Query** - Server state management

### Backend
- **FastAPI** - Modern Python web framework
- **OpenAI Whisper** - Audio transcription
- **OpenAI GPT-4** - Blog generation and SEO optimization
- **Python-multipart** - File upload handling

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- OpenAI API key

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Add your API URL:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Start development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file:
```bash
cp env.example .env
```

5. Add your OpenAI API key:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

6. Start the server:
```bash
python main.py
```

## 🎯 Usage

1. **Upload Audio**: Drag and drop your podcast audio file or click to browse
2. **Processing**: The app will transcribe your audio and generate a blog post
3. **Preview**: Review the generated blog post with SEO metadata
4. **Export**: Copy the content or download as Markdown

## 🔧 API Endpoints

### POST `/transcribe`
Transcribe audio file and generate blog post

**Request**: Multipart form data with audio file
**Response**: 
```json
{
  "transcript": "Full transcript text...",
  "blog": {
    "title": "Blog title",
    "content": "Blog content...",
    "seoTitle": "SEO optimized title",
    "metaDescription": "Meta description",
    "tags": ["tag1", "tag2", "tag3"]
  }
}
```

### POST `/generate-blog`
Generate blog post from transcript

**Request**:
```json
{
  "transcript": "Transcript text..."
}
```

### POST `/generate-seo`
Generate SEO metadata from blog content

**Request**:
```json
{
  "content": "Blog content..."
}
```

## 🚀 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Backend (Render/Railway)
1. Push to GitHub
2. Connect repository to Render/Railway
3. Add environment variables
4. Deploy

## 💰 Monetization Strategy

### Free Tier
- 10 minutes audio limit
- Watermark in exports
- 1 export per day

### Creator Plan ($10/month)
- 60 minutes audio limit
- No watermark
- HD export options

### Pro Studio ($25/month)
- Multiple languages
- Keyword assistance
- Batch uploads

## 🔮 Roadmap

- [ ] User authentication
- [ ] Payment integration (Stripe)
- [ ] Multiple language support
- [ ] Custom blog templates
- [ ] RSS feed integration
- [ ] Podcast episode embeds
- [ ] Image suggestions
- [ ] Scheduling functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Create an issue on GitHub
- Email: support@podcasttoblog.com
- Documentation: [docs.podcasttoblog.com](https://docs.podcasttoblog.com)

---

Built with ❤️ for podcast creators 