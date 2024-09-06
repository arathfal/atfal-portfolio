import { NextResponse } from 'next/server'

import portfolios from './portfolios.json'

export async function GET() {
  const data = portfolios.filter((item) => !item?.disabled)

  return NextResponse.json({
    message: 'success',
    status: 200,
    data
  })
}
