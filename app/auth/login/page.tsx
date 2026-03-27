'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🔐 Attempting login with:', { email, password: '***' })
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    console.log('✅ Supabase response:', { data, error: error?.message })

    if (error) {
      console.error('❌ Login error:', error)
      setError(error.message)
      setLoading(false)
    } else {
      console.log('✅ Login successful! Redirecting to dashboard...')
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '2.5rem', justifyContent: 'center' }}>
        <div style={{
          width: 40, height: 40,
          background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
          borderRadius: 8, display: 'grid', placeItems: 'center',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900, fontSize: '1.1rem', color: '#0a1628',
        }}>C</div>
        <span style={{ fontWeight: 600, fontSize: '1rem', color: '#f8f6f0' }}>
          CDSC<span style={{ color: '#c9a84c' }}>@SCOE</span>
        </span>
      </Link>

      {/* Card */}
      <div style={{
        background: 'rgba(17,34,64,0.8)',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: 12,
        padding: '2.5rem',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: '#c9a84c', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            // Member Access
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700, color: '#f8f6f0' }}>
            Welcome Back
          </h1>
          <p style={{ color: '#8a9bb5', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            Sign in to access your CDSC dashboard and resources.
          </p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          style={{
            width: '100%', padding: '0.8rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(248,246,240,0.15)',
            borderRadius: 6, color: '#f8f6f0',
            fontSize: '0.88rem', fontWeight: 500,
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            gap: '0.6rem', transition: 'all 0.2s',
            marginBottom: '1.25rem',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(248,246,240,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.15)' }} />
          <span style={{ color: '#8a9bb5', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace" }}>or email</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.15)' }} />
        </div>

        {/* Email Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#8a9bb5', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="input-field"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#8a9bb5', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-field"
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 6, padding: '0.7rem 1rem',
              color: '#fca5a5', fontSize: '0.82rem',
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.25rem' }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#8a9bb5', fontSize: '0.82rem' }}>
          Not a member yet?{' '}
          <Link href="/auth/signup" style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 500 }}>
            Apply to Join
          </Link>
        </p>
      </div>
    </div>
  )
}
