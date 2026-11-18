import { Suspense } from 'react';
import BookingForm from '@/components/BookingForm';
import { PageHero } from '@/components/Ui';

export const metadata = { title: 'Doctor Appointment' };
export default function Page() {
  return (
    <>
      <PageHero title="Doctor Appointment" text="Book an online appointment by selecting your preferred doctor, date, and time slot. Contact: 01806-176500" />
      <section className="container section narrow"><Suspense fallback={<p>Loading…</p>}><BookingForm /></Suspense></section>
    </>
  );
}
