import { getSettings, getMenu } from '@/lib/content';
import { NAV } from '@/lib/data';
import HeaderClient from './HeaderClient';

// MenuItem model onujayi: { label, href, group, children:[{label,href}], visible }
function normalizeMenu(raw) {
  const list = Array.isArray(raw) ? raw : raw?.items || [];
  const out = list
    .filter((m) => m && m.visible !== false && m.label)
    .map((m) => {
      const children = (m.children || []).filter((c) => c?.label && c?.href).map((c) => ({ label: c.label, href: c.href }));
      return { label: m.label, href: m.href || children[0]?.href || '/', children: children.length ? children : undefined };
    });
  return out.length ? out : NAV;   // menu khali hole age-r static menu
}

export default async function Header() {
  const [s, menu] = await Promise.all([getSettings(), getMenu().catch(() => null)]);
  const site = {
    siteName: s.siteName || '',
    logo: s.logo || '',
    emergency: s.emergency || '',
    emergencyTel: s.emergencyTel || '',
    hotline: s.hotline || '',
    facebook: s.facebook || ''
  };
  return <HeaderClient site={site} nav={normalizeMenu(menu)} />;
}