import type { Metadata } from 'next'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  alternates: {
    canonical: '/project'
  }
}

export default function About() {
  const header = headers()
  console.log(header)

  return <main>Projects</main>
}
