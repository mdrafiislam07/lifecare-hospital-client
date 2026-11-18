import Link from 'next/link';
import Icon from './Icons';
import { getSettings } from '@/lib/content';

const DEFAULT_MAP = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.3460782261973!2d89.94186627461663!3d24.920277642863056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fd7f0057dd32c3%3A0x5a43e054f68d93a3!2sLife%20Care%20Hospital%20Jamalpur!5e0!3m2!1sen!2sbd!4v1794937381004!5m2!1sen!2sbd';

// Server component: admin > Settings theke contact, social, about text, map sob ashe
export default async function Footer() {
  const site = await getSettings();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h4>About Us</h4>
          <p>{site.footerAbout}</p>
        </div>
        <div>
          <h4>Useful Links</h4>
          <ul className="flinks">
            <li><Link href="/doctors">Doctor</Link></li>
            <li><Link href="/services/emergency">Emergency</Link></li>
            <li><Link href="/admission/privacy">Privacy</Link></li>
            <li><Link href="/admission/admission-time">Admission time</Link></li>
            <li><Link href="/news">Media Center</Link></li>
            <li><Link href="/contact">Career</Link></li>
          </ul>
        </div>
        <div className="map-box">
          <iframe
            title={`${site.siteName} map`}
            src={site.mapEmbed || DEFAULT_MAP}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div>
          <h4>Get In Touch</h4>
          <ul className="contact-list">
            {site.address && <li><Icon name="pin" size={18} /><span>{site.address}</span></li>}
            {site.email && <li><Icon name="mail" size={18} /><a href={`mailto:${site.email}`}>{site.email}</a></li>}
            {site.contacts.map((c) => <li key={c}><Icon name="phone" size={18} /><a href={`tel:${c}`}>Contact No - {c}</a></li>)}
            {site.hotline && <li><Icon name="headset" size={18} /><a href={`tel:${site.hotline}`}>HelpLine- {site.hotline}</a></li>}
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <div className="socials">
          {site.facebook && <a href={site.facebook} aria-label="Facebook" target="_blank" rel="noreferrer"><Icon name="fb" size={18} /></a>}
          {site.linkedin && <a href={site.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer"><Icon name="in" size={18} /></a>}
          {site.youtube && <a href={site.youtube} aria-label="YouTube" target="_blank" rel="noreferrer"><Icon name="yt" size={18} /></a>}
        </div>
        <p>© {new Date().getFullYear()} {site.siteName} Limited. All Rights Reserved.</p>
      </div>
    </footer>
  );
}