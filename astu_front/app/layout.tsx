import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'INSA Cyber Talent Yearbook',
  description: 'Celebrating Ethiopia\'s cybersecurity talent development program',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
