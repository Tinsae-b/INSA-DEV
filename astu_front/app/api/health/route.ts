// Health check endpoint for Next.js frontend
export async function GET() {
  return Response.json(
    { 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'nextjs-frontend'
    },
    { status: 200 }
  )
}


