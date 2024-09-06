'use client'
import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import NAVIGATIONS from '@/constants/navigations'
import { cn } from '@/lib/utils'

import { CrossIcon, LoveIcon, MenuIcon } from '../icons'
import { ThemeToggle } from '../theme'

export default function Header() {
  const pathname = usePathname()
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false)

  const toggleMenu = () => setIsShowMenu(!isShowMenu)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsShowMenu(true)
      } else {
        setIsShowMenu(false)
      }
    }
    if (typeof window !== 'undefined') {
      handleResize() // Initial check before mounted
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header className="relative flex w-full items-center px-5 py-5 sm:px-8">
      <div className="flex w-full items-center gap-3 border-gray-400 sm:w-auto sm:border-r sm:pr-5">
        <figure className="inline-flex size-10 items-center justify-center rounded-full bg-white">
          <Image
            src="/images/Black Logo.png"
            width={24}
            height={24}
            alt="Logo"
            sizes="100%"
            priority
          />
        </figure>
        <strong className="hidden text-lg sm:inline-block">Atfal.Dev</strong>

        <button title="Open Menu" className="ml-auto sm:hidden" onClick={toggleMenu}>
          <MenuIcon className="size-7 stroke-slate-950 dark:stroke-white" />
        </button>
      </div>

      <div
        className={cn(
          'absolute right-0 top-0 z-50 flex h-screen w-60 flex-col gap-5 bg-white p-4 transition-all duration-500 dark:bg-slate-950 sm:relative sm:h-auto sm:w-full sm:flex-row sm:items-center sm:justify-between sm:bg-transparent sm:p-0 sm:dark:bg-transparent',
          {
            'translate-x-0 opacity-100': !!isShowMenu,
            'translate-x-60 opacity-0': !isShowMenu
          }
        )}
      >
        <nav className="order-2 flex flex-col gap-4 border-gray-400 sm:order-1 sm:flex-row sm:items-center sm:px-5">
          {NAVIGATIONS.map(({ label, href }) => (
            <Link
              key={label}
              prefetch={false}
              href={href}
              className={cn('px-2 py-1 text-center font-semibold transition-all duration-300', {
                '[&:not(:hover)]:text-slate-600 [&:not(:hover)]:dark:text-slate-400':
                  href !== pathname,
                'border-b border-slate-600 dark:border-white': href === pathname
              })}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="order-1 flex w-full justify-between gap-5 sm:order-2 sm:w-auto">
          <ThemeToggle />
          <button title="Close Menu" className="sm:hidden" onClick={toggleMenu}>
            <CrossIcon className="size-5 stroke-slate-950 dark:stroke-white" />
          </button>
        </div>
        <span className="order-3 mt-auto flex h-6 items-center gap-1.5 text-slate-600 dark:text-slate-400 sm:hidden">
          <span className="h-5">Coded with</span>
          <LoveIcon className="h-full w-5 fill-pink-700" />
          <span className="h-5">Aradea Atfal</span>
        </span>
      </div>
    </header>
  )
}
