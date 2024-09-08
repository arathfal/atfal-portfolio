import type { Metadata } from 'next'
import { Exo_2 as Exo2 } from 'next/font/google'

import { Footer, Header } from '@/components/layouts'
import { ThemeProvider } from '@/components/theme'
import { cn } from '@/lib/utils'

import './globals.css'

const font = Exo2({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'Aradea Atfal - Front End Engineer',
  description:
    "This is Aradea Atfal's personal website. Get to know and explore all about Aradea Atfal",
  authors: {
    name: 'Aradea Atfal'
  },
  keywords:
    'Aradea, Atfal, Ridianto, Aradea Atfal Ridianto, Frontend, Front-End, Developer, Engineer, ReactJS, NextJS, Shipper, Badr Interactive',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', sizes: '32x32', url: '/images/favicon-32x32.png' },
    { rel: 'icon', sizes: '16x16', url: '/images/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/images/apple-touch-icon.png' }
  ],
  robots: 'index, follow',
  category: 'Portfolio',
  themeColor: '#E5E5E5',
  alternates: {
    canonical: process.env.URL
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'bg-white font-medium text-slate-900 dark:bg-slate-800 dark:text-white',
          font.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div
            id="next_app"
            className={cn(
              'grid-layout relative grid max-h-screen grid-rows-[80px,1fr] overflow-hidden bg-slate-500/10 antialiased dark:bg-slate-950/10 sm:grid-rows-[80px,1fr,64px]',
              'before:absolute before:-left-[150%] before:top-0 before:z-[-1] before:h-full before:w-[300%] before:rotate-45 before:bg-slate-500/30 before:content-[""] before:dark:bg-slate-950/50'
            )}
          >
            <Header />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
