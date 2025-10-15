"use client"

import Link from "next/link"
import Image from "next/image"

interface NavigationProps {
  currentPage?: string
}

export default function Navigation({ currentPage }: NavigationProps) {
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/insa-logo.png"
                alt="INSA Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">INSA Cyber Talent Yearbook</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`transition-colors font-medium ${
                currentPage === "home" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/leadership"
              className={`transition-colors font-medium ${
                currentPage === "leadership" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Leadership
            </Link>
            <Link
              href="/trainees"
              className={`transition-colors font-medium ${
                currentPage === "trainees" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Success Stories
            </Link>
                    <Link
                      href="/memory-board"
                      className={`transition-colors font-medium ${
                        currentPage === "memory-board" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      Yearbook
                    </Link>
                    <Link
                      href="/memory-board-gallery"
                      className={`transition-colors font-medium ${
                        currentPage === "memory-board-gallery" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      Memory Board
                    </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
