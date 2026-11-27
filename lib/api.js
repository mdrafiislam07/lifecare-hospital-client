import { API_URL, SERVER_API } from './config';

// Client-side fetch helper
export async function api(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(API_URL + path, {
      method,
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error('Server e connect kora jachchhe na. Internet check kore abar chesta korun.');
  }
  let data = {};
  try { data = await res.json(); } catch { /* empty */ }
  if (res.status === 429) throw new Error('Onek beshi request pathano hoyeche. 1 minute pore abar chesta korun.');
  if (!res.ok) throw new Error(data.message || 'Kothao ekta somossa hoyeche');
  return data;
}

// Server-side fetch (cached 60s => hajar user dileo backend e chap pore na)
// tag 'site': admin save korle revalidate API ei tag fresh kore dey
export async function serverGet(path, fallback) {
  try {
    const res = await fetch(SERVER_API + path, { next: { revalidate: 60, tags: ['site'] } });
    if (!res.ok) throw new Error('bad');
    return await res.json();
  } catch {
    return fallback;
  }
}

// Admin image upload -> backend -> Cloudinary. Returns { url, publicId }
export async function uploadImage(file, folder, token) {
  const fd = new FormData();
  fd.append('image', file);
  let res;
  try {
    res = await fetch(`${API_URL}/upload/image?folder=${folder}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
  } catch { throw new Error('Upload e connect kora jachchhe na'); }
  let data = {};
  try { data = await res.json(); } catch { /* empty */ }
  if (!res.ok) throw new Error(data.message || 'Upload fail hoyeche');
  return data;
}