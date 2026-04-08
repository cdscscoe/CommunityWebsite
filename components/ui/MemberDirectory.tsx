'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const DOMAIN_ICONS: Record<string, string> = {
  'DSA & Competitive Coding': '⚔️',
  'Web Development': '🌐',
  'Machine Learning & AI': '🤖',
  'Cybersecurity': '🔐',
  'UI/UX Design': '🎨',
  'Cloud & DevOps': '☁️',
  'Game Development': '🎮',
  'GATE Preparation': '📊',
  'SQL & Databases': '🛢️',
  'Free Certifications': '🎓',
  'Digital Marketing': '📣',
  'LinkedIn & Resume': '💼',
}

const YEARS = ['All Years', 'First Year (FE)', 'Second Year (SE)', 'Third Year (TE)', 'Final Year (BE)']
const DOMAINS_FILTER = ['All Domains', 'DSA & Competitive Coding', 'Web Development', 'Machine Learning & AI', 'Cybersecurity', 'UI/UX Design', 'Cloud & DevOps', 'Game Development', 'GATE Preparation']

// Gradient pool for avatar backgrounds
const GRAD_POOL = [
  'linear-gradient(135deg,#6366F1,#8B5CF6)',
  'linear-gradient(135deg,#F97316,#FBBF24)',
  'linear-gradient(135deg,#EC4899,#F472B6)',
  'linear-gradient(135deg,#06B6D4,#6366F1)',
  'linear-gradient(135deg,#10B981,#06B6D4)',
  'linear-gradient(135deg,#F59E0B,#EF4444)',
]

interface Member {
  id: string
  full_name: string
  year: string
  roll_no: string
  bio: string
  domains: string[]
  avatar_url: string
  linkedin_url: string
  github_url: string
  is_admin: boolean
  created_at: string
}

const T = {
  bg: '#0B0F19', card: 'rgba(22,29,48,0.75)',
  border: 'rgba(255,255,255,0.08)', border2: 'rgba(255,255,255,0.12)',
  text: '#F1F5FF', text2: '#94A3C4', text3: 'rgba(148,163,196,0.45)',
  gold: '#FBBF24', indigo: '#6366F1', green: '#4ADE80',
  heading: "'Outfit', sans-serif", body: "'DM Sans', sans-serif", mono: "'DM Mono', monospace",
}

