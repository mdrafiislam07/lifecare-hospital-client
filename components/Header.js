'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Icon, { Logo } from './Icons';
import { NAV, SITE } from '@/lib/data';
import { useAuth } from './AuthProvider';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState(null);
  const path = usePathname();
  const topRef = useRef(null);
  const { user, logout } = useAuth() || {};

  useEffect(() => { setOpen(false); setSub(null); }, [path]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (topRef.current) document.documentElement.style.setProperty('--hh', topRef.current.offsetHeight + 'px');
  }, [open]);

  return (
    <header className="site-header">
      <div className="topbar" ref={topRef}>
        <div className="container topbar-in">
          <Link href="/" className="brand" aria-label="Life Care Hospital home"><Logo /></Link>
          <div className="top-info">
            
            <a href={`tel:${SITE.emergencyTel}`}><b>Emergency:</b> {SITE.emergency}</a>
            <a href={SITE.facebook} target="_blank" rel="noreferrer"><Icon name="fb" size={16} /> Facebook</a>
            <Link href="/contact">Contact Us</Link>
          </div>
          <div className="top-actions">
            {user ? (
              <>
                <Link className="link-btn" href={user.role === 'admin' ? '/admin' : '/dashboard'}>
  <Icon name="user" size={16} /> <span className="u-name">{user.name.split(' ')[0]}</span>
</Link>
                <button className="link-btn" onClick={logout}>Logout</button>
              </>





            ) : <Link className="link-btn" href="/login"><Icon name="user" size={16} /> Login</Link>}
            <Link href="/appointment" className="btn btn-primary btn-appt">Doctor Appointment</Link>
          </div>
          <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <Icon name={open ? 'x' : 'menu'} size={26} />
          </button>
        </div>
      </div>

      <nav className={`mainnav ${open ? 'open' : ''}`} aria-label="Main">
        <ul className="container nav-list">
          {NAV.map((item) => {
            const hs = [item.href, ...(item.children || []).map((c) => c.href)].map((h) => h.split('?')[0]);
            const active = item.href === '/' ? path === '/' : hs.some((h) => h !== '/' && (path === h || path.startsWith(h.split('/').slice(0, 2).join('/') + '/') || path === h.split('/').slice(0, 2).join('/')));
            return (
              <li key={item.label} className={`nav-item ${active ? 'active' : ''} ${sub === item.label ? 'sub-open' : ''}`}>
                <div className="nav-row">
                  <Link href={item.href}>{item.label}</Link>
                  {item.children && (
                    <button className="chev" aria-label={`${item.label} submenu`} onClick={() => setSub(sub === item.label ? null : item.label)}>
                      <Icon name="down" size={16} />
                    </button>
                  )}
                </div>
                {item.children && (
                  <ul className="dropdown">
                    {item.children.map((c) => <li key={c.label}><Link href={c.href}>{c.label}</Link></li>)}
                  </ul>
                )}
              </li>
            );
          })}
          <li className="nav-mobile-extra">
            <a className="btn btn-primary" href={`tel:${SITE.hotline}`}>Call {SITE.hotline}</a>
            <Link className="btn btn-light" href="/appointment">Doctor Appointment</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
