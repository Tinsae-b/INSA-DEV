import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navigation from "@/components/Navigation"
import PageHeader from "@/components/PageHeader"
import { GraduationCap, Search, Shield, Code, Cpu, Brain, Rocket, Trophy } from "lucide-react"

// This would come from API in real implementation
const traineeStories = [
  {
    id: 1,
    name: "Alemayehu Kebede",
    department: "Cyber Security",
    department_id: 1,
    graduation_year: 2025,
    current_position: "Senior Security Analyst at Commercial Bank of Ethiopia",
    photo_url: "/placeholder-user.jpg",
    achievement: "Led the implementation of a comprehensive security monitoring system that reduced incident response time by 60%",
    bio: "Alemayehu discovered his passion for cybersecurity during his undergraduate studies in Computer Science. His dedication to protecting digital assets led him to excel in threat detection and incident response.",
    project_showcase: "Developed an automated threat intelligence platform that integrates with existing banking systems to provide real-time security insights.",
    skills_acquired: "Penetration Testing, SIEM Management, Threat Hunting, Digital Forensics, Risk Assessment"
  },
  {
    id: 2,
    name: "Sara Teshome",
    department: "Development",
    department_id: 2,
    graduation_year: 2025,
    current_position: "Secure Software Developer at Ethio Telecom",
    photo_url: "/placeholder-user.jpg",
    achievement: "Built secure mobile banking applications serving over 2 million users with zero security incidents",
    bio: "Sara's journey into secure development began with her fascination for creating applications that can withstand sophisticated cyber attacks while maintaining user experience.",
    project_showcase: "Designed and implemented a secure API gateway with advanced authentication mechanisms and real-time threat detection capabilities.",
    skills_acquired: "Secure Coding, API Security, OWASP Top 10, Cryptographic Implementation, Secure Architecture Design"
  },
  {
    id: 3,
    name: "Michael Abebe",
    department: "Embedded Systems",
    department_id: 3,
    graduation_year: 2025,
    current_position: "IoT Security Engineer at Ethiopian Airlines",
    photo_url: "/placeholder-user.jpg",
    achievement: "Secured critical aviation systems and implemented IoT security protocols for fleet management",
    bio: "Michael's expertise in embedded systems security has been instrumental in protecting critical infrastructure in Ethiopia's aviation sector.",
    project_showcase: "Developed a secure firmware update mechanism for aircraft systems with cryptographic verification and rollback capabilities.",
    skills_acquired: "Embedded Security, IoT Security, Firmware Analysis, Hardware Security, Real-time Systems Protection"
  },
  {
    id: 4,
    name: "Hanan Mohammed",
    department: "Emerging Technologies",
    department_id: 4,
    graduation_year: 2025,
    current_position: "Emerging Tech Security Specialist at INSA",
    photo_url: "/placeholder-user.jpg",
    achievement: "Created AI-powered threat detection systems that identify 95% of advanced persistent threats",
    bio: "Hanan's innovative approach to emerging technologies security has revolutionized how we detect and respond to sophisticated cyber threats in real-time.",
    project_showcase: "Built a machine learning model that analyzes network traffic patterns to detect previously unknown malware variants with 99.2% accuracy.",
    skills_acquired: "Machine Learning Security, Adversarial AI, Neural Network Security, Data Privacy, Emerging Tech Ethics"
  },
  {
    id: 5,
    name: "Dawit Assefa",
    department: "Aerospace",
    department_id: 5,
    graduation_year: 2025,
    current_position: "Aerospace Cybersecurity Consultant",
    photo_url: "/placeholder-user.jpg",
    achievement: "Secured Ethiopia's first satellite communication systems and established cybersecurity protocols for space operations",
    bio: "Dawit's pioneering work in aerospace cybersecurity has positioned Ethiopia as a leader in space security within the region.",
    project_showcase: "Designed comprehensive security architecture for satellite ground stations with multi-layered protection against space-based threats.",
    skills_acquired: "Satellite Security, Space Systems Protection, Ground Station Security, Aerospace Communication Security, Space Threat Analysis"
  }
]

const departments = [
  { id: 1, name: "Cyber Security", icon: Shield, color: "bg-red-500" },
  { id: 2, name: "Development", icon: Code, color: "bg-blue-500" },
  { id: 3, name: "Embedded", icon: Cpu, color: "bg-green-500" },
  { id: 4, name: "Emerging Technologies", icon: Brain, color: "bg-purple-500" },
  { id: 5, name: "Aerospace", icon: Rocket, color: "bg-orange-500" },
]

