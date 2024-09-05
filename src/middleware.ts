import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  let response = NextResponse.next()

  response.headers.set('x-current-path', request.nextUrl.pathname)

  if (request.nextUrl.pathname === '/') {
    response = NextResponse.redirect(new URL('/about', request.url))
  }

  if (request.nextUrl.pathname === '/about') {
    response = NextResponse.rewrite(new URL('/', request.url))
  }

  return response
}
