'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const DOMAINS = [
  'DSA & Competitive Coding', 'Web Development', 'Machine Learning & AI',
  'Cybersecurity', 'UI/UX Design', 'Cloud & DevOps',
  'Game Development', 'GATE Preparation', 'SQL & Databases',
  'Free Certifications', 'Digital Marketing', 'LinkedIn & Resume',
]
const YEARS = ['First Year (FE)', 'Second Year (SE)', 'Third Year (TE)', 'Final Year (BE)']

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'DM Mono', monospace",
  fontSize: '.65rem', color: 'rgba(148,163,196,.6)',
  letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.5rem',
}

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    fullName: '', year: '', rollNo: '',
    selectedDomains: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const toggleDomain = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDomains: prev.selectedDomains.includes(domain)
        ? prev.selectedDomains.filter(d => d !== domain)
        : [...prev.selectedDomains, domain],
    }))
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setError(''); setStep(2)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.selectedDomains.length === 0) { setError('Pick at least one domain'); return }
    setLoading(true); setError('')
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email, password: formData.password,
        options: {
          data: { full_name: formData.fullName, year: formData.year, roll_no: formData.rollNo, domains: formData.selectedDomains },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (signUpError) { setError(signUpError.message); setLoading(false); return }
      setSuccess(true)
      if (data.session) setTimeout(() => { window.location.href = '/dashboard' }, 1000)
      else setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })
    if (error) { setError(error.message); setGoogleLoading(false) }
  }

  if (success) {
    return (
      <div>
        <div style={{ background: 'rgba(22,29,48,0.75)', backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 20, padding: '3rem 2.5rem', textAlign: 'center', boxShadow: '0 8px 60px rgba(0,0,0,.5)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(74,222,128,.5), transparent)' }} />
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(74,222,128,.12)', border: '1px solid rgba(74,222,128,.3)', display: 'grid', placeItems: 'center', margin: '0 auto 1.25rem' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#F1F5FF', marginBottom: '.5rem', letterSpacing: '-.02em' }}>Check your inbox.</h2>
          <p style={{ color: 'rgba(148,163,196,.7)', fontSize: '.88rem', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
            We sent a verification link to <span style={{ color: '#FBBF24', fontWeight: 600 }}>{formData.email}</span>.<br />Click it to activate your CDSC account.
          </p>
          <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', marginTop: '1.75rem', color: 'rgba(148,163,196,.6)', fontSize: '.82rem', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '.6rem', textDecoration: 'none', marginBottom: '2rem', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.75rem', color: 'rgba(148,163,196,.6)', letterSpacing: '.08em' }}>← back to</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.9rem', color: '#F1F5FF', letterSpacing: '.04em' }}>CDSC<span style={{ color: '#FBBF24' }}>@SCOE</span></span>
      </Link>

      <div style={{ background: 'rgba(22,29,48,0.75)', backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '2.5rem', boxShadow: '0 8px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04) inset', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,.6), rgba(251,191,36,.4), transparent)' }} />

        {/* Step bar */}
        <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1.75rem' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: 2, borderRadius: 2, background: s <= step ? 'linear-gradient(90deg,#6366F1,#FBBF24)' : 'rgba(255,255,255,.07)', transition: 'background .4s' }} />
          ))}
        </div>

        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: '.3rem .85rem', marginBottom: '1rem' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.68rem', color: 'rgba(148,163,196,.8)', letterSpacing: '.08em' }}>STEP {step} OF 2</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.65rem', color: '#F1F5FF', letterSpacing: '-.02em', lineHeight: 1.1, marginBottom: '.4rem' }}>
            {step === 1 ? 'Create your account.' : 'Tell us about yourself.'}
          </h1>
          <p style={{ color: 'rgba(148,163,196,.65)', fontSize: '.86rem', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
            {step === 1 ? "Set up your credentials to get started. It's completely free." : 'Personalise your experience — takes 30 seconds.'}
          </p>
        </div>

        {step === 1 ? (
          <>
            <button onClick={handleGoogleSignup} disabled={googleLoading} className="auth-btn-google" style={{ marginBottom: '1.25rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
            </button>
            <div className="auth-divider" style={{ marginBottom: '1.25rem' }}>or email</div>
            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
              <div><label style={labelStyle}>Email Address</label><input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" required className="auth-input" /></div>
              <div><label style={labelStyle}>Password</label><input type="password" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} placeholder="Min. 6 characters" required className="auth-input" /></div>
              <div><label style={labelStyle}>Confirm Password</label><input type="password" value={formData.confirmPassword} onChange={e => setFormData(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="••••••••" required className="auth-input" /></div>
              {error && <div className="auth-error">{error}</div>}
              <button type="submit" className="auth-btn-main" style={{ marginTop: '.25rem' }}>Continue →</button>
            </form>
          </>
        ) : (
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
            <div><label style={labelStyle}>Full Name</label><input type="text" value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} placeholder="Your full name" required className="auth-input" /></div>
            <div>
              <label style={labelStyle}>Year of Study</label>
              <select value={formData.year} onChange={e => setFormData(p => ({ ...p, year: e.target.value }))} required className="auth-input" style={{ appearance: 'none', cursor: 'pointer' }}>
                <option value="" disabled>Select your year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Roll Number <span style={{ color: 'rgba(148,163,196,.4)', textTransform: 'none', fontSize: '.62rem' }}>(optional)</span></label><input type="text" value={formData.rollNo} onChange={e => setFormData(p => ({ ...p, rollNo: e.target.value }))} placeholder="e.g. 21CE001" className="auth-input" /></div>
            <div>
              <label style={{ ...labelStyle, marginBottom: '.75rem' }}>Domains of Interest <span style={{ color: '#6366F1' }}>*</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                {DOMAINS.map(domain => (
                  <button key={domain} type="button" onClick={() => toggleDomain(domain)} className={`auth-domain-chip${formData.selectedDomains.includes(domain) ? ' active' : ''}`}>{domain}</button>
                ))}
              </div>
              {formData.selectedDomains.length > 0 && <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '.63rem', color: 'rgba(148,163,196,.45)', marginTop: '.5rem' }}>{formData.selectedDomains.length} selected</p>}
            </div>
            {error && <div className="auth-error">{error}</div>}
            <div style={{ display: 'flex', gap: '.65rem', marginTop: '.25rem' }}>
              <button type="button" onClick={() => { setStep(1); setError('') }} className="auth-btn-ghost" style={{ flex: 1 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Back
              </button>
              <button type="submit" disabled={loading} className="auth-btn-main" style={{ flex: 2 }}>{loading ? 'Creating...' : 'Join CDSC →'}</button>
            </div>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '1.75rem', color: 'rgba(148,163,196,.5)', fontSize: '.82rem', fontFamily: "'DM Sans', sans-serif" }}>
          {step === 1 ? <>Already a member? <Link href="/auth/login" className="auth-link">Sign in</Link></> : <>Need to go back? <Link href="/auth/login" className="auth-link">Sign in</Link></>}
        </p>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontFamily: "'DM Mono', monospace", fontSize: '.62rem', color: 'rgba(148,163,196,.3)', letterSpacing: '.06em' }}>
        CDSC@SCOE · Computer Department · SCOE, Pune
      </p>
    </div>
  )
}