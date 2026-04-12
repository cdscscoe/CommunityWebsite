'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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

// ── design tokens ─────────────────────────────────────────────────────────────
const S = {
  bg:      '#0B0F19',
  bg2:     '#0F1629',
  bg3:     '#131B2E',
  card:    '#161D30',
  card2:   '#1C2540',
  border:  'rgba(255,255,255,0.07)',
  border2: 'rgba(255,255,255,0.12)',
  text:    '#F1F5FF',
  text2:   '#94A3C4',
  text3:   'rgba(148,163,196,0.45)',
  gold:    '#FBBF24',
  gold2:   '#F97316',
  green:   '#4ADE80',
  red:     '#F87171',
  outfit:  "'Outfit', sans-serif",
  mono:    "'DM Mono', monospace",
} as const

export default function DashboardClient({ user }: { user: User }) {
  const [tab, setTab]               = useState<Tab>('home')
  const [profile, setProfile]       = useState<ProfileData | null>(null)
  const [isAdmin, setIsAdmin]       = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [resources, setResources]   = useState<Resource[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) return

        const { data: prof, error } = await supabase
          .from('profiles')
          .select('full_name,year,roll_no,bio,linkedin_url,github_url,domains,is_admin')
          .eq('id', authUser.id)
          .single()

        if (!error && prof) {
          setProfile({ full_name: prof.full_name||'', year: prof.year||'', roll_no: prof.roll_no||'', bio: prof.bio||'', linkedin_url: prof.linkedin_url||'', github_url: prof.github_url||'', domains: prof.domains||[] })
          setIsAdmin(prof.is_admin || false)
        } else {
          const meta = authUser.user_metadata
          const np = { full_name: meta?.full_name||authUser.email?.split('@')[0]||'', year: meta?.year||'', roll_no: meta?.roll_no||'', bio:'', linkedin_url:'', github_url:'', domains: meta?.domains||[] }
          setProfile(np)
          await supabase.from('profiles').insert({ id: authUser.id, full_name: np.full_name, year: np.year, roll_no: np.roll_no, domains: np.domains, avatar_url: meta?.avatar_url })
        }

        const [annRes, resRes] = await Promise.all([
          supabase.from('announcements').select('*').order('created_at',{ascending:false}).limit(10),
          supabase.from('resources').select('*').order('created_at',{ascending:false}),
        ])
        if (annRes.data) setAnnouncements(annRes.data)
        if (resRes.data) setResources(resRes.data)
      } catch (e) { console.error(e) }
      setLoadingData(false)
    }
    load()
  }, [])

  const handleSignOut = async () => { await supabase.auth.signOut(); window.location.href = '/' }

  const name     = profile?.full_name || user.email?.split('@')[0] || 'Member'
  const avatar   = user.user_metadata?.avatar_url || null
  const initials = name.split(' ').map((n:string)=>n[0]).join('').toUpperCase().slice(0,2)
  const domains  = profile?.domains || []

  const navItems: { id:Tab; label:string; adminOnly?:boolean }[] = [
    { id:'home',      label:'Overview'  },
    { id:'resources', label:'Resources' },
    { id:'directory', label:'Directory' },
    { id:'profile',   label:'My Profile'},
    ...(isAdmin?[{id:'admin' as Tab,label:'Admin',adminOnly:true}]:[]),
  ]

  // ── Avatar circle ──────────────────────────────────────────────────────────
  const Av = ({ size=34, radius=9 }:{size?:number;radius?:number}) => (
    <div style={{ width:size, height:size, borderRadius:radius, flexShrink:0, display:'grid', placeItems:'center', overflow:'hidden', background:`linear-gradient(135deg,${S.gold2},${S.gold})`, fontFamily:S.mono, fontWeight:700, fontSize:size*.22+'rem', color:'#0B0F19', letterSpacing:'.04em' }}>
      {avatar ? <img src={avatar} alt={name} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : initials}
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:S.bg, color:S.text, fontFamily:S.outfit, display:'flex', WebkitFontSmoothing:'antialiased' } as React.CSSProperties}>
      <style suppressHydrationWarning>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

        .dsb{position:fixed;top:0;left:0;bottom:0;width:240px;background:${S.bg2};border-right:1px solid ${S.border};display:flex;flex-direction:column;z-index:150;transition:transform .3s cubic-bezier(.16,1,.3,1);}
        .dsb-ov{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);z-index:149;cursor:pointer;}
        .dmain{margin-left:240px;flex:1;min-height:100vh;display:flex;flex-direction:column;}
        .dhambtn{display:none!important;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9px;background:rgba(255,255,255,.05);border:1px solid ${S.border};cursor:pointer;color:${S.text2};}
        @media(max-width:900px){
          .dsb{transform:translateX(-100%);}
          .dsb.open{transform:translateX(0);}
          .dsb-ov.show{display:block!important;}
          .dmain{margin-left:0!important;}
          .dhambtn{display:flex!important;}
        }

        .dnav{width:100%;display:flex;align-items:center;gap:.65rem;padding:.62rem .85rem;border-radius:10px;font-size:.86rem;font-weight:500;color:${S.text2};background:none;border:none;cursor:pointer;text-align:left;font-family:${S.outfit};transition:background .15s,color .15s;margin-bottom:.15rem;}
        .dnav:hover{background:rgba(255,255,255,.05);color:${S.text};}
        .dnav.act{background:rgba(251,191,36,.08);color:${S.gold};border:1px solid rgba(251,191,36,.15);}

        .dtop{position:sticky;top:0;z-index:100;height:60px;padding:0 1.5rem;background:rgba(11,15,25,.94);backdrop-filter:blur(24px);border-bottom:1px solid ${S.border};display:flex;align-items:center;justify-content:space-between;gap:1rem;}

        .dcard{background:${S.card};border:1px solid ${S.border};border-radius:14px;overflow:hidden;}
        .dres{background:${S.card};border:1px solid ${S.border};border-radius:13px;padding:1.1rem 1.25rem;transition:background .2s,transform .2s,border-color .2s;text-decoration:none;display:block;color:inherit;}
        .dres:hover{background:${S.card2};border-color:${S.border2};transform:translateX(3px);}
        .dann{display:flex;gap:.85rem;padding:.9rem 1.1rem;border-bottom:1px solid ${S.border};transition:background .15s;}
        .dann:last-child{border-bottom:none;}
        .dann:hover{background:${S.card2};}
        .dql{display:flex;align-items:center;gap:.55rem;padding:.5rem .75rem;border-radius:9px;font-size:.82rem;color:${S.text2};text-decoration:none;transition:background .15s,color .15s;margin-bottom:.1rem;}
        .dql:hover{background:rgba(255,255,255,.05);color:${S.text};}
        .dchip{font-size:.72rem;padding:.28rem .65rem;border:1px solid rgba(255,255,255,.1);border-radius:8px;color:${S.text2};font-family:${S.mono};transition:border-color .15s,color .15s;}
        .dchip:hover{border-color:${S.border2};color:${S.text};}
        .dsout{width:100%;display:flex;align-items:center;justify-content:center;gap:.45rem;padding:.55rem;border-radius:9px;font-size:.8rem;font-weight:600;color:${S.red};background:rgba(248,113,113,.06);border:1px solid rgba(248,113,113,.14);cursor:pointer;font-family:${S.outfit};transition:background .15s;}
        .dsout:hover{background:rgba(248,113,113,.14);}

        .dpage{padding:2rem 1.5rem 4rem;max-width:980px;}
        @media(min-width:600px){.dpage{padding:2.5rem 2.5rem 4rem;}}
        .g2{display:grid;grid-template-columns:1.6fr 1fr;gap:1.25rem;}
        @media(max-width:720px){.g2{grid-template-columns:1fr;}}
        .gr2{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;}
        @media(max-width:600px){.gr2{grid-template-columns:1fr;}}
        .gp{display:grid;grid-template-columns:1fr 2fr;gap:1.5rem;align-items:start;}
        @media(max-width:700px){.gp{grid-template-columns:1fr;}}
      `}</style>

      {/* overlay */}
      <div className={`dsb-ov${sidebarOpen?' show':''}`} onClick={()=>setSidebarOpen(false)} />

      {/* ── SIDEBAR ── */}
      <aside className={`dsb${sidebarOpen?' open':''}`}>
        <div style={{padding:'1.2rem 1.25rem 1rem',borderBottom:`1px solid ${S.border}`}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'.55rem',textDecoration:'none'}}>
            <span style={{width:8,height:8,borderRadius:'50%',background:S.gold,display:'inline-block',flexShrink:0}}/>
            <span style={{fontFamily:S.mono,fontSize:'.88rem',fontWeight:500,color:S.text,letterSpacing:'.04em'}}>CDSC<span style={{color:S.gold}}>@SCOE</span></span>
          </Link>
        </div>

        <nav style={{flex:1,padding:'.85rem .7rem',overflowY:'auto'}}>
          <div style={{fontFamily:S.mono,fontSize:'.6rem',letterSpacing:'.12em',textTransform:'uppercase',color:S.text3,padding:'.25rem .85rem .5rem'}}>Navigation</div>
          {navItems.map(item=>(
            <button key={item.id} className={`dnav${tab===item.id?' act':''}`} onClick={()=>{setTab(item.id);setSidebarOpen(false)}}>
              {item.label}
              {item.adminOnly && <span style={{marginLeft:'auto',fontFamily:S.mono,fontSize:'.52rem',fontWeight:700,letterSpacing:'.08em',padding:'.15rem .45rem',borderRadius:6,background:'rgba(251,191,36,.12)',border:'1px solid rgba(251,191,36,.25)',color:S.gold}}>ADMIN</span>}
            </button>
          ))}

          <div style={{height:1,background:S.border,margin:'.75rem 0'}}/>
          <div style={{fontFamily:S.mono,fontSize:'.6rem',letterSpacing:'.12em',textTransform:'uppercase',color:S.text3,padding:'.25rem .85rem .5rem'}}>Community</div>
          {[
            {label:'Telegram', href:'https://t.me/+95_1-Gf6UiUwMGE9',                  dot:'#38BDF8'},
            {label:'WhatsApp', href:'https://chat.whatsapp.com/CzniCBDSjHY2OVTRespdiO',dot:'#4ADE80'},
            {label:'YouTube',  href:'https://youtube.com/@CDSCSCOE',                    dot:'#F87171'},
            {label:'LinkedIn', href:'https://linkedin.com/in/cdsc-2025-scoe',           dot:'#60A5FA'},
            {label:'GitHub',   href:'https://github.com/cdscscoe',                      dot:'#94A3C4'},
          ].map(l=>(
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="dql">
              <span style={{width:6,height:6,borderRadius:'50%',background:l.dot,flexShrink:0}}/>
              {l.label}
            </a>
          ))}
        </nav>

        <div style={{padding:'.85rem',borderTop:`1px solid ${S.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:'.7rem',padding:'.6rem .75rem',borderRadius:11,background:'rgba(255,255,255,.03)',border:`1px solid ${S.border}`,marginBottom:'.6rem'}}>
            <Av/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'.82rem',fontWeight:600,color:S.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{name}</div>
              <div style={{fontSize:'.66rem',color:isAdmin?S.gold:S.green,fontFamily:S.mono}}>{isAdmin?'★ Admin':'✓ Member'}</div>
            </div>
          </div>
          <button className="dsout" onClick={handleSignOut}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="dmain">
        {/* Topbar */}
        <div className="dtop">
          <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
            <button className="dhambtn" onClick={()=>setSidebarOpen(v=>!v)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span style={{fontFamily:S.outfit,fontWeight:800,fontSize:'1rem',color:S.text}}>{navItems.find(n=>n.id===tab)?.label??'Dashboard'}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'.35rem',padding:'.3rem .75rem',borderRadius:20,background:'rgba(74,222,128,.08)',border:'1px solid rgba(74,222,128,.18)',fontFamily:S.mono,fontSize:'.66rem',color:S.green}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:S.green,animation:'blink 1.8s ease infinite',display:'inline-block'}}/>
              {isAdmin?'Admin':'Member'}
            </div>
            <Av size={34} radius={9}/>
          </div>
        </div>

        {/* Page */}
        <div className="dpage">

          {/* ── HOME ── */}
          {tab==='home' && (
            <div style={{animation:'fadeUp .5s ease both'}}>
              {/* Welcome card */}
              <div style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:18,padding:'1.6rem',marginBottom:'1.5rem',position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 70% 80% at 100% 0%,rgba(251,191,36,.07),transparent)',pointerEvents:'none'}}/>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',flexWrap:'wrap',marginBottom:'1.25rem',position:'relative'}}>
                  <div>
                    <div style={{fontFamily:S.outfit,fontWeight:800,fontSize:'clamp(1.3rem,4vw,1.75rem)',color:S.text,lineHeight:1.1}}>Hey, {name.split(' ')[0]} 👋</div>
                    <div style={{fontSize:'.87rem',color:S.text2,marginTop:'.4rem',lineHeight:1.65}}>
                      {profile?.year?`${profile.year} Year`:'SCOE'}{profile?.roll_no?` · ${profile.roll_no}`:''}{profile?.bio?` · ${profile.bio}`:''}
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'.4rem',padding:'.35rem .85rem',borderRadius:20,background:'rgba(74,222,128,.08)',border:'1px solid rgba(74,222,128,.18)',fontFamily:S.mono,fontSize:'.66rem',color:S.green,whiteSpace:'nowrap',flexShrink:0}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:S.green,animation:'blink 1.8s ease infinite',display:'inline-block'}}/>
                    {isAdmin?'Admin':'Verified Member'}
                  </div>
                </div>
                {/* Stat strip */}
                <div style={{display:'flex',gap:1,background:S.border,border:`1px solid ${S.border}`,borderRadius:13,overflow:'hidden'}}>
                  {[
                    {n:'119+',l:'Members',   c:S.gold},
                    {n:'13+',  l:'Domains',    c:S.green},
                    {n:String(resources.length||'—'),l:'Resources',c:'#60A5FA'},
                    {n:String(domains.length||'0'), l:'Your Domains',c:'#818CF8'},
                  ].map(s=>(
                    <div key={s.l} style={{flex:1,background:S.bg2,padding:'1rem .75rem',textAlign:'center',minWidth:0}}>
                      <div style={{fontFamily:S.outfit,fontWeight:800,fontSize:'1.5rem',color:s.c,lineHeight:1,marginBottom:'.2rem'}}>{s.n}</div>
                      <div style={{fontFamily:S.mono,fontSize:'.58rem',color:S.text2,letterSpacing:'.06em',textTransform:'uppercase'}}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="g2">
                {/* Announcements */}
                <div className="dcard">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.1rem',borderBottom:`1px solid ${S.border}`}}>
                    <span style={{fontFamily:S.outfit,fontWeight:700,fontSize:'.95rem',color:S.text}}>Announcements</span>
                    <span style={{fontFamily:S.mono,fontSize:'.62rem',color:S.text3}}>Latest first</span>
                  </div>
                  {loadingData
                    ? <div style={{padding:'1.5rem 1.1rem',color:S.text2,fontSize:'.85rem'}}>Loading...</div>
                    : announcements.length===0
                      ? <div style={{padding:'1.5rem 1.1rem',color:S.text2,fontSize:'.85rem'}}>No announcements yet.</div>
                      : announcements.slice(0,5).map((a,i)=>(
                        <div key={a.id} className="dann">
                          <div style={{display:'flex',flexDirection:'column',alignItems:'center',paddingTop:'.35rem',gap:'.2rem',flexShrink:0}}>
                            <span style={{width:9,height:9,borderRadius:'50%',background:i===0?S.green:S.gold,display:'inline-block'}}/>
                          </div>
                          <div style={{flex:1}}>
                            <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.25rem',flexWrap:'wrap'}}>
                              <span style={{fontFamily:S.mono,fontSize:'.58rem',fontWeight:700,letterSpacing:'.07em',padding:'.15rem .5rem',borderRadius:6,background:'rgba(251,191,36,.1)',border:'1px solid rgba(251,191,36,.2)',color:S.gold}}>{a.tag}</span>
                              <span style={{fontFamily:S.mono,fontSize:'.6rem',color:S.text3}}>{new Date(a.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                            </div>
                            <div style={{fontSize:'.88rem',fontWeight:600,color:S.text,marginBottom:'.2rem',lineHeight:1.35}}>{a.title}</div>
                            <div style={{fontSize:'.8rem',color:S.text2,lineHeight:1.65}}>{a.body}</div>
                          </div>
                        </div>
                      ))
                  }
                </div>

                {/* Right */}
                <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                  <div className="dcard" style={{padding:'1rem 1.1rem'}}>
                    <div style={{fontFamily:S.outfit,fontWeight:700,fontSize:'.9rem',color:S.text,marginBottom:'.75rem'}}>Quick Links</div>
                    {[
                      {label:'Telegram', href:'https://t.me/+95_1-Gf6UiUwMGE9',                  dot:'#38BDF8'},
                      {label:'WhatsApp', href:'https://chat.whatsapp.com/CzniCBDSjHY2OVTRespdiO',dot:'#4ADE80'},
                      {label:'YouTube',  href:'https://youtube.com/@CDSCSCOE',                    dot:'#F87171'},
                      {label:'GitHub',   href:'https://github.com/cdscscoe',                      dot:'#94A3C4'},
                    ].map(l=>(
                      <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="dql">
                        <span style={{width:7,height:7,borderRadius:'50%',background:l.dot,flexShrink:0}}/>
                        {l.label}
                      </a>
                    ))}
                  </div>

                  {domains.length>0 && (
                    <div className="dcard" style={{padding:'1rem 1.1rem'}}>
                      <div style={{fontFamily:S.outfit,fontWeight:700,fontSize:'.9rem',color:S.text,marginBottom:'.75rem'}}>Your Domains</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:'.4rem'}}>
                        {domains.slice(0,6).map((d:string)=>(
                          <span key={d} className="dchip">{DOMAIN_ICONS[d]||'📌'} {d.split(' ')[0]}</span>
                        ))}
                        {domains.length>6 && <span style={{fontSize:'.72rem',color:S.text3,padding:'.28rem .4rem'}}>+{domains.length-6} more</span>}
                      </div>
                    </div>
                  )}

                  <div style={{background:'linear-gradient(135deg,rgba(249,115,22,.12),rgba(251,191,36,.08))',border:'1px solid rgba(251,191,36,.18)',borderRadius:14,padding:'1.1rem'}}>
                    <div style={{fontFamily:S.outfit,fontWeight:700,fontSize:'.88rem',color:S.text,marginBottom:'.3rem'}}>Complete your profile</div>
                    <div style={{fontSize:'.78rem',color:S.text2,marginBottom:'.85rem',lineHeight:1.55}}>Add your LinkedIn, GitHub and bio so members can find you.</div>
                    <button onClick={()=>setTab('profile')} style={{display:'inline-flex',alignItems:'center',gap:'.4rem',background:`linear-gradient(90deg,${S.gold2},${S.gold})`,color:'#0B0F19',fontWeight:700,fontSize:'.78rem',padding:'.5rem 1rem',borderRadius:20,border:'none',cursor:'pointer',fontFamily:S.outfit}}>
                      Edit Profile →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── RESOURCES ── */}
          {tab==='resources' && (
            <div style={{animation:'fadeUp .5s ease both'}}>
              <div style={{marginBottom:'1.75rem'}}>
                <div style={{fontFamily:S.mono,fontSize:'.68rem',color:S.text3,letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.4rem'}}>{'//'} Knowledge Hub</div>
                <h1 style={{fontFamily:S.outfit,fontWeight:800,fontSize:'clamp(1.5rem,4vw,2rem)',color:S.text,letterSpacing:'-.025em',lineHeight:1.1}}>Resources & Study Material</h1>
              </div>
              {loadingData
                ? <p style={{color:S.text2}}>Loading...</p>
                : resources.length===0
  ? (
    <div style={{ textAlign:'center' }}>
      <p style={{color:S.text2}}>
        Join the CDSC Telegram channel to access all trusted resources NOW!
      </p>

      <a 
        href="https://t.me/+95_1-Gf6UiUwMGE9" 
        target="_blank" 
        rel="noreferrer"
        style={{
          display:'inline-block',
          marginTop:'.7rem',
          padding:'.4rem .9rem',
          borderRadius:999,
          background:'linear-gradient(90deg,#F97316,#FBBF24)',
          color:'#000',
          fontSize:'.72rem',
          fontWeight:600,
          textDecoration:'none'
        }}
      >
        Join Telegram →
      </a>
    </div>
  )
                  : <div className="gr2">
                    {resources.map(r=>(
                      <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="dres">
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.6rem'}}>
                          <span style={{fontFamily:S.mono,fontSize:'.62rem',color:S.text3,textTransform:'uppercase',letterSpacing:'.08em'}}>{r.domain||'General'}</span>
                          <span style={{fontSize:'.62rem',padding:'.15rem .5rem',border:`1px solid ${S.border2}`,borderRadius:6,color:S.text2,fontFamily:S.mono}}>{r.type}</span>
                        </div>
                        <div style={{fontFamily:S.outfit,fontWeight:700,fontSize:'.92rem',color:S.text,lineHeight:1.4,marginBottom:'.65rem'}}>{r.title}</div>
                        <div style={{fontSize:'.75rem',color:r.is_public?S.green:S.text3,fontFamily:S.mono}}>{r.is_public?'🌐 Public':'🔒 Members Only'}</div>
                      </a>
                    ))}
                  </div>
              }
            </div>
            
          )}

          {/* ── DIRECTORY ── */}
          {tab==='directory' && <MemberDirectory />}

          {/* ── PROFILE ── */}
          {tab==='profile' && profile && (
            <div style={{animation:'fadeUp .5s ease both'}}>
              <div style={{marginBottom:'1.75rem'}}>
                <div style={{fontFamily:S.mono,fontSize:'.68rem',color:S.text3,letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.4rem'}}>{'//'} Profile</div>
                <h1 style={{fontFamily:S.outfit,fontWeight:800,fontSize:'clamp(1.5rem,4vw,2rem)',color:S.text,letterSpacing:'-.025em',lineHeight:1.1}}>Edit Your Profile</h1>
                <p style={{color:S.text2,marginTop:'.4rem',fontSize:'.85rem'}}>Changes saved will be visible to all.</p>
              </div>
              <div className="gp">
                <div className="dcard" style={{padding:'2rem',textAlign:'center'}}>
                  <div style={{width:80,height:80,borderRadius:16,margin:'0 auto 1.25rem',display:'grid',placeItems:'center',overflow:'hidden',background:`linear-gradient(135deg,${S.gold2},${S.gold})`,fontFamily:S.outfit,fontWeight:800,fontSize:'1.6rem',color:'#0B0F19',border:`3px solid ${S.card}`,boxShadow:'0 8px 24px rgba(0,0,0,.4)'}}>
                    {avatar?<img src={avatar} alt={name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:initials}
                  </div>
                  <div style={{fontFamily:S.outfit,fontWeight:800,fontSize:'1.05rem',color:S.text,marginBottom:'.25rem'}}>{profile.full_name||'Your Name'}</div>
                  <div style={{fontSize:'.78rem',color:S.text2,marginBottom:'.75rem'}}>{user.email}</div>
                  {profile.bio&&<p style={{fontSize:'.78rem',color:S.text2,lineHeight:1.6,marginBottom:'.75rem'}}>{profile.bio}</p>}
                  <div style={{display:'inline-block',fontFamily:S.mono,fontSize:'.62rem',color:isAdmin?S.gold:S.green,border:`1px solid ${isAdmin?'rgba(251,191,36,.3)':'rgba(74,222,128,.3)'}`,padding:'.2rem .7rem',borderRadius:6}}>
                    {isAdmin?'★ ADMIN':'✓ MEMBER'}
                  </div>
                  {(profile.linkedin_url||profile.github_url)&&(
                    <div style={{display:'flex',justifyContent:'center',gap:'.5rem',marginTop:'1rem'}}>
                      {profile.linkedin_url&&<a href={profile.linkedin_url} target="_blank" rel="noreferrer" style={{fontSize:'.75rem',padding:'.28rem .75rem',border:`1px solid ${S.border2}`,borderRadius:8,color:S.text2,textDecoration:'none'}}>LinkedIn</a>}
                      {profile.github_url&&<a href={profile.github_url} target="_blank" rel="noreferrer" style={{fontSize:'.75rem',padding:'.28rem .75rem',border:`1px solid ${S.border2}`,borderRadius:8,color:S.text2,textDecoration:'none'}}>GitHub</a>}
                    </div>
                  )}
                </div>
                <div className="dcard" style={{padding:'2rem'}}>
                  <ProfileEditor userId={user.id} initial={profile} onSave={(updated)=>setProfile(updated)}/>
                </div>
              </div>
            </div>
          )}

          {/* ── ADMIN ── */}
          {tab==='admin'&&isAdmin&&<AdminPanel adminId={user.id}/>}
          {tab==='admin'&&!isAdmin&&(
            <div style={{textAlign:'center',padding:'4rem',color:S.text2}}>
              <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🔒</div>
              <p>Admin access required.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}