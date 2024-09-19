'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

// Update the image sources to use the new attached images
const images = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2_prompt_6_915-0JY0VOeqLQWX2RP1lwzLg1FJsTB9Sn.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1_prompt_8_620808-Kbf5YUQRGfsBowSG5jt1J7tgmghnnA.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2_prompt_2_915-QAZekhyvk1jkSoRIr5Ey1ZLhrobrr5.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1_prompt_5_915-ciCaNihiLE2DidiMPfNVUPOJqCd9NX.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0_prompt_9_915-4NUDPtn6abIudhGaqqovhKwEwH3RD0.jpg"
];


function ImageCarousel({ currentImage }: { currentImage: number }) {
  return (
    <div className="fixed inset-0 z-[-1]">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Background ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [showSearch, setShowSearch] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchQuery }),
      })

      if (res.ok) {
        const data = await res.json()
        setResponse(data.answer)
        setShowSearch(false)
        setCurrentImage((prevImage) => (prevImage + 1) % images.length)
      } else {
        console.error('Error calling API:', res.status, res.statusText)
        setResponse('Error processing your request')
      }
    } catch (error) {
      console.error('Error calling API:', error)
      setResponse('Error processing your request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    setResponse(null)
    setShowSearch(true)
    setCurrentImage((prevImage) => (prevImage + 1) % images.length)
  }

  return (
    <>
      <ImageCarousel currentImage={currentImage} />
      <div className="min-h-screen flex flex-col justify-between p-4 bg-black bg-opacity-50">
        <main className="flex-grow flex flex-col justify-center items-center">
          {showSearch ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">
                  <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Wes Brown the Legend
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-gray-300">
                  A cyberpunk journey of legendary proportions...
                </p>
              </div>
              <form onSubmit={handleSearch} className="w-full max-w-sm">
                <div className="flex flex-col space-y-2">
                  <Input
                    type="text"
                    placeholder="Remember me..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-white bg-opacity-20 text-white placeholder-gray-300"
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Search'}
                  </Button>
                </div>
              </form>
            </>
          ) : response ? (
            <div className="w-full max-w-sm bg-white bg-opacity-20 p-4 rounded-lg">
              <p className="mb-4 text-sm sm:text-base text-white">{response}</p>
              <Button onClick={handleClear} className="w-full">Clear</Button>
            </div>
          ) : null}
        </main>
        <footer className="text-center text-xs sm:text-sm text-gray-300 mt-6">
          <p>
            © {new Date().getFullYear()}. <span className="text-white">RMBR.ME</span> Made with{' '}
            <span className="text-white">passion</span> by{' '}
            <a
              href="http://aicontinuum.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline text-white"
            >
              AI Continuum
            </a>
            .
          </p>
        </footer>
      </div>
    </>
  )
}