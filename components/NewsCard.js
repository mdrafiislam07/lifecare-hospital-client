import Link from 'next/link';
import Icon from './Icons';
import YouTube from './YouTube';
import { cld } from '@/lib/img';

export default function NewsCard({ n, more = false }) {
  return (
    <article className="news-card">
      {n.youtubeId ? <div className="news-media"><YouTube id={n.youtubeId} title={n.title} /></div>
        : n.image ? <img className="news-photo" src={cld(n.image, 'w_700,h_400,c_fill')} alt={n.title} loading="lazy" width="700" height="400" />
        : <div className="news-img" aria-hidden="true"><Icon name="clipboard" size={42} /></div>}
      <h3 className="bn">{n.title}</h3>
      <p className="news-by">{n.author || 'Apollo Hospital Limited'}</p>
      <p className="bn">{n.excerpt}</p>
      {more && <Link href="/news" className="btn btn-soft">Read More</Link>}
    </article>
  );
}
