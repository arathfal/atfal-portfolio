import type { Metadata } from 'next'

import About from '@/components/views/about'

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.URL}/about`
  }
}

export default About
