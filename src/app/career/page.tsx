import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.URL}/career`
  }
}

export default function About() {
  return <main>Career</main>
}
