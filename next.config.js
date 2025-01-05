/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        remotePatterns: [
            // {
            //   protocol: "https",
            //   hostname: "images.unsplash.com",
            //   port: "",
            //   pathname: "/**"
            // },
        ]
    },
    experimental: {
        typedRoutes: true,
        serverActions: {
            // allowedOrigins: ["https://example.com"]
        }
    }
}

module.exports = nextConfig
