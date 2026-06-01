const vercelHost =
  process.env.VERCEL_ENV === 'production'
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;

export const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : vercelHost
      ? `https://${vercelHost}`
      : '';
