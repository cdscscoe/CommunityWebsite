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

export default function AdminPanel({ adminId }: { adminId: string }) {
  const [tab, setTab] = useState<AdminTab>('members')
  const [members, setMembers] = useState<Member[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Announcement form state
  const [annForm, setAnnForm] = useState({ title: '', body: '', tag: 'Community' })
  const [annSaving, setAnnSaving] = useState(false)
  const [annError, setAnnError] = useState('')

  // Resource form state
  const [resForm, setResForm] = useState({ title: '', description: '', domain: '', type: 'video', url: '', is_public: false })
  const [resSaving, setResSaving] = useState(false)
  const [resError, setResError] = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [membersRes, annRes, resRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name, year, roll_no, domains, is_admin, is_verified, created_at').order('created_at'),
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
      supabase.from('resources').select('*').order('created_at', { ascending: false }),
    ])
    if (membersRes.data) setMembers(membersRes.data)
    if (annRes.data) setAnnouncements(annRes.data)
    if (resRes.data) setResources(resRes.data)
    setLoading(false)
  }

  // Toggle member admin status
  const toggleAdmin = async (memberId: string, current: boolean) => {
    await supabase.from('profiles').update({ is_admin: !current }).eq('id', memberId)
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, is_admin: !current } : m))
  }

  // Toggle member verified status
  const toggleVerified = async (memberId: string, current: boolean) => {
    await supabase.from('profiles').update({ is_verified: !current }).eq('id', memberId)
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, is_verified: !current } : m))
  }

  // Post announcement
  const postAnnouncement = async () => {
    if (!annForm.title || !annForm.body) { setAnnError('Title and body required'); return }
    setAnnSaving(true); setAnnError('')
    const { error } = await supabase.from('announcements').insert({
      title: annForm.title, body: annForm.body, tag: annForm.tag, created_by: adminId,
    })
    if (error) { setAnnError(error.message) }
    else { setAnnForm({ title: '', body: '', tag: 'Community' }); fetchAll() }
    setAnnSaving(false)
  }

  // Delete announcement
  const deleteAnnouncement = async (id: string) => {
    await supabase.from('announcements').delete().eq('id', id)
    setAnnouncements(prev => prev.filter(a => a.id !== id))
  }

  // Upload resource
  const uploadResource = async () => {
    if (!resForm.title || !resForm.url) { setResError('Title and URL required'); return }
    setResSaving(true); setResError('')
    const { error } = await supabase.from('resources').insert({
      title: resForm.title, description: resForm.description,
      domain: resForm.domain, type: resForm.type,
      url: resForm.url, is_public: resForm.is_public,
      created_by: adminId,
    })
    if (error) { setResError(error.message) }
    else { setResForm({ title: '', description: '', domain: '', type: 'video', url: '', is_public: false }); fetchAll() }
    setResSaving(false)
  }

  // Delete resource
  const deleteResource = async (id: string) => {
    await supabase.from('resources').delete().eq('id', id)
    setResources(prev => prev.filter(r => r.id !== id))
  }

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.55rem 1.25rem', borderRadius: 6, border: 'none',
    cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
    background: active ? 'rgba(201,168,76,0.15)' : 'transparent',
    color: active ? '#c9a84c' : '#8a9bb5',
    borderBottom: active ? '2px solid #c9a84c' : '2px solid transparent',
    transition: 'all 0.15s',
  })

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: '#c9a84c', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          // Admin Panel
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#f8f6f0' }}>
          Community Management
        </h1>
        <p style={{ color: '#8a9bb5', marginTop: '0.3rem', fontSize: '0.82rem' }}>
          Manage members, post announcements, and upload resources.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Members', value: members.length, icon: '👥' },
          { label: 'Announcements', value: announcements.length, icon: '📢' },
          { label: 'Resources', value: resources.length, icon: '📚' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 8, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#c9a84c' }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#8a9bb5' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab buttons */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(201,168,76,0.1)', paddingBottom: '0' }}>
        {(['members', 'announcements', 'resources'] as AdminTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabBtnStyle(tab === t)}>
            {t === 'members' ? '👥 Members' : t === 'announcements' ? '📢 Announcements' : '📚 Resources'}
          </button>
        ))}
      </div>

      {loading && <div style={{ color: '#8a9bb5', fontSize: '0.85rem' }}>Loading...</div>}

      {/* ── MEMBERS TAB ── */}
      {!loading && tab === 'members' && (
        <div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                  {['Name', 'Year', 'Roll No', 'Domains', 'Joined', 'Verified', 'Admin'].map(h => (
                    <th key={h} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: '#8a9bb5', fontFamily: "'DM Mono', monospace", fontSize: '0.68rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid rgba(201,168,76,0.06)', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '0.75rem', color: '#f8f6f0', fontWeight: 500 }}>
                      {m.full_name || <span style={{ color: '#8a9bb5', fontStyle: 'italic' }}>No name</span>}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#8a9bb5', fontSize: '0.78rem' }}>
                      {m.year?.replace('First Year (FE)', 'FE').replace('Second Year (SE)', 'SE').replace('Third Year (TE)', 'TE').replace('Final Year (BE)', 'BE') || '—'}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#8a9bb5', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem' }}>
                      {m.roll_no || '—'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {(m.domains || []).slice(0, 2).map(d => (
                          <span key={d} style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 2, color: '#c9a84c' }}>
                            {d.split(' ')[0]}
                          </span>
                        ))}
                        {(m.domains || []).length > 2 && <span style={{ fontSize: '0.62rem', color: '#8a9bb5' }}>+{m.domains.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#8a9bb5', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace" }}>
                      {new Date(m.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <button onClick={() => toggleVerified(m.id, m.is_verified)} style={{
                        padding: '0.2rem 0.6rem', borderRadius: 3, border: 'none',
                        cursor: 'pointer', fontSize: '0.7rem', fontWeight: 500,
                        background: m.is_verified ? 'rgba(74,222,128,0.1)' : 'rgba(138,155,181,0.1)',
                        color: m.is_verified ? '#4ade80' : '#8a9bb5',
                        transition: 'all 0.15s',
                      }}>
                        {m.is_verified ? '✓ Yes' : 'No'}
                      </button>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <button onClick={() => toggleAdmin(m.id, m.is_admin)} style={{
                        padding: '0.2rem 0.6rem', borderRadius: 3, border: 'none',
                        cursor: 'pointer', fontSize: '0.7rem', fontWeight: 500,
                        background: m.is_admin ? 'rgba(201,168,76,0.15)' : 'rgba(138,155,181,0.1)',
                        color: m.is_admin ? '#c9a84c' : '#8a9bb5',
                        transition: 'all 0.15s',
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Post form */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8f6f0', marginBottom: '1.25rem' }}>Post Announcement</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={labelStyle}>TITLE</label>
                <input value={annForm.title} onChange={e => setAnnForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title" className="input-field" />
              </div>
              <div>
                <label style={labelStyle}>TAG</label>
                <select value={annForm.tag} onChange={e => setAnnForm(p => ({ ...p, tag: e.target.value }))} className="input-field" style={{ appearance: 'none' }}>
                  {['Community', 'DSA', 'Event', 'Career', 'ML', 'Web', 'Domains', 'GitHub', 'YouTube'].map(t => (
                    <option key={t} value={t} style={{ background: '#112240' }}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>BODY</label>
                <textarea
                  value={annForm.body}
                  onChange={e => setAnnForm(p => ({ ...p, body: e.target.value }))}
                  placeholder="Write your announcement here..."
                  rows={4}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: 6,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)',
                    color: '#f8f6f0', fontSize: '0.85rem', outline: 'none',
                    resize: 'vertical', fontFamily: 'inherit',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#c9a84c')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)')}
                />
              </div>
              {annError && <div style={errorStyle}>{annError}</div>}
              <button onClick={postAnnouncement} disabled={annSaving} className="btn-primary" style={{ justifyContent: 'center' }}>
                {annSaving ? 'Posting...' : 'Post Announcement →'}
              </button>
            </div>
          </div>

          {/* Existing announcements */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8f6f0', marginBottom: '1rem' }}>
              Posted ({announcements.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 480, overflowY: 'auto', paddingRight: '0.25rem' }}>
              {announcements.length === 0 && <p style={{ color: '#8a9bb5', fontSize: '0.83rem' }}>No announcements yet.</p>}
              {announcements.map(a => (
                <div key={a.id} style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: 6, padding: '1rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 2, color: '#c9a84c', fontFamily: "'DM Mono', monospace" }}>{a.tag}</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8f6f0' }}>{a.title}</span>
                    </div>
                    <button onClick={() => deleteAnnouncement(a.id)} style={{
                      background: 'none', border: 'none', color: '#8a9bb5',
                      cursor: 'pointer', fontSize: '0.75rem', padding: '0.1rem 0.3rem',
                      transition: 'color 0.15s', flexShrink: 0,
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fca5a5')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#8a9bb5')}>
                      ✕
                    </button>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#8a9bb5', lineHeight: 1.6 }}>{a.body}</p>
                  <p style={{ fontSize: '0.65rem', color: '#8a9bb5', marginTop: '0.5rem', fontFamily: "'DM Mono', monospace" }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Upload form */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8f6f0', marginBottom: '1.25rem' }}>Upload Resource</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={labelStyle}>TITLE</label>
                <input value={resForm.title} onChange={e => setResForm(p => ({ ...p, title: e.target.value }))} placeholder="Resource title" className="input-field" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>DOMAIN</label>
                  <select value={resForm.domain} onChange={e => setResForm(p => ({ ...p, domain: e.target.value }))} className="input-field" style={{ appearance: 'none' }}>
                    <option value="" style={{ background: '#112240' }}>Select domain</option>
                    {DOMAIN_OPTIONS.map(d => <option key={d} value={d} style={{ background: '#112240' }}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>TYPE</label>
                  <select value={resForm.type} onChange={e => setResForm(p => ({ ...p, type: e.target.value }))} className="input-field" style={{ appearance: 'none' }}>
                    {RESOURCE_TYPES.map(t => <option key={t} value={t} style={{ background: '#112240' }}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>URL</label>
                <input value={resForm.url} onChange={e => setResForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..." className="input-field" />
              </div>
              <div>
                <label style={labelStyle}>DESCRIPTION <span style={{ color: '#8a9bb5', fontSize: '0.65rem' }}>(optional)</span></label>
                <input value={resForm.description} onChange={e => setResForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description" className="input-field" />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.82rem', color: '#8a9bb5' }}>
                <input type="checkbox" checked={resForm.is_public} onChange={e => setResForm(p => ({ ...p, is_public: e.target.checked }))} style={{ accentColor: '#c9a84c' }} />
                Make publicly visible (no login required)
              </label>
              {resError && <div style={errorStyle}>{resError}</div>}
              <button onClick={uploadResource} disabled={resSaving} className="btn-primary" style={{ justifyContent: 'center' }}>
                {resSaving ? 'Uploading...' : 'Upload Resource →'}
              </button>
            </div>
          </div>

          {/* Existing resources */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8f6f0', marginBottom: '1rem' }}>
              All Resources ({resources.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: 520, overflowY: 'auto', paddingRight: '0.25rem' }}>
              {resources.length === 0 && <p style={{ color: '#8a9bb5', fontSize: '0.83rem' }}>No resources uploaded yet.</p>}
              {resources.map(r => (
                <div key={r.id} style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: 6, padding: '0.85rem 1rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 2, color: '#c9a84c', fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>{r.type}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.83rem', color: '#f8f6f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#8a9bb5' }}>{r.domain || 'General'}</span>
                      <span style={{ fontSize: '0.68rem', color: r.is_public ? '#4ade80' : '#8a9bb5' }}>{r.is_public ? '🌐 Public' : '🔒 Members'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, marginLeft: '0.75rem' }}>
                    <a href={r.url} target="_blank" rel="noreferrer" style={{
                      fontSize: '0.72rem', padding: '0.2rem 0.55rem',
                      border: '1px solid rgba(201,168,76,0.25)', borderRadius: 3,
                      color: '#c9a84c', textDecoration: 'none', transition: 'all 0.15s',
                    }}>↗</a>
                    <button onClick={() => deleteResource(r.id)} style={{
                      background: 'none', border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: 3, color: '#fca5a5', cursor: 'pointer',
                      fontSize: '0.72rem', padding: '0.2rem 0.55rem', transition: 'all 0.15s',
                    }}>✕</button>
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

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.72rem',
  color: '#8a9bb5', marginBottom: '0.4rem',
  letterSpacing: '0.5px', fontFamily: "'DM Mono', monospace",
}

const errorStyle: React.CSSProperties = {
  background: 'rgba(239,68,68,0.1)',
  border: '1px solid rgba(239,68,68,0.3)',
  borderRadius: 6, padding: '0.65rem 0.85rem',
  color: '#fca5a5', fontSize: '0.8rem',
}
