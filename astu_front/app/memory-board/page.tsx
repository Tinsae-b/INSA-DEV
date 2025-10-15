"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, Camera, Plus, Filter, Search, GraduationCap, MessageSquare, Download, Eye, Shield, Code, Cpu, Brain, Rocket } from "lucide-react"
import Navigation from "@/components/Navigation"
import PageHeader from "@/components/PageHeader"
import { useEffect, useState } from "react"
import { getStudents } from "@/lib/api"

// Student data structure for memory board
interface Student {
  id: number
  student_id: string
  name: string
  department: number
  department_name: string
  photo_url: string
  certificate_url: string
  quote: string
  last_words: string
  highlight_tagline: string
  description: string
  is_featured: boolean
  created_at: string
  updated_at: string
  my_story: string
}

// Mock data for fallback (if API fails) - with generated certificates
const fallbackStudentsData: Student[] = [
  {
    id: 1,
    student_id: "INSA001",
    name: "Alemayehu Kebede",
    department: 1,
    department_name: "Cyber Security",
    photo_url: "/placeholder-user.jpg",
    certificate_url: "http://172.27.12.216:8000/media/certificates/generated/INSA001_Alemayehu_Kebede_certificate.png",
    quote: "Cybersecurity is not just a job, it's a mission to protect our nation's digital future.",
    last_words: "The INSA Cyber Talent program has transformed me into a cybersecurity professional. I'm proud to be part of Ethiopia's digital defense team. Thank you for this incredible journey!",
    highlight_tagline: "Advanced Threat Detection Specialist",
    description: "Led the implementation of a comprehensive security monitoring system that reduced incident response time by 60%. Specialized in penetration testing and digital forensics.",
    is_featured: true,
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
    my_story: "My journey in cybersecurity began with a passion for protecting digital assets and has led me to become a specialist in threat detection and incident response."
  },
  {
    id: 2,
    student_id: "INSA002",
    name: "Sara Teshome",
    department: 2,
    department_name: "Development",
    photo_url: "/placeholder-user.jpg",
    certificate_url: "http://172.27.12.216:8000/media/certificates/generated/INSA002_Sara_Teshome_certificate.png",
    quote: "Building secure applications that protect millions of users has been my dream.",
    last_words: "Building secure applications that protect millions of users has been my dream. INSA Cyber Talent made it possible. Ready to secure Ethiopia's digital future!",
    highlight_tagline: "Secure Software Developer",
    description: "Built secure mobile banking applications serving over 2 million users with zero security incidents. Expert in secure coding and API security.",
    is_featured: true,
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
    my_story: "I discovered my passion for secure software development during the program and have since become an expert in building resilient applications."
  },
  {
    id: 3,
    student_id: "INSA003",
    name: "Michael Abebe",
    department: 3,
    department_name: "Embedded Systems",
    photo_url: "/placeholder-user.jpg",
    certificate_url: "http://172.27.12.216:8000/media/certificates/generated/INSA003_Michael_Abebe_certificate.png",
    quote: "Securing critical infrastructure is a huge responsibility and privilege.",
    last_words: "Securing critical infrastructure like aviation systems is a huge responsibility. I'm grateful to INSA for preparing me to protect our nation's most important systems.",
    highlight_tagline: "IoT Security Engineer",
    description: "Secured critical aviation systems and implemented IoT security protocols for fleet management at Ethiopian Airlines.",
    is_featured: true,
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
    my_story: "My expertise in embedded systems security has been instrumental in protecting critical infrastructure in Ethiopia's aviation sector."
  },
  {
    id: 4,
    student_id: "INSA004",
    name: "Hanan Mohammed",
    department: 4,
    department_name: "Emerging Technologies",
    photo_url: "/placeholder-user.jpg",
    certificate_url: "http://172.27.12.216:8000/media/certificates/generated/INSA004_Hanan_Mohammed_certificate.png",
    quote: "Using emerging technologies to defend against cyber threats is the future of cybersecurity.",
    last_words: "Using emerging technologies to defend against cyber threats is the future. INSA gave me the tools to be at the forefront of this revolution. Proud to be an emerging tech security specialist!",
    highlight_tagline: "Emerging Tech Security Specialist",
    description: "Developed AI-powered threat detection system with 99.2% accuracy. Expert in machine learning security and adversarial AI.",
    is_featured: true,
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
    my_story: "I've always been fascinated by the intersection of emerging technologies and cybersecurity, and this program helped me become a specialist in emerging tech security."
  },
  {
    id: 5,
    student_id: "INSA005",
    name: "Dawit Assefa",
    department: 5,
    department_name: "Aerospace",
    photo_url: "/placeholder-user.jpg",
    certificate_url: "http://172.27.12.216:8000/media/certificates/generated/INSA005_Dawit_Assefa_certificate.png",
    quote: "Securing Ethiopia's space communications is a privilege and honor.",
    last_words: "Securing Ethiopia's space communications is a privilege. INSA Cyber Talent prepared me for this frontier of cybersecurity. Ready to protect our nation's space assets!",
    highlight_tagline: "Space Systems Security Expert",
    description: "Developed satellite communication security protocols for Ethiopia's space infrastructure.",
    is_featured: true,
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
    my_story: "The aerospace security specialization opened up new frontiers for me in protecting Ethiopia's space assets and satellite communications."
  },
  {
    id: 6,
    student_id: "INSA006",
    name: "Rahel Belete",
    department: 1,
    department_name: "Cyber Security",
    photo_url: "/placeholder-user.jpg",
    certificate_url: "http://172.27.12.216:8000/media/certificates/generated/INSA006_Rahel_Belete_certificate.png",
    quote: "Every day is a new challenge in cybersecurity, and I'm ready for it.",
    last_words: "Every day is a new challenge in cybersecurity. INSA taught me to be resilient and always stay ahead of threats. Grateful for this life-changing opportunity!",
    highlight_tagline: "Network Security Analyst",
    description: "Expert in network intrusion detection and prevention systems. Specialized in incident response and vulnerability assessment.",
    is_featured: false,
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
    my_story: "I've grown from a curious beginner to a confident network security analyst, ready to protect organizations from cyber threats."
  },
  {
    id: 7,
    student_id: "INSA007",
    name: "Samuel Teshome",
    department: 2,
    department_name: "Development",
    photo_url: "/placeholder-user.jpg",
    certificate_url: "http://172.27.12.216:8000/media/certificates/generated/INSA007_Samuel_Teshome_certificate.png",
    quote: "Blockchain technology is revolutionizing security and I'm part of it.",
    last_words: "Blockchain technology is revolutionizing security. INSA gave me the expertise to build secure, decentralized systems. Excited to contribute to Ethiopia's digital transformation!",
    highlight_tagline: "Blockchain Security Developer",
    description: "Designed and implemented blockchain-based identity management system for secure digital transactions.",
    is_featured: false,
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
    my_story: "Blockchain security has become my passion, and I'm excited to contribute to Ethiopia's digital transformation through secure decentralized systems."
  },
  {
    id: 8,
    student_id: "INSA008",
    name: "Meron Zeleke",
    department: 3,
    department_name: "Embedded Systems",
    photo_url: "/placeholder-user.jpg",
    certificate_url: "http://172.27.12.216:8000/media/certificates/generated/INSA008_Meron_Zeleke_certificate.png",
    quote: "Smart cities need smart security, and I'm here to provide it.",
    last_words: "Smart cities need smart security. INSA prepared me to secure the connected future. Proud to be part of Ethiopia's smart city security initiatives!",
    highlight_tagline: "Smart City Security Engineer",
    description: "Developed IoT security infrastructure for smart city implementations across Ethiopia.",
    is_featured: false,
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
    my_story: "I'm passionate about securing the connected future and have become an expert in smart city IoT security infrastructure."
  }
]

