import Image from 'next/image'

import { CareersType } from '@/types/careers'

async function getCareer() {
  const response = await fetch(process.env.URL + '/api/careers')
  const result = await response.json()
  return result
}

export default async function Career() {
  const career = await getCareer()

  return (
    <main className="container relative mx-auto flex h-[calc(100vh-80px)] flex-col gap-4 overflow-auto p-5 sm:h-[calc(100vh-80px-64px)] md:flex-row md:overflow-hidden">
      <section className="w-full md:w-2/5">
        <h1 className="title-font mb-4 text-4xl xl:text-5xl">
          <strong>
            <span className="text-slate-500">My </span> Career
          </strong>
        </h1>
        <p className="leading-relaxed">
          Explore my tech journey, from freelancing to roles in esteemed companies. Dive into my
          projects, from websites to testing, and see how each shaped my expertise. Join me on this
          journey of innovation and growth in the world of tech!
        </p>
      </section>
      <section className="w-full md:w-3/5 md:overflow-auto [&::-webkit-scrollbar]:w-0">
        {career?.data?.map((item: CareersType) => {
          return (
            <div key={item?.title} className="relative mx-auto flex items-center py-5">
              <div className="absolute inset-0 flex h-full w-10 items-center justify-center">
                <div className="pointer-events-none h-full w-1 bg-slate-400 dark:bg-slate-600"></div>
              </div>
              <figure className="title-font relative z-10 mt-10 inline-flex size-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-slate-400 bg-slate-200 text-sm font-medium dark:border-slate-600 sm:mt-0">
                <Image width={28} height={28} src={item?.image} alt={item?.title} />
              </figure>
              <span className="hidden h-1 w-14 bg-slate-400 dark:bg-slate-600 min-[640px]:inline-block"></span>
              <div className="flex flex-col items-start rounded-md pl-4 sm:flex-row sm:items-center min-[640px]:pl-0">
                <div className="mt-6 flex-grow bg-slate-400 p-4 shadow shadow-slate-950/50 dark:bg-slate-600 dark:shadow-white/50 sm:mt-0">
                  <h2 className="title-font text-xl">
                    <strong>{item?.title}</strong>
                  </h2>
                  <p className="mb-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {item?.date}
                  </p>
                  <p className="leading-relaxed">{item?.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}
