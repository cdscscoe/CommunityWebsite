'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!email || !password) { setError('Please enter your email and password'); setLoading(false); return }
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) { setError(signInError.message); setLoading(false); return }
      setTimeout(() => { window.location.href = '/dashboard' }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setGoogleLoading(false) }
  }

  return (
    <div>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '.6rem', textDecoration: 'none', marginBottom: '2rem', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.75rem', color: 'rgba(148,163,196,.6)', letterSpacing: '.08em' }}>← back to</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.9rem', color: '#F1F5FF', letterSpacing: '.04em' }}>
          CDSC<span style={{ color: '#FBBF24' }}>@SCOE</span>
        </span>
      </Link>

      {/* Card */}
      <div style={{ background: 'rgba(22,29,48,0.75)', backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '2.5rem', boxShadow: '0 8px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04) inset', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,.6), rgba(251,191,36,.4), transparent)' }} />

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: '.3rem .85rem', marginBottom: '1rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px rgba(74,222,128,.7)', display: 'inline-block' }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.68rem', color: 'rgba(148,163,196,.8)', letterSpacing: '.08em' }}>MEMBER ACCESS</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.75rem', color: '#F1F5FF', letterSpacing: '-.02em', lineHeight: 1.1, marginBottom: '.4rem' }}>
            Welcome back.
          </h1>
          <p style={{ color: 'rgba(148,163,196,.7)', fontSize: '.88rem', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
            Sign in to access your CDSC dashboard and all resources.
          </p>
        </div>

        {/* Google */}
        <button onClick={handleGoogleLogin} disabled={googleLoading} className="auth-btn-google" style={{ marginBottom: '1.25rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        <div className="auth-divider" style={{ marginBottom: '1.25rem' }}>or email</div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
          <div>
            <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '.65rem', color: 'rgba(148,163,196,.6)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.5rem' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="auth-input" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: '.65rem', color: 'rgba(148,163,196,.6)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Password</label>
              <a href="#" style={{ fontFamily: "'DM Mono', monospace", fontSize: '.65rem', color: 'rgba(148,163,196,.5)', textDecoration: 'none' }}>forgot?</a>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="auth-input" />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={loading} className="auth-btn-main" style={{ marginTop: '.25rem' }}>
            {loading ? 'Signing in...' : <>Sign In <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', color: 'rgba(148,163,196,.55)', fontSize: '.82rem', fontFamily: "'DM Sans', sans-serif" }}>
          Not a member?{' '}
          <Link href="/auth/signup" className="auth-link">Apply to join</Link>
        </p>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontFamily: "'DM Mono', monospace", fontSize: '.62rem', color: 'rgba(148,163,196,.3)', letterSpacing: '.06em' }}>
        CDSC@SCOE · Computer Department · SCOE, Pune
      </p>
    </div>
  )
}