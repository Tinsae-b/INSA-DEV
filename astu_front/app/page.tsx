import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navigation from "@/components/Navigation"
import { BookOpen } from "lucide-react"

// Placeholder data that would come from Django REST API
const heroData = {
  title: "INSA Cyber Talent Yearbook 2025",
  subtitle: "Empowering Ethiopia's Digital Future Through Cybersecurity Excellence",
  description: "Celebrating the journey of our talented cybersecurity professionals who are shaping Ethiopia's digital landscape and defending our nation's cyberspace.",
  backgroundImage: "/placeholder.svg?height=600&width=1200",
}

const statsData = {
  trainees: 500,
  instructors: 45,
  departments: 5,
  graduates: 500,
}


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <Navigation currentPage="home" />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
        <Image
          src={heroData.backgroundImage || "/placeholder.svg"}
          alt="INSA Cyber Talent Training Center"
          fill
          className="object-cover -z-10"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{heroData.title}</h1>
            <p className="text-xl md:text-2xl mb-4 font-medium">{heroData.subtitle}</p>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">{heroData.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  About INSA Cyber Talent
                </Button>
              </Link>
              <Link href="/trainees">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white"
                >
                  Success Stories
                </Button>
              </Link>
              <Link href="/memory-board">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white"
                >
                  Memory Board
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

        {/* Leadership Section */}
        <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership Messages</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Words of inspiration from our leaders who are shaping Ethiopia's cybersecurity future
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-12">
            {/* H.E. Tigist Hamid */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <div className="relative w-64 h-64 mx-auto md:mx-0 rounded-full overflow-hidden border-6 border-white shadow-2xl">
                      <Image
                        src="/tigist.jpg"
                        alt="H.E. Tigist Hamid"
                        fill
                        className="object-cover"
                        style={{ objectPosition: 'center 30%' }}
                      />
                    </div>
                  </div>
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">H.E. Tigist Hamid</h3>
                    <p className="text-lg text-blue-600 font-semibold">
                      Director General of Information Network Security Administration (INSA), Ethiopia
                    </p>
                  </div>
                  <blockquote className="text-gray-700 leading-relaxed italic">
                    "As we celebrate the graduation of our first cohort of cybersecurity professionals, I am filled with immense pride and hope for Ethiopia's digital future. The INSA Cyber Talent program represents our nation's commitment to building a robust cybersecurity ecosystem that can protect our critical infrastructure and digital assets."
                  </blockquote>
                  <div className="mt-6">
                    <Link href="/leadership">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Read Full Message
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bishaw Beyene */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <div className="relative w-64 h-64 mx-auto md:mx-0 rounded-full overflow-hidden border-6 border-white shadow-2xl">
                      <Image
                        src="/bishaw.jpg"
                        alt="Bishaw Beyene"
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Bishaw Beyene</h3>
                    <p className="text-lg text-green-600 font-semibold">
                      INSA Cyber Talent Director
                    </p>
                  </div>
                  <blockquote className="text-gray-700 leading-relaxed italic">
                    "It has been an incredible privilege to witness the transformation of these bright minds into skilled cybersecurity professionals. Over the past months, I've seen each trainee grow from curious beginners to confident defenders of Ethiopia's digital infrastructure."
                  </blockquote>
                  <div className="mt-6">
                    <Link href="/leadership">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        Read Full Message
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Memory Gallery Animation Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Memories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Capturing the journey of our cybersecurity professionals through training, collaboration, and achievement
            </p>
          </div>
          
          {/* Animated Photo Gallery */}
          <div className="relative">
            <div className="flex space-x-4 animate-scroll">
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="flex-shrink-0 w-80 h-60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <Image
                      src={`/photo_${num}_2025-09-25_04-57-${num <= 3 ? '08' : '09'}.jpg`}
                      alt={`Memory ${num}`}
                      width={320}
                      height={240}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
              {/* Duplicate for seamless loop */}
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={`dup-${num}`} className="flex-shrink-0 w-80 h-60 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={`/photo_${num}_2025-09-25_04-57-${num <= 3 ? '08' : '09'}.jpg`}
                      alt={`Memory ${num}`}
                      width={320}
                      height={240}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {statsData.trainees.toLocaleString()}
              </div>
              <div className="text-gray-600 font-medium">Trainees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{statsData.instructors}</div>
              <div className="text-gray-600 font-medium">Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{statsData.departments}</div>
              <div className="text-gray-600 font-medium">Specializations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                {statsData.graduates.toLocaleString()}
              </div>
              <div className="text-gray-600 font-medium">Graduates</div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Be Part of Ethiopia's Cybersecurity Story</h2>
            <p className="text-xl mb-8 opacity-90">
              Share your memories, connect with fellow cyber defenders, and celebrate the INSA Cyber Talent community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/trainees">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  View Success Stories
              </Button>
              </Link>
              <Link href="/memory-board-gallery">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white"
              >
                  Share Your Memory
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="text-xl font-bold">INSA Cyber Talent Yearbook</span>
              </div>
              <p className="text-gray-400">
                Preserving memories and celebrating achievements of Ethiopia's cybersecurity talent development program.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About INSA Cyber Talent
                  </Link>
                </li>
                <li>
                  <Link href="/leadership" className="hover:text-white transition-colors">
                    Leadership
                  </Link>
                </li>
                <li>
                  <Link href="/departments" className="hover:text-white transition-colors">
                    Specializations
                  </Link>
                </li>
                <li>
                  <Link href="/students" className="hover:text-white transition-colors">
                    Trainees
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/trainees" className="hover:text-white transition-colors">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="/faculty-tributes" className="hover:text-white transition-colors">
                    Instructors
                  </Link>
                </li>
                <li>
                  <Link href="/memory-board" className="hover:text-white transition-colors">
                    Yearbook
                  </Link>
                </li>
                <li>
                  <Link href="/memory-board-gallery" className="hover:text-white transition-colors">
                    Memory Board
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Information Network Security Administration (INSA)
                <br />
                Addis Ababa, Ethiopia
                <br />
                info@insa.gov.et
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 INSA Cyber Talent Yearbook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
