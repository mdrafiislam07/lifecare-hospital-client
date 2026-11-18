export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
// Server component fetch (SSR/ISR) -- Docker e INTERNAL_API_URL use hoy
export const SERVER_API = process.env.INTERNAL_API_URL || API_URL;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
