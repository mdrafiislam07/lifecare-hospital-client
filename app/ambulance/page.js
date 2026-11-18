import SimpleForm from '@/components/SimpleForm';
import { PageHero } from '@/components/Ui';
import { SITE } from '@/lib/data';

export const metadata = { title: 'Book An Ambulance' };
export default function Page() {
  return (
    <>
      <PageHero title="Book An Ambulance" text={`Joruri obosthay ekhoni call korun: ${SITE.emergency}`} />
      <section className="container section narrow">
        <a className="btn btn-danger btn-lg btn-block" href={`tel:${SITE.emergencyTel}`}>Call Emergency {SITE.emergency}</a>
        <p className="center muted">Fill out the form below and we will get back to you shortly.</p>
        <SimpleForm kind="ambulance" />
      </section>
    </>
  );
}
