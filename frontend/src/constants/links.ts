// Sister-service address. Local dev points at the local ACV; builds point at the deployed site.
// Set VITE_ACV_URL to override either.
export const ACV_URL: string =
  import.meta.env.VITE_ACV_URL ??
  (import.meta.env.DEV ? 'http://localhost:5173' : 'https://ad-creative-validator.vercel.app');
