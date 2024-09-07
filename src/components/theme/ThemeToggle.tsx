'use client'
import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

import { MoonIcon, SunIcon } from '../icons'
import Button from '../ui/button'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState<boolean>(false)
  const { systemTheme, theme, setTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme

  const toggle = () => setTheme(currentTheme === 'light' ? 'dark' : 'light')

  useEffect(() => setMounted(true), [])

  if (!mounted) return <>...</>

  return (
    <Button title="Dark Mode Controller" onClick={toggle}>
      {currentTheme === 'light' && <MoonIcon className="size-7 fill-slate-950" />}
      {currentTheme === 'dark' && <SunIcon className="size-7 fill-white" />}
    </Button>
  )
}
