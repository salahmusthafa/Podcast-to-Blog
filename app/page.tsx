'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { BlogPreview } from '@/components/BlogPreview'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'preview'>('upload')
  const [blogData, setBlogData] = useState<any>(null)

  const handleProcessingComplete = (data: any) => {
    setBlogData(data)
    setCurrentStep('preview')
  }

  const handleProcessingStart = () => {
    setCurrentStep('processing')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {currentStep === 'upload' && (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Transform Your Podcast into a Blog Post
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Upload your podcast audio and get an AI-generated blog post with SEO optimization
              </p>
            </div>
          )}

          {currentStep === 'upload' && (
            <FileUpload 
              onProcessingStart={handleProcessingStart}
              onProcessingComplete={handleProcessingComplete}
            />
          )}

          {currentStep === 'processing' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Processing Your Podcast
              </h2>
              <p className="text-gray-600">
                Transcribing audio and generating your blog post...
              </p>
            </div>
          )}

          {currentStep === 'preview' && blogData && (
            <BlogPreview 
              blogData={blogData}
              onBack={() => setCurrentStep('upload')}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
} 