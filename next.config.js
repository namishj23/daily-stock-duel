/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Keep existing Tailwind/CSS setup working
    experimental: {
        // Enable server actions for form submissions
        serverActions: {
            allowedOrigins: ['localhost:3000'],
        },
    },
}

module.exports = nextConfig
