import os
import tempfile
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Podcast to Blog API",
    description="API for converting podcast audio to blog posts",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

class BlogRequest(BaseModel):
    transcript: str

class SEORequest(BaseModel):
    content: str

class TranscriptionResponse(BaseModel):
    transcript: str
    blog: dict

class BlogResponse(BaseModel):
    title: str
    content: str
    seoTitle: str
    metaDescription: str
    tags: list[str]

class SEOResponse(BaseModel):
    seoTitle: str
    metaDescription: str
    tags: list[str]

@app.get("/")
async def root():
    return {"message": "Podcast to Blog API"}

@app.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(audio: UploadFile = File(...)):
    """
    Transcribe audio file and generate blog post
    """
    if not audio.filename:
        raise HTTPException(status_code=400, detail="No audio file provided")
    
    # Validate file type
    allowed_types = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/aac", "audio/ogg"]
    if audio.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid audio file type")
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
            content = await audio.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Transcribe with OpenAI Whisper
        with open(temp_file_path, "rb") as audio_file:
            transcript_response = openai.Audio.transcribe(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
        
        # Clean up temp file
        os.unlink(temp_file_path)
        
        # Generate blog post
        blog_content = await generate_blog_content(transcript_response)
        
        # Generate SEO metadata
        seo_data = await generate_seo_metadata(blog_content["content"])
        
        return TranscriptionResponse(
            transcript=transcript_response,
            blog={
                "title": blog_content["title"],
                "content": blog_content["content"],
                "seoTitle": seo_data["seoTitle"],
                "metaDescription": seo_data["metaDescription"],
                "tags": seo_data["tags"]
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.post("/generate-blog", response_model=BlogResponse)
async def generate_blog(request: BlogRequest):
    """
    Generate blog post from transcript
    """
    try:
        blog_content = await generate_blog_content(request.transcript)
        seo_data = await generate_seo_metadata(blog_content["content"])
        
        return BlogResponse(
            title=blog_content["title"],
            content=blog_content["content"],
            seoTitle=seo_data["seoTitle"],
            metaDescription=seo_data["metaDescription"],
            tags=seo_data["tags"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blog generation failed: {str(e)}")

@app.post("/generate-seo", response_model=SEOResponse)
async def generate_seo(request: SEORequest):
    """
    Generate SEO metadata from blog content
    """
    try:
        seo_data = await generate_seo_metadata(request.content)
        return SEOResponse(**seo_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SEO generation failed: {str(e)}")

async def generate_blog_content(transcript: str) -> dict:
    """
    Generate blog content using OpenAI GPT
    """
    prompt = f"""
    You are an expert blog writer. Structure this podcast transcript into a professional blog article with:

    - A catchy, engaging title
    - An engaging introduction that hooks the reader
    - 2-4 key takeaways with clear headers
    - A conclusion with a call to action

    Use a friendly, informative tone. Format the content with proper HTML-like structure using <h2> for headers and <p> for paragraphs.

    Transcript:
    {transcript}
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert content writer specializing in converting podcast transcripts into engaging blog posts."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=2000,
        temperature=0.7
    )
    
    content = response.choices[0].message.content
    
    # Extract title and content
    lines = content.split('\n')
    title = ""
    blog_content = ""
    
    for line in lines:
        if line.strip() and not title:
            title = line.strip().replace('# ', '').replace('<h1>', '').replace('</h1>', '')
        else:
            blog_content += line + '\n'
    
    return {
        "title": title or "Podcast to Blog Post",
        "content": blog_content.strip()
    }

async def generate_seo_metadata(content: str) -> dict:
    """
    Generate SEO metadata using OpenAI GPT
    """
    prompt = f"""
    Based on the blog content below, generate:
    - A short SEO-friendly title (under 60 characters)
    - 5 relevant tags/keywords
    - A meta description under 160 characters

    Blog content:
    {content[:1000]}...
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an SEO expert. Generate optimized metadata for blog posts."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500,
        temperature=0.5
    )
    
    result = response.choices[0].message.content
    
    # Parse the response
    lines = result.split('\n')
    seo_title = ""
    meta_description = ""
    tags = []
    
    for line in lines:
        line = line.strip()
        if line.startswith('Title:') or line.startswith('SEO Title:'):
            seo_title = line.split(':', 1)[1].strip()
        elif line.startswith('Meta Description:') or line.startswith('Description:'):
            meta_description = line.split(':', 1)[1].strip()
        elif line.startswith('Tags:') or line.startswith('Keywords:'):
            tags_text = line.split(':', 1)[1].strip()
            tags = [tag.strip() for tag in tags_text.split(',')]
    
    return {
        "seoTitle": seo_title or "Podcast to Blog Post",
        "metaDescription": meta_description or "Convert your podcast into an engaging blog post",
        "tags": tags[:5] if tags else ["podcast", "blog", "content", "transcription", "AI"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 