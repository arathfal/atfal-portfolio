import type { Metadata } from 'next'

import Projects from '@/components/views/projects'

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.URL}/projects`
  }
}

export default Projects
