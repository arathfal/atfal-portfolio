'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

import SOCIAL_MEDIAS from '@/constants/social-medias'

import { LoveIcon } from '../icons'

export default function Footer() {
  return (
    <footer className="hidden w-full justify-between gap-5 px-8 py-5 sm:flex">
      <motion.span
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.6, 1] }}
        className="flex h-6 items-center gap-1.5 text-slate-600 dark:text-slate-400"
      >
        <span className="h-5">Coded with</span>
        <LoveIcon className="h-full w-5 fill-pink-700" />
        <span className="h-5">Aradea Atfal</span>
      </motion.span>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.6, 1] }}
        className="flex gap-5"
      >
        {SOCIAL_MEDIAS.map(({ label, href }) => (
          <Link
            key={label}
            prefetch={false}
            href={href}
            className="font-semibold text-slate-600 transition-all duration-300 hover:text-slate-400 dark:text-slate-400 dark:hover:text-slate-500"
            target="_blank"
          >
            {label}
          </Link>
        ))}
      </motion.div>
    </footer>
  )
}
