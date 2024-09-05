import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.URL}/about`
  }
}

export default function Home() {
  return <main>About</main>
}
