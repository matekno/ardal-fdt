import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    // Incluir el engine de Prisma (path no estándar) en el bundle de Vercel
    "/api/**": ["./src/generated/prisma/**/*"],
  },
};

export default nextConfig;