export default function TraineesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <Navigation currentPage="trainees" />
      
      {/* Header */}
      <PageHeader
        title="Success Stories"
        subtitle="Meet our talented graduates who are making a difference in Ethiopia's cybersecurity landscape"
        icon={<Trophy className="h-8 w-8 text-blue-500" />}
      />
      
      {/* Hackathon Winners Gallery */}
      <section className="bg-gradient-to-r from-yellow-50 to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">🏆 National Champions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our students have won numerous national hackathons, CTF competitions, and cybersecurity challenges
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 6].map((num) => (
              <div key={num} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64">
                  <Image
                    src={`/winner${num}.jpg`}
                    alt={`Hackathon Winner ${num}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold">National Winner</h3>
                      <p className="text-sm opacity-90">Cybersecurity Competition</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  🥇 Winner
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600">Graduates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-gray-600">Employment Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">50+</div>
                <div className="text-gray-600">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">5</div>
                <div className="text-gray-600">Specializations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search trainees..." 
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Trainee Stories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {traineeStories.map((trainee) => {
            const department = departments.find(d => d.id === trainee.department_id)
            const IconComponent = department?.icon || Shield
            
            return (
              <Card key={trainee.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                      <Image
                        src={trainee.photo_url}
                        alt={trainee.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">{trainee.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {trainee.current_position}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={`${department?.color} text-white`}>
                      <IconComponent className="w-3 h-3 mr-1" />
                      {trainee.department}
                    </Badge>
                    <Badge variant="outline" className="text-gray-600">
                      {trainee.graduation_year}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Achievement</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {trainee.achievement}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Project Showcase</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {trainee.project_showcase}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Skills Acquired</h4>
                    <div className="flex flex-wrap gap-1">
                      {trainee.skills_acquired.split(', ').slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {trainee.skills_acquired.split(', ').length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{trainee.skills_acquired.split(', ').length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Link href={`/trainees/${trainee.id}`}>
                    <Button className="w-full group-hover:bg-gray-900 transition-colors">
                      View Full Story
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Successful Women in Cybersecurity */}
        <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">👩‍💻 Women Leading Cybersecurity</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Celebrating the incredible women who are breaking barriers and leading innovation in Ethiopia's cybersecurity landscape
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Sara Teshome", role: "Senior Security Developer", company: "Ethio Telecom", image: "/photo_1_2025-09-25_05-01-36.jpg" },
                { name: "Rahel Belete", role: "Network Security Analyst", company: "Commercial Bank", image: "/photo_2_2025-09-25_05-01-36.jpg" },
                { name: "Hanan Mohammed", role: "Emerging Tech Security Specialist", company: "Ethiopian Airlines", image: "/photo_3_2025-09-25_05-01-36.jpg" },
                { name: "Group Achievement", role: "Team Excellence", company: "INSA Cyber Talent", image: "/Group ed.jpg" },
                { name: "Innovation Leader", role: "Tech Pioneer", company: "Startup Ecosystem", image: "/1751959586552.jpeg" },
                { name: "Industry Expert", role: "Security Consultant", company: "Government Sector", image: "/1756562483252.jpeg" }
              ].map((woman, index) => (
                <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={woman.image}
                      alt={woman.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-bold">{woman.name}</h3>
                        <p className="text-sm opacity-90">{woman.role}</p>
                        <p className="text-xs opacity-75">{woman.company}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{woman.name}</h3>
                    <p className="text-blue-600 font-medium mb-1">{woman.role}</p>
                    <p className="text-gray-600 text-sm">{woman.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Successful Projects Showcase */}
        <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Student Success Projects</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Watch projects built by our graduates directly here.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* YouTube 1 */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/YVXQ9d0F8Ow"
                    title="Cybersecurity Awareness Campaign"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">Cybersecurity Awareness Campaign</h3>
                </div>
              </div>

              {/* YouTube 2 */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/QbHoD_x8xsI"
                    title="IoT Security Framework"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">IoT Security Framework</h3>
                </div>
              </div>

              {/* YouTube 3 */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/REFjuiiygYM"
                    title="AI-Powered Threat Detection"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">AI-Powered Threat Detection</h3>
                </div>
              </div>

              {/* TikTok - embed is unreliable without script; show card with link */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 text-center">
                  <div className="text-6xl mb-4">🎬</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Mobile Security App (TikTok)</h3>
                  <p className="text-gray-600 mb-4">Open the short demo on TikTok</p>
                  <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                    <a href="https://vm.tiktok.com/ZMA2nf3HP/" target="_blank" rel="noopener noreferrer">Watch on TikTok</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold mb-4">Ready to Join Our Success Stories?</h2>
              <p className="text-lg mb-6 opacity-90">
                Apply to the INSA Cyber Talent program and become part of Ethiopia's cybersecurity future
              </p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Apply Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
