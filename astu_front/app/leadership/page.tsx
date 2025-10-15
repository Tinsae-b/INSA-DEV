import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/Navigation"
import PageHeader from "@/components/PageHeader"
import { Shield, Users, Target, Users2 } from "lucide-react"

// This would come from API in real implementation
const leadershipMessages = {
  directorGeneral: {
    name: "H.E. Tigist Hamid",
    position: "Director General of Information Network Security Administration (INSA), Ethiopia",
    photo: "/tigist.jpg", // You'll need to add this image
    message: `As we celebrate the graduation of our first cohort of cybersecurity professionals, I am filled with immense pride and hope for Ethiopia's digital future. The INSA Cyber Talent program represents our nation's commitment to building a robust cybersecurity ecosystem that can protect our critical infrastructure and digital assets.

These talented individuals have undergone rigorous training in cutting-edge cybersecurity technologies, threat detection, incident response, and digital forensics. They are not just graduates; they are the guardians of Ethiopia's cyberspace, ready to defend our nation against evolving cyber threats.

The digital transformation of Ethiopia presents both opportunities and challenges. As we embrace digital government services, e-commerce, and smart infrastructure, we must ensure that security is built into every system from the ground up. Our cyber talent graduates are equipped with the knowledge, skills, and ethical foundation necessary to lead this secure digital transformation.

I commend each graduate for their dedication, perseverance, and commitment to excellence. Your journey doesn't end here; it's just beginning. You are now part of Ethiopia's cybersecurity defense network, and the responsibility to protect our nation's digital sovereignty rests on your shoulders.

Together, we will build a safer, more secure digital Ethiopia for generations to come. Congratulations to our cyber defenders!`
  },
  cyberTalentDirector: {
    name: "Bishaw Beyene",
    position: "INSA Cyber Talent Director",
    photo: "/bishaw.jpg", // You'll need to add this image
    message: `It has been an incredible privilege to witness the transformation of these bright minds into skilled cybersecurity professionals. Over the past months, I've seen each trainee grow from curious beginners to confident defenders of Ethiopia's digital infrastructure.

The INSA Cyber Talent program was designed with a singular vision: to create a new generation of cybersecurity experts who understand both the technical aspects of cyber defense and the unique challenges facing our nation. Our curriculum covers five critical specializations:

Cyber Security - The foundation of digital defense, covering threat analysis, vulnerability assessment, and incident response.
Software Development - Secure coding practices and building resilient applications.
Embedded Systems - Securing IoT devices and industrial control systems.
Artificial Intelligence - Using AI for threat detection and cybersecurity automation.
Aerospace Security - Protecting critical infrastructure in aviation and space systems.

Each graduate has demonstrated exceptional dedication to mastering these complex domains. They've worked on real-world projects, participated in cybersecurity competitions, and contributed to Ethiopia's digital security initiatives.

What sets our graduates apart is not just their technical skills, but their deep understanding of cybersecurity ethics and their commitment to serving the greater good. They understand that cybersecurity is not just about technology; it's about protecting people, communities, and our nation's progress.

As you embark on your careers, remember that you are pioneers in Ethiopia's cybersecurity journey. You have the knowledge, the skills, and the responsibility to shape a more secure digital future for our country.

Congratulations, and welcome to the ranks of Ethiopia's cyber defenders!`
  }
}

export default function LeadershipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <Navigation currentPage="leadership" />
      
      {/* Header */}
      <PageHeader
        title="Leadership Messages"
        subtitle="Words of inspiration and guidance from our leaders who are shaping Ethiopia's cybersecurity future"
        icon={<Users2 className="h-8 w-8 text-blue-500" />}
      />

      {/* Leadership Messages */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Director General Message */}
          <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-6">
                  <div className="relative w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                    <Image
                      src="/tigist.jpg"
                      alt={leadershipMessages.directorGeneral.name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: 'center 30%' }}
                    />
                  </div>
              </div>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-3">
                {leadershipMessages.directorGeneral.name}
              </CardTitle>
              <CardDescription className="text-xl text-gray-700 font-medium mb-4">
                {leadershipMessages.directorGeneral.position}
              </CardDescription>
              <Badge className="w-fit mx-auto mt-2 bg-blue-600 text-lg px-4 py-2">
                <Shield className="w-5 h-5 mr-2" />
                Director General
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {leadershipMessages.directorGeneral.message.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cyber Talent Director Message */}
          <Card className="shadow-xl border-0 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-6">
                  <div className="relative w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                    <Image
                      src="/bishaw.jpg"
                      alt={leadershipMessages.cyberTalentDirector.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
              </div>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-3">
                {leadershipMessages.cyberTalentDirector.name}
              </CardTitle>
              <CardDescription className="text-xl text-gray-700 font-medium mb-4">
                {leadershipMessages.cyberTalentDirector.position}
              </CardDescription>
              <Badge className="w-fit mx-auto mt-2 bg-green-600 text-lg px-4 py-2">
                <Target className="w-5 h-5 mr-2" />
                Program Director
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {leadershipMessages.cyberTalentDirector.message.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vision Statement */}
          <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision for Ethiopia's Cybersecurity Future
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure Nation</h3>
                  <p className="text-gray-600 text-sm">
                    Building comprehensive cybersecurity defenses to protect Ethiopia's digital infrastructure
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Skilled Workforce</h3>
                  <p className="text-gray-600 text-sm">
                    Developing world-class cybersecurity professionals to meet growing industry demands
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Innovation Hub</h3>
                  <p className="text-gray-600 text-sm">
                    Creating an ecosystem for cybersecurity research, development, and innovation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
