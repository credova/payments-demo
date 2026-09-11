const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(',').map((origin) => origin.trim())
  : ['applepaygisely.publicsquare.com'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins,
};

export default nextConfig;
