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

const T = {
  text: '#F1F5FF', text2: '#94A3C4', text3: 'rgba(148,163,196,0.45)',
  gold: '#FBBF24', indigo: '#6366F1', green: '#4ADE80',
  border: 'rgba(255,255,255,0.08)', border2: 'rgba(255,255,255,0.12)',
  card: 'rgba(22,29,48,0.75)',
  heading: "'Outfit', sans-serif", body: "'DM Sans', sans-serif", mono: "'DM Mono', monospace",
}

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

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '.75rem 1rem',
  background: 'rgba(255,255,255,.04)',
  border: `1px solid rgba(255,255,255,.1)`,
  borderRadius: 8, color: T.text,
  fontFamily: T.body, fontSize: '.88rem',
  outline: 'none', transition: 'border-color .2s, box-shadow .2s',
}
const labelSt: React.CSSProperties = {
  display: 'block', fontFamily: T.mono,
  fontSize: '.62rem', color: T.text3,
  letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.45rem',
}

export default function ProfileEditor({ userId, initial, onSave }: Props) {
  const [form, setForm] = useState<ProfileData>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const set = (key: keyof ProfileData, val: string) => setForm(p => ({ ...p, [key]: val }))

  const toggleDomain = (d: string) =>
    setForm(p => ({
      ...p,
      domains: p.domains.includes(d) ? p.domains.filter(x => x !== d) : [...p.domains, d],
    }))

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    const { error: e } = await supabase.from('profiles').update({
      full_name: form.full_name, year: form.year, roll_no: form.roll_no,
      bio: form.bio, linkedin_url: form.linkedin_url,
      github_url: form.github_url, domains: form.domains,
    }).eq('id', userId)
    if (e) setError(e.message)
    else { setSaved(true); onSave(form); setTimeout(() => setSaved(false), 3000) }
    setSaving(false)
  }

  return (
    <div style={{ fontFamily: T.body, color: T.text }}>
      <style>{`
        .pe-input:focus { border-color: rgba(99,102,241,.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,.1) !important; }
        .pe-chip { transition: all .15s; }
        .pe-chip:hover { border-color: rgba(255,255,255,.2) !important; color: ${T.text} !important; }
        @media(max-width:640px) {
          .pe-row-2 { grid-template-columns: 1fr !important; }
          .pe-row-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Section: Identity */}
        <div>
          <div style={{ fontFamily: T.mono, fontSize: '.62rem', color: T.indigo, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '.6rem', borderBottom: `1px solid ${T.border}` }}>
            Identity
          </div>
          <div className="pe-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelSt}>Full Name</label>
              <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your full name" className="pe-input" style={fieldStyle} />
            </div>
            <div>
              <label style={labelSt}>Year of Study</label>
              <select value={form.year} onChange={e => set('year', e.target.value)} className="pe-input" style={{ ...fieldStyle, appearance: 'none', cursor: 'pointer' }}>
                <option value="" disabled style={{ background: '#161D30' }}>Select year</option>
                {YEARS.map(y => <option key={y} value={y} style={{ background: '#161D30' }}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Section: Academic */}
        <div>
          <div style={{ fontFamily: T.mono, fontSize: '.62rem', color: T.indigo, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '.6rem', borderBottom: `1px solid ${T.border}` }}>
            Academic
          </div>
          <div className="pe-row-3" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label style={labelSt}>Roll Number</label>
              <input value={form.roll_no} onChange={e => set('roll_no', e.target.value)} placeholder="21CE001" className="pe-input" style={fieldStyle} />
            </div>
            <div>
              <label style={labelSt}>Bio <span style={{ color: T.text3, textTransform: 'none', fontSize: '.6rem' }}>(short intro)</span></label>
              <input value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="e.g. Final year CE student, loves DSA and open source" className="pe-input" style={fieldStyle} />
            </div>
          </div>
        </div>

        {/* Section: Social */}
        <div>
          <div style={{ fontFamily: T.mono, fontSize: '.62rem', color: T.indigo, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '.6rem', borderBottom: `1px solid ${T.border}` }}>
            Social Links
          </div>
          <div className="pe-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelSt}>LinkedIn URL</label>
              <input value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/yourname" className="pe-input" style={fieldStyle} />
            </div>
            <div>
              <label style={labelSt}>GitHub URL</label>
              <input value={form.github_url} onChange={e => set('github_url', e.target.value)} placeholder="https://github.com/yourusername" className="pe-input" style={fieldStyle} />
            </div>
          </div>
        </div>

        {/* Section: Domains */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '.6rem', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: T.mono, fontSize: '.62rem', color: T.indigo, letterSpacing: '.12em', textTransform: 'uppercase' }}>
              Domains of Interest
            </div>
            <div style={{ fontFamily: T.mono, fontSize: '.62rem', color: form.domains.length > 0 ? T.gold : T.text3 }}>
              {form.domains.length} selected
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
            {DOMAINS.map(d => {
              const active = form.domains.includes(d)
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDomain(d)}
                  className="pe-chip"
                  style={{
  padding: '.35rem .8rem', 
  borderRadius: 6,
  fontSize: '.75rem', 
  cursor: 'pointer',
  fontFamily: T.body, 
  border: `1px solid ${active ? 'rgba(99,102,241,.5)' : 'rgba(255,255,255,.1)'}`,
  outline: 'none',
  background: active ? 'rgba(99,102,241,.12)' : 'rgba(255,255,255,.04)',
  color: active ? '#A5B4FC' : T.text2,
  transition: 'all .15s',
}}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)',
            borderRadius: 8, padding: '.65rem 1rem', color: '#FCA5A5', fontSize: '.82rem',
          }}>{error}</div>
        )}

        {/* Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '.25rem' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '.85rem 2rem',
              background: 'linear-gradient(90deg,#F97316,#FBBF24)',
              color: '#0B0F19', fontWeight: 700, fontSize: '.9rem',
              border: 'none', borderRadius: 24, cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: T.body, opacity: saving ? .6 : 1,
              transition: 'opacity .2s, transform .15s',
              minWidth: 150,
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', color: T.green, fontSize: '.83rem', fontFamily: T.mono }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Saved
            </div>
          )}
        </div>

      </div>
    </div>
  )
}