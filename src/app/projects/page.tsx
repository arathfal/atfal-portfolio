import type { Metadata } from 'next'

import Projects from '@/components/views/projects'
import { PortfoliosType } from '@/types/portfolios'
import fetcher from '@/utils/fetcher'

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.URL}/projects`
  }
}

async function getProjects() {
  const response = await fetcher(process.env.PROJECTS_PATH)
  const result = response?.filter((item: PortfoliosType) => !item?.disabled)
  return result
}

export default async function Page() {
  const projects: PortfoliosType[] = await getProjects()
  const projectByIndex: Record<number, PortfoliosType> = projects?.reduce((acc, curr, index) => {
    return {
      ...acc,
      [index + 1]: curr
    }
  }, {})

  return <Projects projects={projects} projectByIndex={projectByIndex} />
}