// Department data for filtering
const departments = [
  { id: 1, name: "Cyber Security", icon: Shield, color: "bg-red-500" },
  { id: 2, name: "Development", icon: Code, color: "bg-blue-500" },
  { id: 3, name: "Embedded Systems", icon: Cpu, color: "bg-green-500" },
  { id: 4, name: "Artificial Intelligence", icon: Brain, color: "bg-purple-500" },
  { id: 5, name: "Aerospace", icon: Rocket, color: "bg-orange-500" },
]

export default function MemoryBoardPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showCertificate, setShowCertificate] = useState(false)

  // Fetch students from API
  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true)
        const data = await getStudents()
        console.log("API Response:", data)
        setStudents(data.results || [])
      } catch (error) {
        console.error("Failed to fetch students:", error)
        // Fallback to mock data with certificates
        setStudents(fallbackStudentsData)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  // Filter students based on search and department
  useEffect(() => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_words.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedDepartment !== "all") {
      filtered = filtered.filter(student => student.department === parseInt(selectedDepartment))
    }

    setFilteredStudents(filtered)
  }, [searchTerm, selectedDepartment, students])

  const handleShowCertificate = (student: Student) => {
    setSelectedStudent(student)
    setShowCertificate(true)
  }

  const handleDownloadCertificate = async (student: Student) => {
    try {
      // Fetch the image as a blob
      const response = await fetch(student.certificate_url)
      const blob = await response.blob()
      
      // Create a download link with the blob
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${student.student_id}_Certificate.png`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading certificate:', error)
      // Fallback to opening in new tab if download fails
      window.open(student.certificate_url, '_blank')
    }
  }

  const closeCertificateModal = () => {
    setShowCertificate(false)
    setSelectedStudent(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation currentPage="memory-board" />
      
      <PageHeader
        title="INSA Cyber Talent Yearbook"
        subtitle="Celebrating our talented cybersecurity professionals and their achievements"
        icon={<GraduationCap className="h-8 w-8 text-blue-500" />}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students, departments, or projects..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <GraduationCap className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Students Grid */}
        {loading ? (
          <div className="text-center text-gray-600 py-12">
            <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-400 animate-spin" />
            <h3 className="text-xl font-semibold mb-2">Loading Students...</h3>
            <p>Fetching student information and certificates...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map((student) => {
              const department = departments.find(d => d.id === student.department)
              const IconComponent = department?.icon || Shield
              
              return (
                <Card key={student.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                        <Image
                          src={student.photo_url || "/placeholder-user.jpg"}
                          alt={student.name}
                          fill
                          onError={(e) => {
                            console.error("Image failed to load:", student.photo_url, "for student:", student.name)
                            e.currentTarget.src = "/placeholder-user.jpg"
                          }}
                          onLoad={() => console.log("Image loaded successfully:", student.photo_url, "for student:", student.name)}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">{student.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{student.department_name}</span>
                        </div>
                        <Badge className="mt-1 bg-blue-100 text-blue-800">
                          {student.student_id}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Quote</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "{student.quote}"
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Achievement</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {student.highlight_tagline}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Last Words</h4>
                      <p className="text-sm text-gray-600 leading-relaxed italic">
                        "{student.last_words}"
                      </p>
                    </div>
                  
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleShowCertificate(student)}
                      >
                        <Eye className="w-4 h-4 mr-2" /> Show Certificate
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleDownloadCertificate(student)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {showCertificate && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedStudent.name}'s Certificate
                  </h2>
                  <p className="text-sm text-gray-600">Student ID: {selectedStudent.student_id}</p>
                </div>
                <Button variant="outline" onClick={closeCertificateModal}>
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="text-center">
                <div className="relative inline-block">
                  <Image
                    src={selectedStudent.certificate_url}
                    alt={`${selectedStudent.name}'s Certificate`}
                    width={1200}
                    height={800}
                    className="max-w-full h-auto object-contain mx-auto"
                  />
                  {/* Clickable overlay for the verification link area on the certificate */}
                  <a
                    href={`http://172.27.12.216:8000/yearbook/verify/${selectedStudent.student_id}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute cursor-pointer hover:bg-blue-500 hover:bg-opacity-10 transition-all"
                    style={{
                      bottom: '12%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: '4%',
                    }}
                    title="Click to verify certificate"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    🔗 Click on the verification link in the certificate to verify
                  </p>
                  <a 
                    href={`http://172.27.12.216:8000/yearbook/verify/${selectedStudent.student_id}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Or click here to verify: {selectedStudent.student_id}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end gap-3">
              <Button 
                variant="outline"
                onClick={() => window.open(`http://172.27.12.216:8000/yearbook/verify/${selectedStudent.student_id}/`, '_blank')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verify Certificate
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleDownloadCertificate(selectedStudent)}
              >
                <Download className="w-4 h-4 mr-2" /> Download Certificate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}