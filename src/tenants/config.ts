export type TenantId = 'default' | 'tls' | 'spm' | 'sva';

export const HOST_TO_TENANT: Record<string, TenantId> = {
  'agyemanenterprises.com': 'default',
  'www.agyemanenterprises.com': 'default',
  'tls.agyemanenterprises.com': 'tls',
  'thelearningstudio.co': 'tls',
  'spm.agyemanenterprises.com': 'spm',
  'singleparentmastery.com': 'spm',
  'sva.agyemanenterprises.com': 'sva',
  'scientiavitae.academy': 'sva',
};

export interface TenantConfig {
  id: TenantId;
  name: string;
  theme: { primary: string; secondary: string; logo: string };
  seoBaseUrl: string;
  features: { useSharedCatalog: boolean; upsellToTLS?: boolean };
}

export const TENANTS: Record<TenantId, TenantConfig> = {
  default: { id: 'default', name: 'Agyeman Enterprises', theme: { primary: '#0e7490', secondary: '#134e4a', logo: '/logos/agyeman.svg' }, seoBaseUrl: 'https://agyemanenterprises.com', features: { useSharedCatalog: false } },
  tls: { id: 'tls', name: 'The Learning Studio', theme: { primary: '#1d4ed8', secondary: '#1e40af', logo: '/logos/tls.svg' }, seoBaseUrl: 'https://thelearningstudio.co', features: { useSharedCatalog: true } },
  spm: { id: 'spm', name: 'Single Parent Mastery', theme: { primary: '#f59e0b', secondary: '#b45309', logo: '/logos/spm.svg' }, seoBaseUrl: 'https://singleparentmastery.com', features: { useSharedCatalog: true, upsellToTLS: true } },
  sva: { id: 'sva', name: 'Scientia Vitae Academy', theme: { primary: '#10b981', secondary: '#065f46', logo: '/logos/sva.svg' }, seoBaseUrl: 'https://scientiavitae.academy', features: { useSharedCatalog: false } },
};
