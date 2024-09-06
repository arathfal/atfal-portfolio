/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  env: {
    URL: process.env.URL,
    API_URL: process.env.API_URL,
    CAREERS_PATH: process.env.CAREERS_PATH,
    PROJECTS_PATH: process.env.PROJECTS_PATH
  }
}

export default nextConfig
