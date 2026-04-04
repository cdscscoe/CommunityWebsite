'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isHome = pathname === '/'

  return (
    <>
      <style suppressHydrationWarning>{`
        #cdsc-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          height: 64px; padding: 0 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
          transition: background .3s, border-color .3s, box-shadow .3s;
          border-bottom: 1px solid transparent;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        #cdsc-nav.scrolled {
          background: rgba(11,15,25,.95);
          backdrop-filter: blur(24px);
          border-color: rgba(255,255,255,.07);
          box-shadow: 0 4px 32px rgba(0,0,0,.3);
        }

        .nav-logo {
          display: flex; align-items: center; gap: .5rem;
          text-decoration: none; z-index: 50;
        }
        .nav-logo-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #FBBF24;
        }
        .nav-logo-text {
          font-family: 'DM Mono', monospace; font-size: .92rem;
          font-weight: 500; color: #F1F5FF; letter-spacing: .04em;
        }
        .nav-logo-text span { color: #FBBF24; }

        /* Desktop links */
        .nav-links {
          display: flex; align-items: center; gap: .2rem;
        }
        .nav-link {
          font-size: .82rem; font-weight: 500; color: #94A3C4;
          text-decoration: none; padding: .4rem .75rem; border-radius: 6px;
          transition: color .15s, background .15s;
          letter-spacing: .01em;
        }
        .nav-link:hover { color: #F1F5FF; background: rgba(255,255,255,.06); }

        /* Right side */
        .nav-right { display: flex; align-items: center; gap: .75rem; }

        .nav-signin {
          font-size: .82rem; color: #94A3C4; text-decoration: none;
          transition: color .15s;
        }
        .nav-signin:hover { color: #F1F5FF; }

        .nav-cta {
          display: inline-flex; align-items: center; gap: .4rem;
          background: linear-gradient(90deg, #F97316, #FBBF24);
          color: #0B0F19; font-weight: 700; font-size: .82rem;
          padding: .52rem 1.15rem; border-radius: 20px;
          text-decoration: none; min-height: 36px;
          box-shadow: 0 2px 16px rgba(249,115,22,.3);
          transition: opacity .15s, transform .1s, box-shadow .2s;
        }
        .nav-cta:hover {
          opacity: .9; transform: translateY(-1px);
          box-shadow: 0 4px 24px rgba(249,115,22,.45);
        }

        .nav-dashboard {
          display: inline-flex; align-items: center; gap: .4rem;
          border: 1px solid rgba(255,255,255,.12);
          color: #F1F5FF; font-weight: 600; font-size: .82rem;
          padding: .52rem 1.15rem; border-radius: 20px;
          text-decoration: none; min-height: 36px;
          background: rgba(255,255,255,.06);
          transition: background .15s, border-color .15s;
        }
        .nav-dashboard:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.2); }

        .nav-signout {
          font-size: .78rem; color: #94A3C4; background: none;
          border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: color .15s; padding: .3rem .2rem;
        }
        .nav-signout:hover { color: #F87171; }

        /* Hamburger */
        .nav-hamburger {
          display: none; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 9px;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
          cursor: pointer; color: #94A3C4; z-index: 50;
        }
        .nav-hamburger:hover { background: rgba(255,255,255,.1); }

        /* Mobile full-screen menu */
        #mobile-menu {
          position: fixed; inset: 0; z-index: 190;
          background: rgba(11,15,25,.98); backdrop-filter: blur(20px);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 1.5rem;
          transform: translateY(-100%);
          transition: transform .35s cubic-bezier(.16,1,.3,1);
        }
        #mobile-menu.open { transform: translateY(0); }

        .mob-link {
          font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800;
          color: #94A3C4; text-decoration: none; transition: color .15s;
        }
        .mob-link:hover { color: #F1F5FF; }

        .mob-cta {
          display: inline-flex; align-items: center; gap: .5rem;
          background: linear-gradient(90deg, #F97316, #FBBF24);
          color: #0B0F19; font-weight: 700; font-size: .95rem;
          padding: .9rem 2rem; border-radius: 28px; text-decoration: none;
          margin-top: .5rem; box-shadow: 0 4px 24px rgba(249,115,22,.35);
        }

        .mob-dashboard {
          display: inline-flex; align-items: center; gap: .5rem;
          border: 1px solid rgba(255,255,255,.14);
          color: #F1F5FF; font-weight: 600; font-size: .95rem;
          padding: .9rem 2rem; border-radius: 28px; text-decoration: none;
          background: rgba(255,255,255,.07); margin-top: .5rem;
        }

        .mob-signout {
          font-size: .85rem; color: #F87171; background: none; border: none;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
        }

        @media (max-width: 820px) {
          .nav-links  { display: none !important; }
          .nav-signin { display: none !important; }
          .nav-cta    { display: none !important; }
          .nav-dashboard { display: none !important; }
          .nav-signout   { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>

      {/* Mobile full-screen menu */}
      <div id="mobile-menu" className={menuOpen ? 'open' : ''}>
        {isHome ? (
          <>
            <a href="#what"      className="mob-link" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#domains"   className="mob-link" onClick={() => setMenuOpen(false)}>Domains</a>
            <a href="#team"      className="mob-link" onClick={() => setMenuOpen(false)}>Team</a>
            <a href="#timeline"  className="mob-link" onClick={() => setMenuOpen(false)}>Timeline</a>
            <a href="#resources" className="mob-link" onClick={() => setMenuOpen(false)}>Resources</a>
          </>
        ) : (
          <>
            <Link href="/#what"      className="mob-link" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/#domains"   className="mob-link" onClick={() => setMenuOpen(false)}>Domains</Link>
            <Link href="/#resources" className="mob-link" onClick={() => setMenuOpen(false)}>Resources</Link>
          </>
        )}
        {user ? (
          <>
            <Link href="/dashboard" className="mob-dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <button className="mob-signout" onClick={() => { handleSignOut(); setMenuOpen(false) }}>Sign Out</button>
          </>
        ) : (
          <>
            <Link href="/auth/login"  className="mob-link" style={{fontSize:'1.2rem'}} onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link href="/auth/signup" className="mob-cta" onClick={() => setMenuOpen(false)}>Apply Free →</Link>
          </>
        )}
      </div>

      {/* Main nav bar */}
      <nav id="cdsc-nav" className={scrolled ? 'scrolled' : ''}>
        {/* Logo */}
        <Link href="/" className="nav-logo">
          <span className="nav-logo-dot" />
          <span className="nav-logo-text">CDSC<span>@SCOE</span></span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links">
          {isHome ? (
            <>
              <a href="#what"      className="nav-link">About</a>
              <a href="#domains"   className="nav-link">Domains</a>
              <a href="#team"      className="nav-link">Team</a>
              <a href="#timeline"  className="nav-link">Timeline</a>
              <a href="#resources" className="nav-link">Resources</a>
            </>
          ) : (
            <>
              <Link href="/#what"      className="nav-link">About</Link>
              <Link href="/#domains"   className="nav-link">Domains</Link>
              <Link href="/#resources" className="nav-link">Resources</Link>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="nav-right">
          {user ? (
            <>
              <Link href="/dashboard" className="nav-dashboard">Dashboard</Link>
              <button className="nav-signout" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login"  className="nav-signin">Sign In</Link>
              <Link href="/auth/signup" className="nav-cta">Apply Free →</Link>
            </>
          )}

          {/* Hamburger */}
          <button className="nav-hamburger" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>
        </div>
      </nav>
    </>
  )
}