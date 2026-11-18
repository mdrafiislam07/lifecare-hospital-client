import { Suspense } from 'react';
import DoctorsClient from './DoctorsClient';
import { PageHero } from '@/components/Ui';

export const metadata = { title: 'Doctors List' };
export default function Page() {
  return (
    <>
      <PageHero title="Find Your Doctor" text="Department ba doctor er nam diye khujun, tarpor shoja appointment nin." />
      <Suspense fallback={<p className="container section">Loading…</p>}><DoctorsClient /></Suspense>
    </>
  );
}
