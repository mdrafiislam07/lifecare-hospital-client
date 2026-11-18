'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import YouTube from '@/components/YouTube';
import Icon from '@/components/Icons';
import { cld } from '@/lib/img';

export default function GalleryClient({ photos, videos }) {
  const sp = useSearchParams();
  const [tab, setTab] = useState(sp.get('tab') === 'videos' ? 'videos' : 'photos');
  const [big, setBig] = useState(null);
  return (
    <section className="container section">
      <div className="chips" role="tablist">
        <button role="tab" aria-selected={tab === 'photos'} className={`chip-btn ${tab === 'photos' ? 'on' : ''}`} onClick={() => setTab('photos')}>Photos ({photos.length})</button>
        <button role="tab" aria-selected={tab === 'videos'} className={`chip-btn ${tab === 'videos' ? 'on' : ''}`} onClick={() => setTab('videos')}>Videos ({videos.length})</button>
      </div>

      {tab === 'photos' && (photos.length === 0 ? <p className="muted">Ekhono kono chobi upload kora hoyni.</p> : (
        <div className="gal-grid">
          {photos.map((p) => (
            <button key={p._id} className="gal-item" onClick={() => setBig(p)} aria-label={`Open: ${p.title}`}>
              <img src={cld(p.url, 'w_500,h_400,c_fill')} alt={p.title} loading="lazy" width="500" height="400" />
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      ))}

      {tab === 'videos' && (videos.length === 0 ? <p className="muted">Ekhono kono video add kora hoyni.</p> : (
        <div className="vid-grid">
          {videos.map((v) => (
            <article key={v._id}><YouTube id={v.youtubeId} title={v.title} /><h3>{v.title}</h3>{v.description && <p className="muted">{v.description}</p>}</article>
          ))}
        </div>
      ))}

      {big && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={big.title} onClick={() => setBig(null)}>
          <button className="lb-close" aria-label="Close"><Icon name="x" size={28} /></button>
          <img src={cld(big.url, 1600)} alt={big.title} />
          <p>{big.title}</p>
        </div>
      )}
    </section>
  );
}
