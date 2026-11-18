import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

// Backend admin change er por eta call kore. Header: x-revalidate-secret
export async function POST(req) {
  const secret = process.env.REVALIDATE_SECRET || '';
  const given = req.headers.get('x-revalidate-secret') || '';
  const a = Buffer.from(secret), b = Buffer.from(given);
  if (!secret || a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ ok: false }, { status: 401 });
  revalidateTag('site');
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, at: Date.now() });
}
