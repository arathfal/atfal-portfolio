/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  env: {
    URL: process.env.URL
  }
}

export default nextConfig
