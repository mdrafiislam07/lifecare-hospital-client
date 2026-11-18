'use client';
import { useState } from 'react';

// "Lite" YouTube: prothome shudhu thumbnail, click korle tobei player load hoy => page fast, bandwidth kom
export default function YouTube({ id, title = 'Video' }) {
  const [play, setPlay] = useState(false);
  if (!id) return null;
  return (
    <div className="yt">
      {play ? (
        <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title}
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <button className="yt-thumb" onClick={() => setPlay(true)} aria-label={`Play: ${title}`}
          style={{ backgroundImage: `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` }}>
          <span className="yt-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30" fill="#fff"><path d="M8 5v14l11-7z" /></svg></span>
        </button>
      )}
    </div>
  );
}
