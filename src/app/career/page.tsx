import type { Metadata } from 'next'

import Career from '@/components/views/career'
import fetcher from '@/utils/fetcher'

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.URL}/career`
  }
}
async function getCareer() {
  const response = await fetcher(process.env.CAREERS_PATH)
  return response
}

export default async function Page() {
  const careers = await getCareer()

  return <Career careers={careers} />
}
