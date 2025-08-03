const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface TranscriptionResponse {
  transcript: string
  blog: {
    title: string
    content: string
    seoTitle: string
    metaDescription: string
    tags: string[]
  }
}

export async function transcribeAudio(formData: FormData): Promise<TranscriptionResponse> {
  const response = await fetch(`${API_BASE_URL}/transcribe`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.statusText}`)
  }

  return response.json()
}

export async function generateBlog(transcript: string): Promise<TranscriptionResponse['blog']> {
  const response = await fetch(`${API_BASE_URL}/generate-blog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transcript }),
  })

  if (!response.ok) {
    throw new Error(`Blog generation failed: ${response.statusText}`)
  }

  return response.json()
}

export async function generateSEO(blogContent: string): Promise<{
  seoTitle: string
  metaDescription: string
  tags: string[]
}> {
  const response = await fetch(`${API_BASE_URL}/generate-seo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: blogContent }),
  })

  if (!response.ok) {
    throw new Error(`SEO generation failed: ${response.statusText}`)
  }

  return response.json()
} 