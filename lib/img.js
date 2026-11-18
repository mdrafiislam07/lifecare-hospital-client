// Cloudinary URL e transformation boshay (resize + auto quality/format) => chhoto, fast image
// cld(url, 'w_400,h_400,c_fill,g_face') ba shudhu cld(url, 600)
export function cld(url, t = 800) {
  if (!url || !url.includes('/image/upload/')) return url;
  const tr = typeof t === 'number' ? `w_${t},c_limit` : t;
  return url.replace('/image/upload/', `/image/upload/${tr},q_auto,f_auto/`);
}
