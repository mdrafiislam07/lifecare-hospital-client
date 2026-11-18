// Server-side helpers: settings, menu, CMS pages. Next.js ISR cache (60s, tag 'site') -- admin save korle on-demand revalidate hoy.
// API bondho thakle (network error / 5xx) lib/defaults.json (= data.js theke banano) fallback; API 404 dile fallback hoy na.
import defaults from './defaults.json';

const BASE = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

async function get(path) {
  try {
    const r = await fetch(`${BASE}${path}`, { next: { revalidate: 60, tags: ['site'] } });
    if (r.status >= 500) return null;
    return { status: r.status, data: r.ok ? await r.json() : null };
  } catch { return null; }
}

export const telOf = (n) => String(n || '').replace(/[^\d+]/g, '');

export async function getSettings() {
  const r = await get('/settings');
  const d = defaults.settings, s = r?.data?.item || {};
  return {
    ...d, ...s,
    stats: { ...d.stats, ...s.stats },
    aboutBadge: { ...d.aboutBadge, ...s.aboutBadge },
    quickTiles: s.quickTiles?.length ? s.quickTiles : d.quickTiles,
    contacts: s.contacts || d.contacts,
    brandChips: s.brandChips || d.brandChips,
    emergencyTel: telOf(s.emergency ?? d.emergency)
  };
}

const fallbackMenu = () => defaults.menu.map((m) => {
  const auto = m.group ? defaults.pages.filter((p) => p.group === m.group).map((p) => ({ label: p.title, href: `/${p.group}/${p.slug}` })) : [];
  return { label: m.label, group: m.group, href: auto[0]?.href || m.href, children: [...auto, ...m.children] };
});

export async function getMenu() {
  const r = await get('/menu');
  return r?.data?.items || fallbackMenu();
}

// returns { item, siblings } ba null (not found)
export async function getPage(group, slug) {
  const r = await get(`/pages/${encodeURIComponent(group)}/${encodeURIComponent(slug)}`);
  if (r) return r.data ? { item: r.data.item, siblings: r.data.siblings } : null;
  const item = defaults.pages.find((p) => p.group === group && p.slug === slug);
  if (!item) return null;
  return { item, siblings: defaults.pages.filter((p) => p.group === group) };
}
