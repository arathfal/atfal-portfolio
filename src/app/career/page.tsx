import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.URL}/career`
  }
}

export default function About() {
  return (
    <main className="container relative mx-auto h-[calc(100vh-80px)] overflow-auto p-5 sm:h-[calc(100vh-80px-64px)]">
      Career
    </main>
  )
}
