'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const DOMAINS = [
  'DSA & Competitive Coding', 'Web Development', 'Machine Learning & AI',
  'Cybersecurity', 'UI/UX Design', 'Cloud & DevOps',
  'Game Development', 'GATE Preparation', 'SQL & Databases',
  'Free Certifications', 'Digital Marketing', 'LinkedIn & Resume',
]

const YEARS = ['First Year (FE)', 'Second Year (SE)', 'Third Year (TE)', 'Final Year (BE)']

interface ProfileData {
  full_name: string
  year: string
  roll_no: string
  bio: string
  linkedin_url: string
  github_url: string
  domains: string[]
}

interface Props {
  userId: string
  initial: ProfileData
  onSave: (updated: ProfileData) => void
}

export default function ProfileEditor({ userId, initial, onSave }: Props) {
  const [form, setForm] = useState<ProfileData>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const set = (key: keyof ProfileData, value: string) =>
    setForm(p => ({ ...p, [key]: value }))

  const toggleDomain = (d: string) =>
    setForm(p => ({
      ...p,
      domains: p.domains.includes(d)
        ? p.domains.filter(x => x !== d)
        : [...p.domains, d],
    }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)

    const { error: dbError } = await supabase
      .from('profiles')
      .update({
        full_name:    form.full_name,
        year:         form.year,
        roll_no:      form.roll_no,
        bio:          form.bio,
        linkedin_url: form.linkedin_url,
        github_url:   form.github_url,
        domains:      form.domains,
      })
      .eq('id', userId)

    if (dbError) {
      setError(dbError.message)
    } else {
      setSaved(true)
      onSave(form)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Name + Year row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>FULL NAME</label>
          <input
            value={form.full_name}
            onChange={e => set('full_name', e.target.value)}
            placeholder="Your full name"
            className="input-field"
          />
        </div>
        <div>
          <label style={labelStyle}>YEAR OF STUDY</label>
          <select
            value={form.year}
            onChange={e => set('year', e.target.value)}
            className="input-field"
            style={{ appearance: 'none' }}
          >
            <option value="" disabled>Select year</option>
            {YEARS.map(y => (
              <option key={y} value={y} style={{ background: '#112240' }}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Roll No + Bio */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>ROLL NUMBER</label>
          <input
            value={form.roll_no}
            onChange={e => set('roll_no', e.target.value)}
            placeholder="e.g. 21CE001"
            className="input-field"
          />
        </div>
        <div>
          <label style={labelStyle}>BIO <span style={{ color: '#8a9bb5', fontSize: '0.65rem' }}>(short intro)</span></label>
          <input
            value={form.bio}
            onChange={e => set('bio', e.target.value)}
            placeholder="e.g. Final year CE student, loves DSA and open source"
            className="input-field"
          />
        </div>
      </div>

      {/* Social Links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>LINKEDIN URL</label>
          <input
            value={form.linkedin_url}
            onChange={e => set('linkedin_url', e.target.value)}
            placeholder="https://linkedin.com/in/yourname"
            className="input-field"
          />
        </div>
        <div>
          <label style={labelStyle}>GITHUB URL</label>
          <input
            value={form.github_url}
            onChange={e => set('github_url', e.target.value)}
            placeholder="https://github.com/yourusername"
            className="input-field"
          />
        </div>
      </div>

      {/* Domains */}
      <div>
        <label style={{ ...labelStyle, display: 'block', marginBottom: '0.75rem' }}>
          DOMAINS OF INTEREST
          <span style={{ color: '#c9a84c', marginLeft: '0.5rem' }}>({form.domains.length} selected)</span>
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {DOMAINS.map(domain => (
            <button
              key={domain}
              type="button"
              onClick={() => toggleDomain(domain)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 4, fontSize: '0.75rem',
                cursor: 'pointer', transition: 'all 0.15s',
                border: form.domains.includes(domain)
                  ? '1px solid #c9a84c'
                  : '1px solid rgba(201,168,76,0.2)',
                background: form.domains.includes(domain)
                  ? 'rgba(201,168,76,0.15)'
                  : 'transparent',
                color: form.domains.includes(domain) ? '#c9a84c' : '#8a9bb5',
              }}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Error / Save */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 6, padding: '0.7rem 1rem', color: '#fca5a5', fontSize: '0.82rem',
        }}>{error}</div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
          style={{ minWidth: 140 }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && (
          <span style={{
            color: '#4ade80', fontSize: '0.82rem',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}>
            ✓ Profile updated
          </span>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.72rem',
  color: '#8a9bb5', marginBottom: '0.4rem', letterSpacing: '0.5px',
  fontFamily: "'DM Mono', monospace",
}
