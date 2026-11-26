import crypto from 'crypto';
import { revalidateTag, revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// Backend admin save korle ei route ke call kore. Secret na mille reject.
export async function POST(req) {
  const secret = process.env.REVALIDATE_SECRET || '';
  const given = req.headers.get('x-revalidate-secret') || '';

  const a = Buffer.from(secret);
  const b = Buffer.from(given);
  const same = secret.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!same) return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });

  revalidateTag('site', { expire: 0 });  // sathe sathe expire (Next 16). Next 15 e 2nd arg ignore hoy
  revalidatePath('/', 'layout');         // header, footer shoho shob page
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}