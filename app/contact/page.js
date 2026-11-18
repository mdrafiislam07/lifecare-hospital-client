import SimpleForm from '@/components/SimpleForm';
import { PageHero } from '@/components/Ui';
import Icon from '@/components/Icons';
import { SITE } from '@/lib/data';

export const metadata = { title: 'Contact' };
export default function Page() {
  return (
    <>
      <PageHero title="Contact Us" text="Proshno, poramorsho ba career shomporke amader message pathan." />
      <section className="container section contact-layout">
        <ul className="card contact-info">
          <li><Icon name="pin" /> <span>{SITE.address}</span></li>
          <li><Icon name="mail" /> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          <li><Icon name="headset" /> <a href={`tel:${SITE.hotline}`}>Hotline {SITE.hotline}</a></li>
          {SITE.contacts.map((c) => <li key={c}><Icon name="phone" /> <a href={`tel:${c}`}>{c}</a></li>)}
        </ul>
        <SimpleForm kind="contact" />
      </section>
      <section className="container section narrow">
        <h2 className="center">share your experience</h2>
        <SimpleForm kind="feedback" />
      </section>
    </>
  );
}
