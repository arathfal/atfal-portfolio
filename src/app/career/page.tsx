import type { Metadata } from 'next'

import Career from '@/components/views/career'

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.URL}/career`
  }
}

export default Career
