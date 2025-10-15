"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/Navigation"
import PageHeader from "@/components/PageHeader"
import { Download, Eye, GraduationCap, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"

// API base URL for certificate endpoints - using port 8085
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.27.12.216:8000/yearbook/api"

interface CertificateData {
  id: number
  student_id: string
  name: string
  department_name: string
  certificate_url: string
  verification_url: string
}

export default function CertificatesPage() {
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [certificatesData, setCertificatesData] = useState<CertificateData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch students data from API
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/students/`)
        if (!response.ok) {
          throw new Error(`Failed to fetch students: ${response.statusText}`)
        }
        const data = await response.json()
        
        // Transform students data to certificate format
        const certificates = data.results.map((student: any) => {
          const studentId = student.student_id || `STU${String(student.id).padStart(3, '0')}`
          return {
            id: student.id,
            student_id: studentId,
            name: student.name,
            department_name: student.department_name,
            certificate_url: student.certificate_url,
            verification_url: `http://172.27.12.216:8000/yearbook/verify/${studentId}/`
          }
        })
        
        setCertificatesData(certificates)
      } catch (err) {
        console.error('Error fetching certificates:', err)
        setError(err instanceof Error ? err.message : 'Failed to load certificates')
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
  }, [])

  const handleShowCertificate = (certificate: CertificateData) => {
    setSelectedCertificate(certificate)
    setShowModal(true)
  }

  const handleDownloadCertificate = async (certificate: CertificateData) => {
    try {
      // Use the correct API endpoint for downloading
      const response = await fetch(`${API_BASE_URL}/students/${certificate.id}/certificate/`)
      if (!response.ok) {
        throw new Error(`Failed to download certificate: ${response.statusText}`)
      }
      
      // Check if response is actually an image
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('image')) {
        throw new Error('Response is not an image')
      }
      
      const blob = await response.blob()
      
      // Create a download link with the blob
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${certificate.student_id}_Certificate.png`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading certificate:', error)
      alert('Failed to download certificate. Please try again.')
      // Fallback to opening in new tab if download fails
      window.open(`${API_BASE_URL}/students/${certificate.id}/certificate/`, '_blank')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedCertificate(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <Navigation currentPage="certificates" />
      
      {/* Header */}
      <PageHeader
        title="INSA Cyber Talent Certificates"
        subtitle="Official certificates for our cybersecurity graduates"
        icon={<GraduationCap className="h-8 w-8 text-blue-500" />}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading certificates...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="text-red-800 font-semibold mb-2">Error Loading Certificates</div>
            <div className="text-red-600">{error}</div>
          </div>
        )}

        {/* Stats */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{certificatesData.length}</div>
                <div className="text-gray-600">Certificates Generated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-gray-600">Verification Ready</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">2025</div>
                <div className="text-gray-600">Graduation Year</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
                <div className="text-gray-600">Specializations</div>
              </div>
            </div>
          </div>
        )}

        {/* Certificates Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {certificatesData.map((certificate) => (
              <Card key={certificate.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">{certificate.name}</CardTitle>
                    <p className="text-sm text-gray-600">ID: {certificate.student_id}</p>
                    <p className="text-sm text-blue-600 font-medium">{certificate.department_name}</p>
                  </div>
                </CardHeader>
              
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Official INSA Cyber Talent Certificate
                    </p>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleShowCertificate(certificate)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadCertificate(certificate)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Verification Link */}
                    <a 
                      href={certificate.verification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600 hover:text-green-700 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Verify Certificate
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Certificate Modal */}
        {showModal && selectedCertificate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCertificate.name}'s Certificate
                    </h2>
                    <p className="text-sm text-gray-600">Student ID: {selectedCertificate.student_id}</p>
                    <p className="text-sm text-blue-600">Department: {selectedCertificate.department_name}</p>
                  </div>
                  <Button variant="outline" onClick={closeModal}>
                    ✕
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <Image
                    src={`${API_BASE_URL}/students/${selectedCertificate.id}/certificate/`}
                    alt={`${selectedCertificate.name}'s Certificate`}
                    width={800}
                    height={600}
                    className="mx-auto rounded-lg shadow-lg"
                    unoptimized={true}
                  />
                </div>
                
                <div className="text-center mb-6 bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2 font-semibold">
                    🔗 Verification URL
                  </p>
                  <a 
                    href={selectedCertificate.verification_url} 
                    className="text-blue-600 hover:underline break-all" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {selectedCertificate.verification_url}
                  </a>
                  <p className="text-xs text-gray-600 mt-2">
                    Anyone can verify this certificate by visiting the link above
                  </p>
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleDownloadCertificate(selectedCertificate)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(selectedCertificate.verification_url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Verification Page
                  </Button>
                  <Button variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Info */}
        <div className="bg-blue-50 rounded-lg p-6 mt-12">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Certificate Verification</h3>
          <div className="text-sm text-gray-700">
            <p className="mb-2">All certificates include a unique verification URL that can be used to verify authenticity.</p>
            <p className="mb-2">Each certificate is digitally signed and contains:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Student's full name and unique ID</li>
              <li>Department/specialization information</li>
              <li>Graduation year (2025)</li>
              <li>Working verification link (accessible to anyone)</li>
              <li>Official INSA Cyber Talent branding</li>
            </ul>
            <p className="mt-4 font-semibold">Example verification URL:</p>
            <p className="text-blue-600 font-mono text-xs break-all">
              http://172.27.12.216:8000/yearbook/verify/INSA009/
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}