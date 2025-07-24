import { NextRequest, NextResponse } from 'next/server';

// Middleware for API routes
export function middleware(request: NextRequest) {
  // Log API requests (production ortamında kaldırılabilir)
  if (request.nextUrl.pathname.startsWith('/api/') && process.env.NODE_ENV === 'development') {
    console.log(`${new Date().toISOString()} - ${request.method} ${request.nextUrl.pathname}`);
  }

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
};