export default function MemberDirectory() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('All Years')
  const [domainFilter, setDomainFilter] = useState('All Domains')
  const supabase = createClient()

  useEffect(() => {
    supabase.from('profiles')
      .select('id,full_name,year,roll_no,bio,domains,avatar_url,linkedin_url,github_url,is_admin,created_at')
      .order('created_at', { ascending: true })
      .then(({ data }) => { if (data) setMembers(data); setLoading(false) })
  }, [])

  const filtered = members.filter(m => {
    const nameMatch = (m.full_name || '').toLowerCase().includes(search.toLowerCase())
    const yearMatch = yearFilter === 'All Years' || m.year === yearFilter
    const domainMatch = domainFilter === 'All Domains' || (m.domains || []).includes(domainFilter)
    return nameMatch && yearMatch && domainMatch
  })

  const initials = (name: string) =>
    (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const avatarGrad = (id: string) =>
    GRAD_POOL[id.charCodeAt(0) % GRAD_POOL.length]

  const hasFilters = search || yearFilter !== 'All Years' || domainFilter !== 'All Domains'

  return (
    <div style={{ fontFamily: T.body, color: T.text }}>
      <style>{`
        .mdir-input:focus { border-color: rgba(99,102,241,.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,.1) !important; }
        .mdir-card:hover { border-color: rgba(255,255,255,.15) !important; transform: translateY(-2px) !important; }
        .mdir-link:hover { border-color: rgba(99,102,241,.5) !important; color: #A5B4FC !important; }
        @keyframes shimmer { 0%,100%{opacity:.4} 50%{opacity:.8} }
        .mdir-skeleton { animation: shimmer 1.5s ease-in-out infinite; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 12px; }
        @media(max-width:640px) {
          .mdir-filters { flex-direction: column !important; }
          .mdir-grid { grid-template-columns: 1fr !important; }
        }
        @media(min-width:641px) and (max-width:960px) {
          .mdir-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontFamily: T.mono, fontSize: '.65rem', color: T.indigo, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.5rem' }}>
          // Member Directory
        </div>
        <h1 style={{ fontFamily: T.heading, fontWeight: 800, fontSize: 'clamp(1.5rem,4vw,2rem)', color: T.text, letterSpacing: '-.02em', lineHeight: 1.1 }}>
          Community Members
        </h1>
        <p style={{ color: T.text2, marginTop: '.35rem', fontSize: '.85rem' }}>
          {loading ? 'Loading...' : `${members.length} verified members of CDSC@SCOE`}
        </p>
      </div>

      {/* Filters */}
      <div className="mdir-filters" style={{ display: 'flex', gap: '.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="mdir-input"
          style={{
            flex: 1, minWidth: 180, padding: '.7rem 1rem',
            background: 'rgba(255,255,255,.04)', border: `1px solid ${T.border2}`,
            borderRadius: 8, color: T.text, fontFamily: T.body, fontSize: '.85rem', outline: 'none',
            transition: 'border-color .2s, box-shadow .2s',
          }}
        />
        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="mdir-input" style={{
          padding: '.7rem 1rem', minWidth: 150,
          background: 'rgba(22,29,48,.9)', border: `1px solid ${T.border2}`,
          borderRadius: 8, color: yearFilter === 'All Years' ? T.text2 : T.text,
          fontSize: '.82rem', outline: 'none', cursor: 'pointer', fontFamily: T.body,
        }}>
          {YEARS.map(y => <option key={y} value={y} style={{ background: '#161D30' }}>{y}</option>)}
        </select>
        <select value={domainFilter} onChange={e => setDomainFilter(e.target.value)} className="mdir-input" style={{
          padding: '.7rem 1rem', minWidth: 180,
          background: 'rgba(22,29,48,.9)', border: `1px solid ${T.border2}`,
          borderRadius: 8, color: domainFilter === 'All Domains' ? T.text2 : T.text,
          fontSize: '.82rem', outline: 'none', cursor: 'pointer', fontFamily: T.body,
        }}>
          {DOMAINS_FILTER.map(d => <option key={d} value={d} style={{ background: '#161D30' }}>{d}</option>)}
        </select>
        {hasFilters && (
          <button onClick={() => { setSearch(''); setYearFilter('All Years'); setDomainFilter('All Domains') }} style={{
            padding: '.7rem 1rem', background: 'transparent', border: '1px solid rgba(248,113,113,.3)',
            borderRadius: 8, color: '#FCA5A5', fontSize: '.8rem', cursor: 'pointer', fontFamily: T.body,
            whiteSpace: 'nowrap',
          }}>✕ Clear</button>
        )}
      </div>

      {/* Results count */}
      {!loading && hasFilters && (
        <p style={{ fontFamily: T.mono, color: T.text3, fontSize: '.68rem', letterSpacing: '.08em', marginBottom: '1.25rem' }}>
          SHOWING {filtered.length} OF {members.length}
        </p>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="mdir-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
          {[...Array(6)].map((_, i) => <div key={i} className="mdir-skeleton" style={{ height: 180 }} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontFamily: T.mono, fontSize: '.68rem', color: T.text3, letterSpacing: '.1em' }}>NO MEMBERS FOUND</div>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="mdir-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
          {filtered.map(member => (
            <div
              key={member.id}
              className="mdir-card"
              style={{
                background: T.card, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${T.border}`, borderRadius: 14, padding: '1.25rem',
                transition: 'border-color .25s, transform .25s, box-shadow .25s',
                position: 'relative', display: 'flex', flexDirection: 'column', gap: '.9rem',
              }}
            >
              {/* Admin badge */}
              {member.is_admin && (
                <div style={{
                  position: 'absolute', top: '.75rem', right: '.75rem',
                  fontFamily: T.mono, fontSize: '.55rem', color: T.gold,
                  border: '1px solid rgba(251,191,36,.3)', padding: '.12rem .45rem',
                  borderRadius: 4, letterSpacing: '.08em', background: 'rgba(251,191,36,.08)',
                }}>ADMIN</div>
              )}

              {/* Avatar + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: avatarGrad(member.id),
                  display: 'grid', placeItems: 'center',
                  fontFamily: T.heading, fontWeight: 800, fontSize: '.95rem', color: '#fff',
                  overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,.35)',
                }}>
                  {member.avatar_url
                    ? <img src={member.avatar_url} alt={member.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initials(member.full_name || '')}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '.92rem', color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {member.full_name || 'CDSC Member'}
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: '.65rem', color: T.text3 }}>
                    {member.year
                      ? member.year.replace('First Year (FE)', 'FE').replace('Second Year (SE)', 'SE').replace('Third Year (TE)', 'TE').replace('Final Year (BE)', 'BE')
                      : 'SCOE'}
                    {member.roll_no ? ` · ${member.roll_no}` : ''}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {member.bio && (
                <p style={{
                  fontSize: '.8rem', color: T.text2, lineHeight: 1.65,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {member.bio}
                </p>
              )}

              {/* Domain chips */}
              {(member.domains || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem' }}>
                  {(member.domains || []).slice(0, 3).map(d => (
                    <span key={d} style={{
                      fontSize: '.62rem', padding: '.15rem .45rem',
                      border: '1px solid rgba(99,102,241,.25)',
                      borderRadius: 4, color: '#A5B4FC', fontFamily: T.mono,
                      background: 'rgba(99,102,241,.08)',
                    }}>
                      {DOMAIN_ICONS[d] || '📌'} {d.split(' ')[0]}
                    </span>
                  ))}
                  {(member.domains || []).length > 3 && (
                    <span style={{ fontSize: '.62rem', color: T.text3, padding: '.15rem .3rem' }}>+{member.domains.length - 3}</span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginTop: 'auto' }}>
                {member.linkedin_url && (
                  <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="mdir-link" style={{
                    fontFamily: T.mono, fontSize: '.65rem', color: T.text3, textDecoration: 'none',
                    padding: '.2rem .5rem', border: `1px solid ${T.border}`, borderRadius: 5, transition: 'all .15s',
                  }}>in</a>
                )}
                {member.github_url && (
                  <a href={member.github_url} target="_blank" rel="noreferrer" className="mdir-link" style={{
                    fontFamily: T.mono, fontSize: '.65rem', color: T.text3, textDecoration: 'none',
                    padding: '.2rem .5rem', border: `1px solid ${T.border}`, borderRadius: 5, transition: 'all .15s',
                  }}>gh</a>
                )}
                <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: '.62rem', color: T.text3 }}>
                  {new Date(member.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}