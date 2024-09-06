import { NextResponse } from 'next/server'

import data from './careers.json'

export async function GET() {
  return NextResponse.json({
    message: 'success',
    status: 200,
    data
  })
}
