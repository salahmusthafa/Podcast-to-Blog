'use client'

import { useState } from 'react'
import { ArrowLeftIcon, ClipboardDocumentIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'

interface BlogData {
  title: string
  content: string
  seoTitle: string
  metaDescription: string
  tags: string[]
  transcript: string
}

interface BlogPreviewProps {
  blogData: BlogData
  onBack: () => void
}

export function BlogPreview({ blogData, onBack }: BlogPreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'seo' | 'transcript'>('preview')
  const [copied, setCopied] = useState(false)

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([blogData.content], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = `${blogData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to upload</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleCopy(blogData.content)}
            className="btn-secondary flex items-center space-x-2"
          >
            <ClipboardDocumentIcon className="h-4 w-4" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="btn-primary flex items-center space-x-2"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'preview', label: 'Blog Preview' },
              { id: 'seo', label: 'SEO Details' },
              { id: 'transcript', label: 'Transcript' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'preview' && (
          <div className="prose max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{blogData.title}</h1>
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blogData.content.replace(/\n/g, '<br />') }}
            />
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SEO Title</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{blogData.seoTitle}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Meta Description</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{blogData.metaDescription}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blogData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transcript' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Full Transcript</h3>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap">{blogData.transcript}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 