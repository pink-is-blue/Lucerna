/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS === 'true'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  ...(isGithubPages
    ? {
        output: 'export',
        images: {
          unoptimized: true,
        },
        basePath: repoName ? `/${repoName}` : '',
        assetPrefix: repoName ? `/${repoName}/` : undefined,
      }
    : {}),
}

module.exports = nextConfig
