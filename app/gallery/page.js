import { Suspense } from 'react';
import { serverGet } from '@/lib/api';
import { PageHero } from '@/components/Ui';
import GalleryClient from './GalleryClient';

export const metadata = { title: 'Photo & Video Gallery' };
export const revalidate = 60;

export default async function Page() {
  const [photos, videos] = await Promise.all([
    serverGet('/media?type=image&limit=60', { items: [] }),
    serverGet('/media?type=video&limit=60', { items: [] })
  ]);
  return (
    <>
      <PageHero title="Media Gallery" text="Hospital er chobi o video." />
      <Suspense fallback={null}><GalleryClient photos={photos.items} videos={videos.items} /></Suspense>
    </>
  );
}
