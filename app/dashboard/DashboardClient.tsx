'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import ProfileEditor from '@/components/ui/ProfileEditor'
import MemberDirectory from '@/components/ui/MemberDirectory'
import AdminPanel from '@/components/ui/AdminPanel'

const DOMAIN_ICONS: Record<string, string> = {
  'DSA & Competitive Coding': '⚔️', 'Web Development': '🌐',
  'Machine Learning & AI': '🤖', 'Cybersecurity': '🔐',
  'UI/UX Design': '🎨', 'Cloud & DevOps': '☁️',
  'Game Development': '🎮', 'GATE Preparation': '📊',
  'SQL & Databases': '🛢️', 'Free Certifications': '🎓',
  'Digital Marketing': '📣', 'LinkedIn & Resume': '💼',
}

type Tab = 'home' | 'resources' | 'directory' | 'profile' | 'admin'

interface ProfileData {
  full_name: string; year: string; roll_no: string
  bio: string; linkedin_url: string; github_url: string
  domains: string[]
}

interface Announcement { id: string; title: string; body: string; tag: string; created_at: string }
interface Resource { id: string; title: string; domain: string; type: string; url: string; is_public: boolean }

export default function DashboardClient({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>('home')
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      try {
        console.log('📊 Dashboard loading for user:', user.id)
        const { data: prof, error } = await supabase
          .from('profiles')
          .select('full_name, year, roll_no, bio, linkedin_url, github_url, domains, is_admin')
          .eq('id', user.id)
          .single()

        console.log('👤 Profile fetch result:', { data: prof, error: error?.message })

        if (!error && prof) {
          console.log('✅ Profile exists, setting data')
          setProfile({
            full_name: prof.full_name || '',
            year: prof.year || '',
            roll_no: prof.roll_no || '',
            bio: prof.bio || '',
            linkedin_url: prof.linkedin_url || '',
            github_url: prof.github_url || '',
            domains: prof.domains || [],
          })
          setIsAdmin(prof.is_admin || false)
        } else {
          // Profile doesn't exist yet, create one from user metadata
          console.log('⚠️ Profile not found, creating new one')
          const meta = user.user_metadata
          const newProfile = {
            full_name: meta?.full_name || user.email?.split('@')[0] || '',
            year: meta?.year || '',
            roll_no: meta?.roll_no || '',
            bio: '',
            linkedin_url: '',
            github_url: '',
            domains: meta?.domains || [],
          }
          setProfile(newProfile)
          
          // Try to create the profile
          const createRes = await supabase.from('profiles').insert({
            id: user.id,
            full_name: newProfile.full_name,
            year: newProfile.year,
            roll_no: newProfile.roll_no,
            domains: newProfile.domains,
            avatar_url: meta?.avatar_url,
          }).select().single()
          console.log('📝 Profile creation result:', createRes)
        }

        const [annRes, resRes] = await Promise.all([
          supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(10),
          supabase.from('resources').select('*').order('created_at', { ascending: false }),
        ])
        console.log('📢 Announcements:', annRes.data?.length, 'Resources:', resRes.data?.length)
        if (annRes.data) setAnnouncements(annRes.data)
        if (resRes.data) setResources(resRes.data)
      } catch (err) {
        console.error('❌ Dashboard load error:', err)
      }
      setLoadingData(false)
    }
    load()
  }, [user.id])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const name = profile?.full_name || user.email?.split('@')[0] || 'Member'
  const avatar = user.user_metadata?.avatar_url || null
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const domains = profile?.domains || []

  const navItems: { id: Tab; icon: string; label: string; adminOnly?: boolean }[] = [
    { id: 'home', icon: '⊞', label: 'Overview' },
    { id: 'resources', icon: '📚', label: 'Resources' },
    { id: 'directory', icon: '👥', label: 'Directory' },
    { id: 'profile', icon: '👤', label: 'My Profile' },
    ...(isAdmin ? [{ id: 'admin' as Tab, icon: '⚙️', label: 'Admin', adminOnly: true }] : []),
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex' }}>
      {/* SIDEBAR */}
      <aside style={{ width: 240, minHeight: '100vh', background: '#080f1e', borderRight: '1px solid rgba(201,168,76,0.12)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #c9a84c, #e8c97a)', borderRadius: 6, display: 'grid', placeItems: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '0.85rem', color: '#0a1628' }}>C</div>
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8f6f0' }}>CDSC<span style={{ color: '#c9a84c' }}>@SCOE</span></span>
          </Link>
        </div>

        <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: 6, border: 'none', cursor: 'pointer', marginBottom: '0.25rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 500, background: tab === item.id ? 'rgba(201,168,76,0.1)' : 'transparent', color: tab === item.id ? '#c9a84c' : '#8a9bb5', borderLeft: tab === item.id ? '2px solid #c9a84c' : '2px solid transparent', transition: 'all 0.15s' }}>
              <span>{item.icon}</span>
              {item.label}
              {item.adminOnly && <span style={{ marginLeft: 'auto', fontSize: '0.58rem', padding: '0.1rem 0.35rem', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 2, color: '#c9a84c' }}>ADMIN</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
          <div style={{ fontSize: '0.68rem', color: '#8a9bb5', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.6rem', fontFamily: "'DM Mono', monospace" }}>Community</div>
          {[{ label: 'Telegram', href: 'https://t.me/+95_1-Gf6UiUwMGE9' }, { label: 'WhatsApp', href: 'https://chat.whatsapp.com/CzniCBDSjHY2OVTRespdiO' }, { label: 'YouTube', href: 'https://youtube.com/@CDSCSCOE' }, { label: 'LinkedIn', href: 'https://linkedin.com/in/cdsc-2025-scoe' }].map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: '0.75rem', color: '#8a9bb5', textDecoration: 'none', padding: '0.2rem 0', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8a9bb5')}>→ {link.label}</a>
          ))}
        </div>

        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #1a3a6b, #112240)', border: '1px solid rgba(201,168,76,0.3)', display: 'grid', placeItems: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#c9a84c', overflow: 'hidden' }}>
            {avatar ? <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8f6f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
            <div style={{ fontSize: '0.68rem', color: isAdmin ? '#c9a84c' : '#8a9bb5' }}>{isAdmin ? '★ Admin' : 'Member'}</div>
          </div>
          <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: '#8a9bb5', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8a9bb5')}>⏻</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 240, flex: 1, padding: '2.5rem 3rem', minHeight: '100vh' }}>

        {/* HOME */}
        {tab === 'home' && (
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: '#c9a84c', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>// Dashboard</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#f8f6f0' }}>Welcome back, {name.split(' ')[0]} 👋</h1>
              <p style={{ color: '#8a9bb5', marginTop: '0.4rem', fontSize: '0.88rem' }}>{profile?.year || 'SCOE'}{profile?.roll_no ? ` · ${profile.roll_no}` : ''}{profile?.bio ? ` · ${profile.bio}` : ''}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
              {[{ label: 'Total Members', value: '119+', icon: '👥' }, { label: 'Active Domains', value: '14', icon: '🗂️' }, { label: 'Your Domains', value: String(domains.length), icon: '⭐' }, { label: 'Resources', value: String(resources.length || '—'), icon: '📚' }].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: '#c9a84c', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: '#8a9bb5', marginTop: '0.3rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8f6f0' }}>📢 Announcements</h2>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: '#8a9bb5' }}>Latest first</span>
                </div>
                {loadingData ? <p style={{ color: '#8a9bb5', fontSize: '0.82rem' }}>Loading...</p> : announcements.length === 0 ? <p style={{ color: '#8a9bb5', fontSize: '0.82rem' }}>No announcements yet.</p> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {announcements.slice(0, 5).map((a, i) => (
                      <div key={a.id} style={{ paddingBottom: '0.85rem', borderBottom: i < 4 ? '1px solid rgba(201,168,76,0.08)' : 'none', display: 'flex', gap: '0.75rem' }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: '#c9a84c', minWidth: 55, paddingTop: '0.15rem' }}>{new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        <div>
                          <span style={{ display: 'inline-block', fontSize: '0.6rem', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 3, padding: '0.1rem 0.4rem', marginBottom: '0.3rem', fontFamily: "'DM Mono', monospace" }}>{a.tag}</span>
                          <p style={{ fontSize: '0.85rem', fontWeight: 500, color: '#f8f6f0', marginBottom: '0.2rem' }}>{a.title}</p>
                          <p style={{ fontSize: '0.78rem', color: '#8a9bb5', lineHeight: 1.6 }}>{a.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, padding: '1.5rem' }}>
                  <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8f6f0', marginBottom: '1rem' }}>🚀 Quick Links</h2>
                  {[{ label: 'Telegram', href: 'https://t.me/+95_1-Gf6UiUwMGE9', icon: '✈️' }, { label: 'WhatsApp', href: 'https://chat.whatsapp.com/CzniCBDSjHY2OVTRespdiO', icon: '💬' }, { label: 'YouTube', href: 'https://youtube.com/@CDSCSCOE', icon: '▶️' }, { label: 'GitHub', href: 'https://github.com/cdscscoe', icon: '💻' }].map(link => (
                    <a key={link.label} href={link.href} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.75rem', borderRadius: 6, textDecoration: 'none', fontSize: '0.82rem', color: '#8a9bb5', transition: 'all 0.15s', marginBottom: '0.15rem' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)'; (e.currentTarget as HTMLElement).style.color = '#c9a84c' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#8a9bb5' }}>
                      {link.icon} {link.label}
                    </a>
                  ))}
                </div>
                {domains.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, padding: '1.25rem' }}>
                    <h2 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8f6f0', marginBottom: '0.75rem' }}>⭐ Your Domains</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {domains.slice(0, 5).map((d: string) => (
                        <span key={d} style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 3, color: '#c9a84c', fontFamily: "'DM Mono', monospace" }}>{DOMAIN_ICONS[d] || '📌'} {d.split(' ')[0]}</span>
                      ))}
                      {domains.length > 5 && <span style={{ fontSize: '0.7rem', color: '#8a9bb5' }}>+{domains.length - 5}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RESOURCES */}
        {tab === 'resources' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: '#c9a84c', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>// Knowledge Hub</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#f8f6f0' }}>Resources & Study Material</h1>
            </div>
            {loadingData ? <p style={{ color: '#8a9bb5' }}>Loading...</p> : resources.length === 0 ? <p style={{ color: '#8a9bb5' }}>No resources yet. Check back soon!</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {resources.map(r => (
                  <a key={r.id} href={r.url} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, padding: '1.5rem', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#c9a84c'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '1px' }}>{r.domain || 'General'}</span>
                      <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 3, color: '#8a9bb5' }}>{r.type}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8f6f0', lineHeight: 1.4, marginBottom: '0.75rem' }}>{r.title}</div>
                    <div style={{ fontSize: '0.72rem', color: r.is_public ? '#4ade80' : '#8a9bb5' }}>{r.is_public ? '🌐 Public' : '🔒 Members Only'}</div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DIRECTORY */}
        {tab === 'directory' && <MemberDirectory />}

        {/* PROFILE */}
        {tab === 'profile' && profile && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: '#c9a84c', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>// Profile</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#f8f6f0' }}>Edit Your Profile</h1>
              <p style={{ color: '#8a9bb5', marginTop: '0.4rem', fontSize: '0.85rem' }}>Changes save directly to the database.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #1a3a6b, #112240)', border: '2px solid rgba(201,168,76,0.3)', margin: '0 auto 1.25rem', display: 'grid', placeItems: 'center', fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: '#c9a84c', overflow: 'hidden' }}>
                  {avatar ? <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#f8f6f0', marginBottom: '0.3rem' }}>{profile.full_name || 'Your Name'}</div>
                <div style={{ fontSize: '0.78rem', color: '#8a9bb5', marginBottom: '0.75rem' }}>{user.email}</div>
                {profile.bio && <p style={{ fontSize: '0.78rem', color: '#8a9bb5', lineHeight: 1.6, marginBottom: '0.75rem' }}>{profile.bio}</p>}
                <div style={{ display: 'inline-block', fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', color: isAdmin ? '#c9a84c' : '#4ade80', border: `1px solid ${isAdmin ? 'rgba(201,168,76,0.3)' : 'rgba(74,222,128,0.3)'}`, padding: '0.2rem 0.7rem', borderRadius: 3 }}>
                  {isAdmin ? '★ ADMIN' : '✓ MEMBER'}
                </div>
                {(profile.linkedin_url || profile.github_url) && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 3, color: '#c9a84c', textDecoration: 'none' }}>LinkedIn</a>}
                    {profile.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 3, color: '#c9a84c', textDecoration: 'none' }}>GitHub</a>}
                  </div>
                )}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, padding: '2rem' }}>
                <ProfileEditor userId={user.id} initial={profile} onSave={(updated) => setProfile(updated)} />
              </div>
            </div>
          </div>
        )}

        {/* ADMIN */}
        {tab === 'admin' && isAdmin && <AdminPanel adminId={user.id} />}
        {tab === 'admin' && !isAdmin && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#8a9bb5' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
            <p>Admin access required.</p>
          </div>
        )}
      </main>
    </div>
  )
}
