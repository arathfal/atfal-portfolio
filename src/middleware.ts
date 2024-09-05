import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  let response = NextResponse.next()
  response.headers.set('x-current-path', request.nextUrl.pathname)

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/about', request.url))
  }

  if (request.nextUrl.pathname === '/about') {
    console.log('true', request.nextUrl.pathname)

    response = NextResponse.rewrite(new URL('/', request.url))
  }

  return response
}
