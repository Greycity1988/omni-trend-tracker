// Sister-service address. Local dev points at local ports; builds point at deployed sites.
export const ACV_URL: string =
  import.meta.env.VITE_ACV_URL ??
  (import.meta.env.DEV ? 'http://localhost:5173' : 'https://ad-creative-validator.vercel.app');

export const CAL_URL: string =
  import.meta.env.VITE_CAL_URL ??
  (import.meta.env.DEV ? 'http://localhost:5175' : 'https://greycity1988.github.io/competitive-ad-lens/');

export const BEP_URL: string =
  import.meta.env.VITE_BEP_URL ??
  (import.meta.env.DEV ? 'http://localhost:5176' : 'https://greycity1988.github.io/bep-master/');

export const CFR_URL: string =
  import.meta.env.VITE_CFR_URL ??
  (import.meta.env.DEV ? 'http://localhost:5177' : 'http://localhost:5177');

export const OTT_URL: string =
  import.meta.env.VITE_OTT_URL ??
  (import.meta.env.DEV ? 'http://localhost:5174' : 'https://greycity1988.github.io/omni-trend-tracker/');

export const DEV_EMAIL = 'contact@example.com';
export const KO_FI_URL = 'https://ko-fi.com/greycity1988';
export const BUY_ME_A_COFFEE_URL = KO_FI_URL;
