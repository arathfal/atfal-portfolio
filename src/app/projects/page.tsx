import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.URL}/project`
  }
}

export default function About() {
  return <main>Projects</main>
}
