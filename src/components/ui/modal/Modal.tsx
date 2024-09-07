'use client'
import { HTMLAttributes, useEffect, useState } from 'react'

import { createPortal } from 'react-dom'

import { CrossIcon } from '@/components/icons'

import Button from '../button'

type Props = HTMLAttributes<HTMLDivElement> & {
  show?: boolean
  onLeave?: VoidFunction
}

export default function Modal({ show, onLeave, children }: Props) {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (show) {
      setContainer(document.body)
    } else {
      setContainer(null)
    }
    return () => setContainer(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  return container
    ? createPortal(
        <div className="fixed left-0 top-0 z-[100] flex h-screen w-screen items-center justify-center px-8 transition-all duration-300">
          <div className="absolute h-full w-full bg-slate-950/70">
            <Button className="h-full w-full cursor-default" onClick={onLeave} />
          </div>
          <Button
            onClick={onLeave}
            className="absolute right-4 top-4 z-50 rounded-full bg-slate-200 p-2"
          >
            <CrossIcon className="size-5 fill-slate-950" />
          </Button>
          <div className="relative max-h-[calc(100vh-2.25rem)] max-w-full rounded-md bg-white text-slate-950 shadow shadow-white sm:w-[550px]">
            {children}
          </div>
        </div>,
        container
      )
    : null
}
