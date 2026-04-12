'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const DOMAIN_OPTIONS = [
  'DSA & Competitive Coding', 'Web Development', 'Machine Learning & AI',
  'Cybersecurity', 'UI/UX Design', 'Cloud & DevOps', 'Game Development',
  'GATE Preparation', 'SQL & Databases', 'Free Certifications',
  'Digital Marketing', 'LinkedIn & Resume', 'General',
]
const RESOURCE_TYPES = ['video', 'pdf', 'blog', 'document', 'tool']

interface Member {
  id: string
  full_name: string
  year: string
  roll_no: string
  domains: string[]
  is_admin: boolean
  is_verified: boolean
  created_at: string
}
interface Announcement {
  id: string
  title: string
  body: string
  tag: string
  created_at: string
}
interface Resource {
  id: string
  title: string
  domain: string
  type: string
  url: string
  is_public: boolean
  created_at: string
}
type AdminTab = 'members' | 'announcements' | 'resources'

// ── SHARED STYLE TOKENS ───────────────────────────────────────────────────────
const T = {
  bg:      '#0B0F19',
  card:    'rgba(22,29,48,0.75)',
  border:  'rgba(255,255,255,0.08)',
  border2: 'rgba(255,255,255,0.12)',
  text:    '#F1F5FF',
  text2:   '#94A3C4',
  text3:   'rgba(148,163,196,0.45)',
  gold:    '#FBBF24',
  indigo:  '#6366F1',
  green:   '#4ADE80',
  red:     '#F87171',
  heading: "'Outfit', sans-serif",
  body:    "'DM Sans', sans-serif",
  mono:    "'DM Mono', monospace",
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '.7rem 1rem',
  background: 'rgba(255,255,255,.04)',
  border: `1px solid ${T.border2}`,
  borderRadius: 8, color: T.text,
  fontFamily: T.body, fontSize: '.88rem',
  outline: 'none', transition: 'border-color .2s, box-shadow .2s',
}
const labelSt: React.CSSProperties = {
  display: 'block', fontFamily: T.mono,
  fontSize: '.62rem', color: T.text3,
  letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.45rem',
}
const cardSt: React.CSSProperties = {
  background: T.card,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${T.border}`,
  borderRadius: 14,
}

export default function AdminPanel({ adminId }: { adminId: string }) {
  const [tab, setTab] = useState<AdminTab>('members')
  const [members, setMembers] = useState<Member[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const [annForm, setAnnForm] = useState({ title: '', body: '', tag: 'Community' })
  const [annSaving, setAnnSaving] = useState(false)
  const [annError, setAnnError] = useState('')

  const [resForm, setResForm] = useState({ title: '', description: '', domain: '', type: 'video', url: '', is_public: false })
  const [resSaving, setResSaving] = useState(false)
  const [resError, setResError] = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [mR, aR, rR] = await Promise.all([
      supabase.from('profiles').select('id,full_name,year,roll_no,domains,is_admin,is_verified,created_at').order('created_at'),
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
      supabase.from('resources').select('*').order('created_at', { ascending: false }),
    ])
    if (mR.data) setMembers(mR.data)
    if (aR.data) setAnnouncements(aR.data)
    if (rR.data) setResources(rR.data)
    setLoading(false)
  }

  const toggleAdmin    = async (id: string, cur: boolean) => { await supabase.from('profiles').update({ is_admin: !cur }).eq('id', id); setMembers(p => p.map(m => m.id === id ? { ...m, is_admin: !cur } : m)) }
  const toggleVerified = async (id: string, cur: boolean) => { await supabase.from('profiles').update({ is_verified: !cur }).eq('id', id); setMembers(p => p.map(m => m.id === id ? { ...m, is_verified: !cur } : m)) }

  const postAnnouncement = async () => {
    if (!annForm.title || !annForm.body) { setAnnError('Title and body required'); return }
    setAnnSaving(true); setAnnError('')
    const { error } = await supabase.from('announcements').insert({ title: annForm.title, body: annForm.body, tag: annForm.tag, created_by: adminId })
    if (error) setAnnError(error.message)
    else { setAnnForm({ title: '', body: '', tag: 'Community' }); fetchAll() }
    setAnnSaving(false)
  }

  const deleteAnnouncement = async (id: string) => { await supabase.from('announcements').delete().eq('id', id); setAnnouncements(p => p.filter(a => a.id !== id)) }

  const uploadResource = async () => {
    if (!resForm.title || !resForm.url) { setResError('Title and URL required'); return }
    setResSaving(true); setResError('')
    const { error } = await supabase.from('resources').insert({ ...resForm, created_by: adminId })
    if (error) setResError(error.message)
    else { setResForm({ title: '', description: '', domain: '', type: 'video', url: '', is_public: false }); fetchAll() }
    setResSaving(false)
  }

  const deleteResource = async (id: string) => { await supabase.from('resources').delete().eq('id', id); setResources(p => p.filter(r => r.id !== id)) }

  const TABS: { key: AdminTab; label: string }[] = [
    { key: 'members', label: 'Members' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'resources', label: 'Resources' },
  ]

  const STATS = [
    { label: 'Members', value: members.length, color: T.gold },
    { label: 'Announcements', value: announcements.length, color: '#A5B4FC' },
    { label: 'Resources', value: resources.length, color: T.green },
  ]

  return (
    <div style={{ fontFamily: T.body, color: T.text }}>
      <style>{`
        .adm-input:focus { border-color: rgba(99,102,241,.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,.1) !important; }
        .adm-tag-btn { transition: all .15s; }
        .adm-tag-btn:hover { color: ${T.gold} !important; border-color: rgba(251,191,36,.4) !important; }
        .adm-row:hover { background: rgba(255,255,255,.03) !important; }
        .adm-del:hover { color: ${T.red} !important; border-color: rgba(248,113,113,.3) !important; }
        @media (max-width: 640px) {
          .adm-grid-3 { grid-template-columns: 1fr !important; }
          .adm-grid-2 { grid-template-columns: 1fr !important; }
          .adm-announce-grid { grid-template-columns: 1fr !important; }
          .adm-table-scroll { overflow-x: auto; }
          .adm-table-scroll table { min-width: 600px; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontFamily: T.mono, fontSize: '.65rem', color: T.indigo, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.5rem' }}>
          // Admin Panel
        </div>
        <h1 style={{ fontFamily: T.heading, fontWeight: 800, fontSize: 'clamp(1.5rem,4vw,2rem)', color: T.text, letterSpacing: '-.02em', lineHeight: 1.1 }}>
          Community Management
        </h1>
        <p style={{ color: T.text2, marginTop: '.35rem', fontSize: '.85rem' }}>
          Manage members, post announcements, and upload resources.
        </p>
      </div>

      {/* ── STATS ── */}
      <div className="adm-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.75rem', marginBottom: '1.75rem' }}>
        {STATS.map(s => (
          <div key={s.label} style={{ ...cardSt, padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontFamily: T.heading, fontWeight: 800, fontSize: '1.75rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: T.mono, fontSize: '.65rem', color: T.text3, letterSpacing: '.08em', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── TABS ── */}
      <div style={{ display: 'flex', gap: '.25rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,.03)', borderRadius: 10, padding: '.3rem', border: `1px solid ${T.border}` }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: '.55rem .75rem', borderRadius: 7, border: 'none',
            cursor: 'pointer', fontSize: '.82rem', fontWeight: 600,
            fontFamily: T.body, transition: 'all .2s',
            background: tab === t.key ? 'rgba(99,102,241,.15)' : 'transparent',
            color: tab === t.key ? '#A5B4FC' : T.text2,
            boxShadow: tab === t.key ? `0 0 0 1px rgba(99,102,241,.3)` : 'none',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: T.text3, fontFamily: T.mono, fontSize: '.75rem', letterSpacing: '.1em' }}>
          LOADING...
        </div>
      )}

      {/* ── MEMBERS TAB ── */}
      {!loading && tab === 'members' && (
        <div style={{ ...cardSt, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: T.mono, fontSize: '.68rem', color: T.text3, letterSpacing: '.1em', textTransform: 'uppercase' }}>
              {members.length} total members
            </span>
          </div>
          <div className="adm-table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                  {['Name', 'Year', 'Roll No', 'Domains', 'Joined', 'Verified', 'Admin'].map(h => (
                    <th key={h} style={{ padding: '.65rem 1rem', textAlign: 'left', fontFamily: T.mono, fontSize: '.6rem', color: T.text3, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} className="adm-row" style={{ borderBottom: `1px solid ${T.border}`, transition: 'background .15s' }}>
                    <td style={{ padding: '.75rem 1rem', color: T.text, fontWeight: 600 }}>
                      {m.full_name || <span style={{ color: T.text3, fontStyle: 'italic', fontWeight: 400 }}>No name</span>}
                    </td>
                    <td style={{ padding: '.75rem 1rem', color: T.text2, fontSize: '.78rem', fontFamily: T.mono }}>
                      {m.year?.replace('First Year (FE)', 'FE').replace('Second Year (SE)', 'SE').replace('Third Year (TE)', 'TE').replace('Final Year (BE)', 'BE') || '—'}
                    </td>
                    <td style={{ padding: '.75rem 1rem', color: T.text3, fontFamily: T.mono, fontSize: '.75rem' }}>{m.roll_no || '—'}</td>
                    <td style={{ padding: '.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap' }}>
                        {(m.domains || []).slice(0, 2).map(d => (
                          <span key={d} style={{ fontSize: '.6rem', padding: '.15rem .45rem', border: '1px solid rgba(99,102,241,.3)', borderRadius: 4, color: '#A5B4FC', fontFamily: T.mono, background: 'rgba(99,102,241,.08)' }}>
                            {d.split(' ')[0]}
                          </span>
                        ))}
                        {(m.domains || []).length > 2 && <span style={{ fontSize: '.6rem', color: T.text3 }}>+{m.domains.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '.75rem 1rem', color: T.text3, fontFamily: T.mono, fontSize: '.7rem' }}>
                      {new Date(m.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ padding: '.75rem 1rem' }}>
                      <button onClick={() => toggleVerified(m.id, m.is_verified)} style={{
                        padding: '.2rem .6rem', borderRadius: 5, cursor: 'pointer',
                        fontSize: '.7rem', fontWeight: 600, fontFamily: T.mono, transition: 'all .15s',
                        background: m.is_verified ? 'rgba(74,222,128,.1)' : 'rgba(255,255,255,.05)',
                        color: m.is_verified ? T.green : T.text3,
                        border: `1px solid ${m.is_verified ? 'rgba(74,222,128,.3)' : T.border}` as any,
                      }}>
                        {m.is_verified ? '✓ Yes' : 'No'}
                      </button>
                    </td>
                    <td style={{ padding: '.75rem 1rem' }}>
                      <button onClick={() => toggleAdmin(m.id, m.is_admin)} style={{
                        padding: '.2rem .6rem', borderRadius: 5, cursor: 'pointer',
                        fontSize: '.7rem', fontWeight: 600, fontFamily: T.mono, transition: 'all .15s',
                        background: m.is_admin ? 'rgba(251,191,36,.1)' : 'rgba(255,255,255,.05)',
                        color: m.is_admin ? T.gold : T.text3,
                        border: `1px solid ${m.is_admin ? 'rgba(251,191,36,.3)' : T.border}` as any,
                      }}>
                        {m.is_admin ? '★ Admin' : 'Member'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ANNOUNCEMENTS TAB ── */}
      {!loading && tab === 'announcements' && (
        <div className="adm-announce-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.25rem', alignItems: 'start' }}>
          {/* Form */}
          <div style={{ ...cardSt, padding: '1.5rem' }}>
            <div style={{ fontFamily: T.mono, fontSize: '.65rem', color: T.indigo, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Post Announcement
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
              <div>
                <label style={labelSt}>Title</label>
                <input value={annForm.title} onChange={e => setAnnForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title" className="adm-input" style={inputStyle} />
              </div>
              <div>
                <label style={labelSt}>Tag</label>
                <select value={annForm.tag} onChange={e => setAnnForm(p => ({ ...p, tag: e.target.value }))} className="adm-input" style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}>
                  {['Community', 'DSA', 'Event', 'Career', 'ML', 'Web', 'Domains', 'GitHub', 'YouTube'].map(t => (
                    <option key={t} value={t} style={{ background: '#161D30' }}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelSt}>Body</label>
                <textarea
                  value={annForm.body}
                  onChange={e => setAnnForm(p => ({ ...p, body: e.target.value }))}
                  placeholder="Write your announcement..."
                  rows={4}
                  className="adm-input"
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
              {annError && <div style={errSt}>{annError}</div>}
              <button onClick={postAnnouncement} disabled={annSaving} style={primaryBtn}>
                {annSaving ? 'Posting...' : 'Post →'}
              </button>
            </div>
          </div>

          {/* List */}
          <div>
            <div style={{ fontFamily: T.mono, fontSize: '.65rem', color: T.text3, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Posted ({announcements.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', maxHeight: 520, overflowY: 'auto' }}>
              {announcements.length === 0 && <p style={{ color: T.text3, fontSize: '.83rem' }}>No announcements yet.</p>}
              {announcements.map(a => (
                <div key={a.id} style={{ ...cardSt, padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.75rem', marginBottom: '.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', minWidth: 0 }}>
                      <span style={{ fontFamily: T.mono, fontSize: '.6rem', padding: '.15rem .5rem', border: '1px solid rgba(99,102,241,.3)', borderRadius: 4, color: '#A5B4FC', background: 'rgba(99,102,241,.08)', flexShrink: 0 }}>{a.tag}</span>
                      <span style={{ fontWeight: 600, fontSize: '.88rem', color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</span>
                    </div>
                    <button onClick={() => deleteAnnouncement(a.id)} className="adm-del" style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 5, color: T.text3, cursor: 'pointer', fontSize: '.72rem', padding: '.2rem .5rem', flexShrink: 0, transition: 'all .15s', fontFamily: T.mono }}>✕</button>
                  </div>
                  <p style={{ fontSize: '.82rem', color: T.text2, lineHeight: 1.7 }}>{a.body}</p>
                  <p style={{ fontFamily: T.mono, fontSize: '.62rem', color: T.text3, marginTop: '.6rem' }}>
                    {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── RESOURCES TAB ── */}
      {!loading && tab === 'resources' && (
        <div className="adm-announce-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.25rem', alignItems: 'start' }}>
          {/* Form */}
          <div style={{ ...cardSt, padding: '1.5rem' }}>
            <div style={{ fontFamily: T.mono, fontSize: '.65rem', color: T.indigo, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Upload Resource
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
              <div>
                <label style={labelSt}>Title</label>
                <input value={resForm.title} onChange={e => setResForm(p => ({ ...p, title: e.target.value }))} placeholder="Resource title" className="adm-input" style={inputStyle} />
              </div>
              <div className="adm-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
                <div>
                  <label style={labelSt}>Domain</label>
                  <select value={resForm.domain} onChange={e => setResForm(p => ({ ...p, domain: e.target.value }))} className="adm-input" style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    <option value="" style={{ background: '#161D30' }}>Select domain</option>
                    {DOMAIN_OPTIONS.map(d => <option key={d} value={d} style={{ background: '#161D30' }}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Type</label>
                  <select value={resForm.type} onChange={e => setResForm(p => ({ ...p, type: e.target.value }))} className="adm-input" style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    {RESOURCE_TYPES.map(t => <option key={t} value={t} style={{ background: '#161D30' }}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelSt}>URL</label>
                <input value={resForm.url} onChange={e => setResForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..." className="adm-input" style={inputStyle} />
              </div>
              <div>
                <label style={labelSt}>Description <span style={{ color: T.text3, textTransform: 'none' }}>(optional)</span></label>
                <input value={resForm.description} onChange={e => setResForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description" className="adm-input" style={inputStyle} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '.65rem', cursor: 'pointer', fontSize: '.83rem', color: T.text2, fontFamily: T.body }}>
                <input type="checkbox" checked={resForm.is_public} onChange={e => setResForm(p => ({ ...p, is_public: e.target.checked }))} style={{ accentColor: T.indigo, width: 15, height: 15 }} />
                Make publicly visible
              </label>
              {resError && <div style={errSt}>{resError}</div>}
              <button onClick={uploadResource} disabled={resSaving} style={primaryBtn}>
                {resSaving ? 'Uploading...' : 'Upload →'}
              </button>
            </div>
          </div>

          {/* List */}
          <div>
            <div style={{ fontFamily: T.mono, fontSize: '.65rem', color: T.text3, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              All Resources ({resources.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', maxHeight: 520, overflowY: 'auto' }}>
              {resources.length === 0 && <p style={{ color: T.text3, fontSize: '.83rem' }}>No resources yet.</p>}
              {resources.map(r => (
                <div key={r.id} style={{ ...cardSt, padding: '.9rem 1.1rem', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.25rem' }}>
                      <span style={{ fontFamily: T.mono, fontSize: '.6rem', padding: '.12rem .45rem', border: '1px solid rgba(99,102,241,.3)', borderRadius: 4, color: '#A5B4FC', background: 'rgba(99,102,241,.08)', flexShrink: 0 }}>{r.type}</span>
                      <span style={{ fontWeight: 600, fontSize: '.85rem', color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '.72rem', color: T.text2 }}>{r.domain || 'General'}</span>
                      <span style={{ fontSize: '.68rem', color: r.is_public ? T.green : T.text3, fontFamily: T.mono }}>{r.is_public ? '● Public' : '○ Members'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '.4rem', flexShrink: 0 }}>
                    <a href={r.url} target="_blank" rel="noreferrer" style={{ fontFamily: T.mono, fontSize: '.72rem', padding: '.25rem .55rem', border: `1px solid ${T.border2}`, borderRadius: 5, color: T.text2, textDecoration: 'none', transition: 'all .15s' }}>↗</a>
                    <button onClick={() => deleteResource(r.id)} className="adm-del" style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 5, color: T.text3, cursor: 'pointer', fontSize: '.72rem', padding: '.25rem .55rem', transition: 'all .15s', fontFamily: T.mono }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const primaryBtn: React.CSSProperties = {
  width: '100%', padding: '.85rem 1.5rem',
  background: 'linear-gradient(90deg,#F97316,#FBBF24)',
  color: '#0B0F19', fontWeight: 700, fontSize: '.88rem',
  border: 'none', borderRadius: 24, cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
  transition: 'opacity .2s, transform .2s',
}
const errSt: React.CSSProperties = {
  background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)',
  borderRadius: 8, padding: '.6rem .9rem', color: '#FCA5A5', fontSize: '.8rem',
}