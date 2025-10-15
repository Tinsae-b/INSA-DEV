"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, Camera } from "lucide-react"
import Navigation from "@/components/Navigation"
import PageHeader from "@/components/PageHeader"
import { Heart } from "lucide-react"

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085/yearbook/api"

interface MemoryCategory {
  id: number
  name: string
  icon: string
  description: string
  color: string
  order: number
  is_active: boolean
  memory_count: number
}

interface Memory {
  id: number
  title: string
  photo_url: string
  caption: string
  department: number | null
  department_name: string | null
  category: number | null
  category_name: string | null
  category_icon: string | null
  category_color: string | null
  memory_type: string
  created_at: string
  author_name: string | null
  author_program: string | null
  author_year: string | null
}

export default function MemoryBoardGallery() {
  const [categories, setCategories] = useState<MemoryCategory[]>([])
  const [memories, setMemories] = useState<Memory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories and memories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch(`${API_BASE_URL}/memory-categories/`)
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories')
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.results || categoriesData)

        // Fetch memories
        const memoriesResponse = await fetch(`${API_BASE_URL}/memories/`)
        if (!memoriesResponse.ok) throw new Error('Failed to fetch memories')
        const memoriesData = await memoriesResponse.json()
        setMemories(memoriesData.results || memoriesData)

        setLoading(false)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedMemory(null)
  }

  // Group memories by category
  const memoriesByCategory = categories.map(category => ({
    ...category,
    memories: memories.filter(m => m.category === category.id)
  })).filter(cat => selectedCategory === null || cat.id === selectedCategory)

  // Helper function to get color classes based on hex color
  const getColorClasses = (hexColor: string) => {
    // Map hex colors to Tailwind classes
    const colorMap: Record<string, { bg: string, border: string, text: string }> = {
      '#8B5CF6': { bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-800' },
      '#EF4444': { bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-800' },
      '#3B82F6': { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-800' },
      '#10B981': { bg: 'bg-green-100', border: 'border-green-200', text: 'text-green-800' },
      '#F59E0B': { bg: 'bg-yellow-100', border: 'border-yellow-200', text: 'text-yellow-800' },
      '#EC4899': { bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-pink-800' },
      '#6366F1': { bg: 'bg-indigo-100', border: 'border-indigo-200', text: 'text-indigo-800' },
      '#14B8A6': { bg: 'bg-teal-100', border: 'border-teal-200', text: 'text-teal-800' },
    }
    return colorMap[hexColor] || { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-800' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation currentPage="memory-board-gallery" />
        <PageHeader
          title="Memory Board Gallery"
          subtitle="Loading memories..."
          icon={<Camera className="h-8 w-8 text-blue-500" />}
        />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-lg text-gray-600">Loading memories...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation currentPage="memory-board-gallery" />
        <PageHeader
          title="Memory Board Gallery"
          subtitle="Error loading memories"
          icon={<Camera className="h-8 w-8 text-blue-500" />}
        />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-800 font-semibold mb-2">Error Loading Memories</div>
            <div className="text-red-600">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation currentPage="memory-board-gallery" />
      
      <PageHeader
        title="Memory Board Gallery"
        subtitle="Relive the amazing moments, challenges, and achievements of our INSA Cyber Talent community"
        icon={<Camera className="h-8 w-8 text-blue-500" />}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{memories.length}</div>
              <div className="text-gray-600">Total Memories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">{categories.length}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {new Set(memories.map(m => m.author_name).filter(Boolean)).size}
              </div>
              <div className="text-gray-600">Contributors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {new Set(memories.map(m => new Date(m.created_at).getFullYear())).size}
              </div>
              <div className="text-gray-600">Years</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="mb-2"
            >
              All Memories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="mb-2"
              >
                {category.icon} {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Memory Categories */}
        {memoriesByCategory.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Memories Yet</h3>
            <p className="text-gray-600">Memories will appear here once they are added by the admin.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {memoriesByCategory.map((category) => {
              const colors = getColorClasses(category.color)
              
              return (
                <div key={category.id} className={`${colors.bg} rounded-2xl p-8 border-2 ${colors.border}`}>
                  <div className="mb-6">
                    <h2 className={`text-2xl font-bold ${colors.text} mb-2`}>
                      {category.icon} {category.name}
                    </h2>
                    <p className={`${colors.text} opacity-80`}>
                      {category.description}
                    </p>
                    <div className="mt-2">
                      <Badge className={colors.bg}>
                        {category.memories.length} {category.memories.length === 1 ? 'memory' : 'memories'}
                      </Badge>
                    </div>
                  </div>

                  {category.memories.length === 0 ? (
                    <div className="text-center py-8 bg-white/50 rounded-lg">
                      <p className={`${colors.text} opacity-70`}>No memories in this category yet</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.memories.map((memory) => (
                        <Card 
                          key={memory.id} 
                          className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
                          onClick={() => handleMemoryClick(memory)}
                        >
                          <CardHeader className="pb-4">
                            <div className="relative h-48 w-full">
                              <Image
                                src={memory.photo_url}
                                alt={memory.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                unoptimized={true}
                              />
                              {memory.author_name && (
                                <div className="absolute top-3 right-3">
                                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                                    <Heart className="w-3 h-3 mr-1" />
                                    {memory.author_name}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {memory.title}
                            </CardTitle>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(memory.created_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}</span>
                              </div>
                              {memory.author_program && (
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  <span>{memory.author_program}</span>
                                </div>
                              )}
                              {memory.department_name && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{memory.department_name}</span>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                              {memory.caption}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Memory Detail Modal */}
      {showModal && selectedMemory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedMemory.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedMemory.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    {selectedMemory.author_name && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedMemory.author_name}</span>
                      </div>
                    )}
                    {selectedMemory.department_name && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedMemory.department_name}</span>
                      </div>
                    )}
                  </div>
                  {selectedMemory.category_name && (
                    <Badge className="mt-2">
                      {selectedMemory.category_icon} {selectedMemory.category_name}
                    </Badge>
                  )}
                </div>
                <Button variant="outline" onClick={closeModal}>
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="text-center mb-6">
                <Image
                  src={selectedMemory.photo_url}
                  alt={selectedMemory.title}
                  width={800}
                  height={600}
                  className="max-w-full h-auto object-contain mx-auto rounded-lg shadow-lg"
                  unoptimized={true}
                />
              </div>
              <div className="text-gray-700">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedMemory.caption}
                </p>
                {selectedMemory.author_year && (
                  <p className="mt-4 text-sm text-gray-600">
                    Year: {selectedMemory.author_year}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
