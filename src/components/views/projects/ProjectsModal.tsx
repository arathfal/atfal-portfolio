import Image from 'next/image'

import Button from '@/components/ui/button'
import Modal from '@/components/ui/modal'
import type { PortfoliosType } from '@/types/portfolios'

type Props = {
  show?: boolean
  data: PortfoliosType | null
  onLeave?: VoidFunction
}

export default function ProjectsModal({ show, data, onLeave }: Props) {
  if (show) {
    return (
      <Modal show onLeave={onLeave}>
        <figure className="relative h-[254px] w-full rounded-tl-[inherit] rounded-tr-[inherit] border-b border-slate-200">
          <Image
            className="rounded-[inherit]"
            src={data?.image || '-'}
            alt={data?.title || '-'}
            fill
            priority
            sizes="100%"
          />
        </figure>
        <div className="px-6 pb-6 pt-3">
          <div className="max-h-[300px] overflow-auto [&::-webkit-scrollbar]:w-0">
            <h1 className="project-title text-xl">
              <strong>{data?.title}</strong>
            </h1>
            <p className="project-description mb-4 text-sm">{data?.description}</p>
            <h5 className="project-subtitle">
              <strong>Tech Stack:</strong>
            </h5>
            <p className="project-tech-stack mb-4 divide-x-2">
              {data?.stack?.map((tech) => {
                return (
                  <span key={tech} className="rounded bg-slate-400 px-1 text-sm">
                    {tech}
                  </span>
                )
              })}
            </p>
            <h5 className="project-subtitle">
              <strong>Role and Contributions:</strong>
            </h5>
            <ul className="mb-4 list-disc pl-4">
              {data?.contribution?.map((contribution) => {
                return (
                  <li key={contribution}>
                    <p className="project-description text-sm">{contribution}</p>
                  </li>
                )
              })}
            </ul>
          </div>

          <Button href={data?.url} variant="primary" target="_blank" className="mt-4 w-full">
            Visit Site
          </Button>
        </div>
      </Modal>
    )
  }

  return null
}
