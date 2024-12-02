// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ['@mui/material', '@mui/icons-material', 'mui-color-input'],
    redirects: async () => [
        {
            source: '/',
            destination: '/login',
            permanent: false,
        },
    ],
};

export default nextConfig;