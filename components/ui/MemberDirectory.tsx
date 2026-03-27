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

export default function MemberDirectory() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('All Years')
  const [domainFilter, setDomainFilter] = useState('All Domains')
  const supabase = createClient()

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, year, roll_no, bio, domains, avatar_url, linkedin_url, github_url, is_admin, created_at')
        .order('created_at', { ascending: true })

      if (!error && data) setMembers(data)
      setLoading(false)
    }
    fetchMembers()
  }, [])

  const filtered = members.filter(m => {
    const nameMatch = (m.full_name || '').toLowerCase().includes(search.toLowerCase())
    const yearMatch = yearFilter === 'All Years' || m.year === yearFilter
    const domainMatch = domainFilter === 'All Domains' || (m.domains || []).includes(domainFilter)
    return nameMatch && yearMatch && domainMatch
  })

  const initials = (name: string) =>
    (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: '#c9a84c', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          // Member Directory
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#f8f6f0' }}>
          Community Members
        </h1>
        <p style={{ color: '#8a9bb5', marginTop: '0.4rem', fontSize: '0.85rem' }}>
          {loading ? 'Loading...' : `${members.length} verified members`}
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search by name..."
          style={{
            flex: '1', minWidth: 200,
            padding: '0.6rem 1rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 6, color: '#f8f6f0',
            fontSize: '0.85rem', outline: 'none',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#c9a84c')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)')}
        />

        {/* Year filter */}
        <select
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
          style={{
            padding: '0.6rem 1rem', minWidth: 160,
            background: '#112240',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 6, color: yearFilter === 'All Years' ? '#8a9bb5' : '#c9a84c',
            fontSize: '0.82rem', outline: 'none', cursor: 'pointer',
          }}
        >
          {YEARS.map(y => <option key={y} value={y} style={{ background: '#112240' }}>{y}</option>)}
        </select>

        {/* Domain filter */}
        <select
          value={domainFilter}
          onChange={e => setDomainFilter(e.target.value)}
          style={{
            padding: '0.6rem 1rem', minWidth: 200,
            background: '#112240',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 6, color: domainFilter === 'All Domains' ? '#8a9bb5' : '#c9a84c',
            fontSize: '0.82rem', outline: 'none', cursor: 'pointer',
          }}
        >
          {DOMAINS_FILTER.map(d => <option key={d} value={d} style={{ background: '#112240' }}>{d}</option>)}
        </select>

        {/* Clear filters */}
        {(search || yearFilter !== 'All Years' || domainFilter !== 'All Domains') && (
          <button
            onClick={() => { setSearch(''); setYearFilter('All Years'); setDomainFilter('All Domains') }}
            style={{
              padding: '0.6rem 1rem', background: 'transparent',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 6, color: '#fca5a5',
              fontSize: '0.78rem', cursor: 'pointer',
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Results count */}
      {!loading && (search || yearFilter !== 'All Years' || domainFilter !== 'All Domains') && (
        <p style={{ color: '#8a9bb5', fontSize: '0.8rem', marginBottom: '1.25rem', fontFamily: "'DM Mono', monospace" }}>
          Showing {filtered.length} of {members.length} members
        </p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(201,168,76,0.1)',
              borderRadius: 8, padding: '1.5rem', height: 180,
              animation: 'pulse 1.5s infinite',
            }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#8a9bb5' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
          <p>No members match your filters.</p>
        </div>
      )}

      {/* Member Grid */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {filtered.map(member => (
            <div
              key={member.id}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: 8, padding: '1.5rem',
                transition: 'all 0.2s', position: 'relative',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.15)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              {/* Admin badge */}
              {member.is_admin && (
                <div style={{
                  position: 'absolute', top: '0.75rem', right: '0.75rem',
                  fontFamily: "'DM Mono', monospace", fontSize: '0.58rem',
                  color: '#c9a84c', border: '1px solid rgba(201,168,76,0.4)',
                  padding: '0.1rem 0.45rem', borderRadius: 2, letterSpacing: '1px',
                }}>ADMIN</div>
              )}

              {/* Avatar + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #1a3a6b, #112240)',
                  border: '1.5px solid rgba(201,168,76,0.25)',
                  display: 'grid', placeItems: 'center',
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700, fontSize: '1rem', color: '#c9a84c',
                  overflow: 'hidden',
                }}>
                  {member.avatar_url
                    ? <img src={member.avatar_url} alt={member.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initials(member.full_name || '')}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8f6f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {member.full_name || 'CDSC Member'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#8a9bb5', fontFamily: "'DM Mono', monospace" }}>
                    {member.year ? member.year.replace(' Year', '').replace('First (FE)', 'FE').replace('Second (SE)', 'SE').replace('Third (TE)', 'TE').replace('Final (BE)', 'BE') : 'SCOE'}
                    {member.roll_no ? ` · ${member.roll_no}` : ''}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {member.bio && (
                <p style={{
                  fontSize: '0.78rem', color: '#8a9bb5',
                  lineHeight: 1.6, marginBottom: '0.85rem',
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {member.bio}
                </p>
              )}

              {/* Domain tags */}
              {(member.domains || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
                  {(member.domains || []).slice(0, 3).map((d: string) => (
                    <span key={d} style={{
                      fontSize: '0.65rem', padding: '0.2rem 0.5rem',
                      border: '1px solid rgba(201,168,76,0.2)',
                      borderRadius: 3, color: '#c9a84c',
                      fontFamily: "'DM Mono', monospace",
                    }}>
                      {DOMAIN_ICONS[d] || '📌'} {d.split(' ')[0]}
                    </span>
                  ))}
                  {(member.domains || []).length > 3 && (
                    <span style={{ fontSize: '0.65rem', color: '#8a9bb5', padding: '0.2rem 0.3rem' }}>
                      +{member.domains.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Social links */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                {member.linkedin_url && (
                  <a href={member.linkedin_url} target="_blank" rel="noreferrer" style={{
                    fontSize: '0.72rem', color: '#8a9bb5', textDecoration: 'none',
                    padding: '0.25rem 0.6rem',
                    border: '1px solid rgba(138,155,181,0.2)', borderRadius: 3,
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#c9a84c' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(138,155,181,0.2)'; e.currentTarget.style.color = '#8a9bb5' }}>
                    in
                  </a>
                )}
                {member.github_url && (
                  <a href={member.github_url} target="_blank" rel="noreferrer" style={{
                    fontSize: '0.72rem', color: '#8a9bb5', textDecoration: 'none',
                    padding: '0.25rem 0.6rem',
                    border: '1px solid rgba(138,155,181,0.2)', borderRadius: 3,
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#c9a84c' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(138,155,181,0.2)'; e.currentTarget.style.color = '#8a9bb5' }}>
                    gh
                  </a>
                )}
                <span style={{
                  marginLeft: 'auto', fontSize: '0.65rem', color: '#8a9bb5',
                  fontFamily: "'DM Mono', monospace",
                }}>
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
