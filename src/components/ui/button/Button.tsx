import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

import Link from 'next/link'

import { cn } from '@/lib/utils'

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target'> & {
    variant?: 'default' | 'primary' | 'secondary'
  }

function variantStyle(variant: Props['variant']) {
  switch (variant) {
    case 'primary':
      return 'border border-slate-600 bg-slate-600 p-2 text-white hover:bg-slate-500'
    case 'secondary':
      return 'border border-slate-500 bg-slate-950 p-2 text-white hover:bg-slate-900'
    default:
      return ''
  }
}

export default function Button({
  className,
  variant = 'default',
  target,
  children,
  href,
  title,
  ...props
}: Props) {
  const buttonClass = cn(
    'flex items-center justify-center gap-1 rounded text-center text-lg font-semibold transition-all',
    variantStyle(variant),
    className
  )

  if (href) {
    return (
      <Link title={title} prefetch={false} target={target} href={href} className={buttonClass}>
        {children}
      </Link>
    )
  }

  return (
    <button {...props} title={title} className={buttonClass}>
      {children}
    </button>
  )
}
