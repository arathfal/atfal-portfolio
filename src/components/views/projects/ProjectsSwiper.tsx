import Image from 'next/image'
import SwiperType from 'swiper'
import 'swiper/css'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import Button from '@/components/ui/button'
import type { PortfoliosType } from '@/types/portfolios'

import './styles.css'

type Props = {
  slides: PortfoliosType[]
  detail: PortfoliosType | null
  onChange?: (index: number) => void
  onOpenDetail?: VoidFunction
}

export default function ProjectsSwiper({ onChange, slides, detail, onOpenDetail }: Props) {
  const pagination = {
    clickable: true,
    el: '.swiper-pagination',
    renderBullet: function (index: number, className: string) {
      return `<span class="!h-1 !w-6 !rounded-none !bg-slate-950 !text-[1px] !text-transparent sm:!w-8 dark:!bg-white ${className}">${index}</span>`
    }
  }

  const onChangeActive = (index: number) => {
    if (index >= 0 && index < slides?.length + 1) {
      onChange?.(index)
    }
  }

  const onSlideChange = (swiper: SwiperType) => {
    onChangeActive(swiper?.activeIndex + 1)
  }

  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      modules={[Pagination]}
      pagination={pagination}
      className="projects-swiper order-1 md:order-2"
      speed={1000}
      onSlideChange={onSlideChange}
      breakpoints={{
        768: {
          slidesPerView: 'auto'
        }
      }}
    >
      {slides?.map((slide, index) => {
        return (
          <SwiperSlide key={slide?.title} virtualIndex={index}>
            <div className="relative">
              <figure className="w-full shadow shadow-slate-950/20 dark:border-0 dark:shadow-white/20 md:h-[380px] md:w-auto">
                <Image
                  src={slide?.image}
                  className="h-full w-full object-cover"
                  alt={slide?.title}
                  height={0}
                  width={0}
                  sizes="100vw"
                  priority
                />
              </figure>
              <div className="relative mt-4 flex min-h-48 flex-col items-start justify-between gap-4 min-[500px]:min-h-44 md:hidden">
                <h1 className="text-3xl xl:text-4xl">
                  <strong>{detail?.title}</strong>
                </h1>
                <p className="mb-auto leading-relaxed">{detail?.description}</p>
                <Button
                  className="text-nowrap rounded-none border-b-2 border-slate-900 px-4 text-lg dark:border-white"
                  onClick={onOpenDetail}
                >
                  <strong>View Detail</strong>
                </Button>
              </div>
            </div>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}
