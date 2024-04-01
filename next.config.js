/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ["localhost:3000", "34.64.241.212"],
        }
    },
    logging: {
        fetches: {
            fullUrl: true,
        }
    }
};

module.exports = nextConfig;
