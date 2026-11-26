import { Suspense } from 'react';
import DoctorsClient from './DoctorsClient';
import { PageHero } from '@/components/Ui';

export const metadata = { title: 'Doctors List' };
export default function Page() {
  return (
    <>
      <PageHero title="Find Your Doctor" text="Search by doctor name or department, view the profile and book your appointment with our specialists." />
      <Suspense fallback={<p className="container section">Loading…</p>}><DoctorsClient /></Suspense>
    </>
  );
}