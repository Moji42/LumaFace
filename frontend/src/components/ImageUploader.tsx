'use client'
import { useState } from 'react'

export default function ImageUploader() {
  // State to hold the uploaded image file
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)

  // State to hold a preview URL generated from the image file
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Loading state for when the image is being submitted
  const [loading, setLoading] = useState(false)

  // Message returned after submission (success or error)
  const [response, setResponse] = useState<string | null>(null)

  // Handles file selection from the input element
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] // Grab the first file, if any
    if (file) {
      setUploadedImage(file) // Save the file
      setPreviewUrl(URL.createObjectURL(file)) // Create a local preview
      setResponse(null) // Reset any previous response
    }
  }

  // Handles submission of the selected image to the backend
  const handleSubmit = async () => {
    if (!uploadedImage) return
  
    setLoading(true)
    setResponse(null)
  
    try {
      const formData = new FormData()
      formData.append('image', uploadedImage)
  
      // Get backend URL from env file (for dev/prod flexibility)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  
      const res = await fetch(`${API_URL}/api/rate/`, {
        method: 'POST',
        body: formData,
      })
  
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`)
      }
  
      const data = await res.json()
      setResponse(`Your face score: ${data.score}`)
    } catch (err: any) {
      console.error(err)
      setResponse('Error submitting image.')
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white shadow-xl rounded-2xl max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Upload Your Photo</h2>

      {/* File input for selecting image */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                   file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100 cursor-pointer"
      />

      {/* Image preview (shown if image is selected) */}
      {previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-48 h-48 object-cover rounded-lg border"
          />
        </div>
      )}

      {/* Submit button (disabled if no image or loading) */}
      <button
        onClick={handleSubmit}
        disabled={!uploadedImage || loading}
        className="mt-4 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {/* Response message (success or error) */}
      {response && <p className="mt-2 text-sm text-gray-700">{response}</p>}
    </div>
  )
}
