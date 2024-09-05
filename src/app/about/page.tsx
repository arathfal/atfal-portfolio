import { headers } from 'next/headers'

export default function About() {
  const header = headers()
  console.log(header)
  return <main>About</main>
}
