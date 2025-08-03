'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { transcribeAudio } from '@/lib/api'

interface FileUploadProps {
  onProcessingStart: () => void
  onProcessingComplete: (data: any) => void
}

export function FileUpload({ onProcessingStart, onProcessingComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    
    // Validate file type
    if (!file.type.startsWith('audio/')) {
      setError('Please upload an audio file (MP3, WAV, etc.)')
      return
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB')
      return
    }

    setError(null)
    setUploading(true)
    onProcessingStart()

    try {
      const formData = new FormData()
      formData.append('audio', file)

      const result = await transcribeAudio(formData)
      onProcessingComplete(result)
    } catch (err) {
      setError('Failed to process audio file. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }, [onProcessingStart, onProcessingComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac', '.ogg']
    },
    multiple: false,
    disabled: uploading
  })

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Upload Your Podcast
        </h2>
        <p className="text-gray-600">
          Drag and drop your audio file or click to browse
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="animate-pulse">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-primary-600 mb-4" />
            <p className="text-gray-600">Processing your audio...</p>
          </div>
        ) : (
          <div>
            <DocumentIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-primary-600 font-medium">Drop your audio file here</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  MP3, WAV, M4A, AAC, OGG up to 50MB
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Secure upload</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>AI-powered</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>SEO optimized</span>
          </div>
        </div>
      </div>
    </div>
  )
} 