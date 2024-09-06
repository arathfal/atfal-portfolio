import Image from 'next/image'
import Link from 'next/link'

import { DocumentIcon } from '@/components/icons'
import TECH_STACKS from '@/constants/tech-tacks'

export default function About() {
  return (
    <main className="container relative mx-auto flex h-[calc(100vh-80px)] flex-col items-center overflow-auto p-5 sm:h-[calc(100vh-80px-64px)] md:flex-row">
      <section className="order-2 flex flex-col items-center text-center md:order-1 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
          Hey! I&apos;m Aradea Atfal
        </h2>
        <h1 className="title-font mb-4 text-4xl xl:text-5xl">
          <strong>
            <span className="text-slate-500">Frontend </span> Developer.
          </strong>
        </h1>
        <p className="leading-relaxed">
          Passionately experienced in crafting captivating website interfaces, ensuring seamless
          user interaction and engagement
        </p>
        <div className="mb-8 mt-2.5 flex flex-col items-center gap-2 text-sm text-slate-700 dark:text-slate-300 sm:flex-row">
          <span className="sm:h-7">Tech Stack:</span>
          <span className="space-x-2">
            {TECH_STACKS.map(({ title, Icon }) => (
              <span
                key={title}
                title={title}
                className="relative inline-flex size-7 items-center rounded-md bg-slate-600 p-1"
              >
                <Icon className="size-6 transition-all duration-700 [&:not(:hover)]:fill-slate-400" />
              </span>
            ))}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            prefetch={false}
            href="/projects"
            className="w-32 rounded border border-slate-600 bg-slate-600 py-2 text-center text-lg font-semibold text-white transition-all hover:bg-slate-500"
          >
            Explore
          </Link>
          <Link
            prefetch={false}
            href="/resume.pdf"
            target="_blank"
            className="inline-flex w-32 items-center justify-center gap-1 rounded border border-slate-500 bg-slate-950 py-2 text-lg font-semibold text-white transition-all hover:bg-slate-900"
          >
            <DocumentIcon className="size-4 fill-white" />
            Resume
          </Link>
        </div>
      </section>
      <section className="relative order-1 mb-8 flex w-5/6 justify-center md:order-2 md:mb-0 md:w-1/2 lg:w-full lg:max-w-lg">
        <figure className="relative size-60 overflow-hidden rounded-full bg-slate-400 dark:bg-slate-700 sm:size-80">
          <Image
            src="/images/Photo Profile.png"
            alt="hero"
            className="relative z-20"
            sizes="100%"
            fill
            priority
          />
        </figure>
      </section>
    </main>
  )
}
