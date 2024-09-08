'use client'

import { useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import 'swiper/css/pagination'

import Button from '@/components/ui/button'
import type { PortfoliosType } from '@/types/portfolios'

import ProjectsModal from './ProjectsModal'
import ProjectsSwiper from './ProjectsSwiper'

import './styles.css'

type Props = {
  projects: PortfoliosType[]
  projectByIndex: Record<number, PortfoliosType>
}

export default function Projects({ projects, projectByIndex }: Props) {
  const [currentDetail, setCurrentDetail] = useState<PortfoliosType>(projectByIndex[1])
  const [dataModal, setDataModal] = useState<PortfoliosType | null>(null)

  const onSlideChange = (index: number) => {
    if (index >= 0 && index < projects?.length + 1) {
      setCurrentDetail(projectByIndex[index])
    }
  }

  const onOpenDetail = () => {
    if (!!currentDetail) {
      setDataModal(currentDetail)
    }
  }

  const onCloseDetail = () => {
    setDataModal(null)
  }

  return (
    <motion.main
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: [0.2, 0.8, 0.6, 1] }}
      className="container relative mx-auto flex h-[calc(100vh-80px)] flex-col justify-center gap-4 overflow-auto p-5 sm:h-[calc(100vh-80px-64px)] md:flex-row md:items-center md:justify-normal"
    >
      <ProjectsModal show={!!dataModal} data={dataModal} onLeave={onCloseDetail} />
      <section className="relative order-2 w-full md:order-1 md:w-1/2">
        <div className="relative hidden min-h-[380px] md:flex">
          <div className="relative flex flex-col items-start justify-between gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDetail?.title}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.6, 1] }}
              >
                <h1 className="text-2xl sm:text-3xl xl:text-4xl">
                  <strong>{currentDetail?.title}</strong>
                </h1>
                <p className="mb-auto mt-2.5 leading-relaxed">{currentDetail?.description}</p>
              </motion.div>
            </AnimatePresence>

            <Button
              className="text-nowrap rounded-none border-b-2 border-slate-900 px-4 text-lg font-normal dark:border-white"
              onClick={onOpenDetail}
            >
              <strong>View Detail</strong>
            </Button>
          </div>
        </div>
        <div className="swiper-pagination" />
      </section>
      <ProjectsSwiper
        slides={projects}
        detail={currentDetail}
        onChange={onSlideChange}
        onOpenDetail={onOpenDetail}
      />
    </motion.main>
  )
}
