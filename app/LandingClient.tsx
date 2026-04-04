'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const DOMAINS = [
  { name: 'DSA & Competitive Coding', lead: 'Prasen Bhandari, Prince Thakur', grad: 'linear-gradient(135deg,#38BDF8,#6366F1)', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { name: 'Cybersecurity', lead: 'Dnyaneshwar Shelke', grad: 'linear-gradient(135deg,#F87171,#EF4444)', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { name: 'Machine Learning & AI', lead: 'Sameer Sayyad', grad: 'linear-gradient(135deg,#A3E635,#22C55E)', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg> },
  { name: 'Web Development', lead: 'Shubhangi Raut + 3 others', grad: 'linear-gradient(135deg,#60A5FA,#3B82F6)', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
  { name: 'UI/UX Design', lead: 'Uma Salunke', grad: 'linear-gradient(135deg,#F472B6,#EC4899)', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="#fff"/><circle cx="17.5" cy="10.5" r=".5" fill="#fff"/><circle cx="8.5" cy="7.5" r=".5" fill="#fff"/><circle cx="6.5" cy="12.5" r=".5" fill="#fff"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg> },
  { name: 'Game Development', lead: 'Harshit Sewalikar, Prasen Bhandari', grad: 'linear-gradient(135deg,#C084FC,#A855F7)', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg> },
  { name: 'GATE Preparation', lead: 'Chaitanya Paigude, Mayur Hebade, Prince Thakur', grad: 'linear-gradient(135deg,#FB923C,#F97316)', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
  { name: 'LinkedIn & Resume', lead: 'Chaitanya Paigude', grad: 'linear-gradient(135deg,#38BDF8,#0EA5E9)', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
  { name: 'Digital Marketing', lead: 'Diksha Shinde', grad: 'linear-gradient(135deg,#FBBF24,#F59E0B)', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { name: 'Toppers Talk & Academics', lead: 'Sanket Warole', grad: 'linear-gradient(135deg,#34D399,#10B981)', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { name: 'Calendar & GitHub', lead: 'Mayur Hebade', grad: 'linear-gradient(135deg,#818CF8,#6366F1)', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { name: 'Free Certifications', lead: 'Community Curated', grad: 'linear-gradient(135deg,#A3E635,#84CC16)', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg> },
  { name: 'SQL & Databases', lead: 'Community Curated', grad: 'linear-gradient(135deg,#60A5FA,#818CF8)', svg: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> },
]

const FOUNDERS = [
  { initials: 'CP', name: 'Chaitanya Paigude', role: 'Founder & Vision Lead', domains: 'LinkedIn & Resume · GATE', grad: 'linear-gradient(135deg,#F97316,#FBBF24)', roleColor: '#FBBF24', github: 'https://github.com/Anny-1216', linkedin: 'https://linkedin.com/in/chaitanya-paigude-489689257', founder: true },
  { initials: 'MH', name: 'Mayur Hebade', role: 'Operations & Systems', domains: 'Calendar · GitHub · GATE', grad: 'linear-gradient(135deg,#38BDF8,#60A5FA)', roleColor: '#60A5FA', github: 'https://github.com/', linkedin: 'https://linkedin.com/in/', founder: false },
  {
  initials: 'SR',
  name: 'Shubhangi Raut',
  role: 'Web Dev & Content',
  domains: 'Web Development · Coordination',
  grad: 'linear-gradient(135deg,#34D399,#38BDF8)', 
  roleColor: '#34D399',
  github: 'https://github.com/',
  linkedin: 'https://linkedin.com/in/',
  founder: false
},
{
  initials: 'US',
  name: 'Uma Salunke',
  role: 'Design & Documentation',
  domains: 'UI/UX · Reports',
  grad: 'linear-gradient(135deg, #7F1D1D, #EF4444, #FCA5A5)',
  roleColor: '#FFFFFF',
  github: 'https://github.com/ivy-1602',
  linkedin: 'https://linkedin.com/in/umasalunke7',
  founder: false
}
]

const TIMELINE = [
  { date: 'Oct 13', year: '2025', title: 'Community Founded', desc: 'Four students. One idea. Official email and social handles created the same day.', color: '#F97316', dot: '#F97316' },
  { date: 'Oct 14', year: '2025', title: 'Guidelines Finalized', desc: 'Rules decided, registration form circulated across the department.', color: '#FBBF24', dot: '#FBBF24' },
  { date: 'Oct 19', year: '2025', title: 'Website Live', desc: 'Invites sent personally via email. The community went live.', color: '#4ADE80', dot: '#4ADE80' },
  { date: 'Oct 21', year: '2025', title: 'Daily DSA Challenge', desc: 'First academic engagement — daily problem-solving sessions go live.', color: '#818CF8', dot: '#818CF8' },
  { date: 'Oct 27', year: '2025', title: 'First 1:1 Session', desc: 'On Google Meet. One student helping another. That\'s still what this is about.', color: '#F472B6', dot: '#F472B6' },
  { date: 'Nov 1', year: '2025', title: 'LinkedIn Launch', desc: 'CDSC becomes publicly visible. A real community, not just a chat group.', color: '#38BDF8', dot: '#38BDF8' },
  { date: 'Nov 15', year: '2025', title: 'First YouTube Tutorial', desc: 'LaTeX Resume video published. CDSC enters multimedia content.', color: '#F87171', dot: '#F87171' },
  { date: 'Nov 20', year: '2025', title: 'Multi-Platform', desc: 'Active on YouTube, LinkedIn, GitHub, Twitter, Instagram simultaneously.', color: '#A3E635', dot: '#A3E635' },
  { date: 'Nov 29', year: '2025', title: '119 Members', desc: 'End of Month 2. Not because of promotion — because it worked.', color: '#FBBF24', dot: '#FBBF24' },
  { date: 'Apr 2026', year: 'NOW', title: 'Still Building.', desc: 'Still growing. Still becoming what it\'s meant to be. The story isn\'t over.', color: '#4ADE80', dot: '#4ADE80', present: true },
]

const RESOURCES = [
  {
    tag: 'MACHINE LEARNING',
    title: 'Backpropagation & Deep Learning Foundations',
    meta: null,
    locked: true,
    tagGrad: 'linear-gradient(90deg,#60A5FA,#818CF8)',
    accent: '#60A5FA',
    url: '#',
    thumbnail: null,
  },
  {
    tag: 'YOUTUBE TUTORIAL',
    title: 'Make a Professional Resume in Under 9 Minutes, LaTeX + Overleaf',
    meta: { time: '8:56 min', views: '124 views    Creator: Chaitanya Paigude' },
    locked: false,
    tagGrad: 'linear-gradient(90deg,#F87171,#F97316)',
    accent: '#F97316',
    url: 'https://www.youtube.com/watch?v=HlUQMY1PdFM',
    thumbnail: 'https://i.ytimg.com/vi/HlUQMY1PdFM/maxresdefault.jpg',
  },
  {
    tag: 'UI/UX DESIGN',
    title: 'Basics of UI/UX 101 — Breakdown ft. Spotify',
    meta: { time: '9:25 min', views: '77 views Creator: Uma Salunke' },
    locked: false,
    tagGrad: 'linear-gradient(90deg,#F472B6,#A855F7)',
    accent: '#F472B6',
    url: 'https://www.youtube.com/watch?v=r_D0M--2cN0',
    thumbnail: 'https://i.ytimg.com/vi/r_D0M--2cN0/maxresdefault.jpg',
  },
  {
    tag: 'GITHUB TUTORIAL',
    title: 'Create Your First GitHub Account — Step by Step',
    meta: { time: '4:15 min', views: '48 views Creator: Mayou Hebade' },
    locked: false,
    tagGrad: 'linear-gradient(90deg,#34D399,#38BDF8)',
    accent: '#34D399',
    url: 'https://www.youtube.com/watch?v=VRNu2WTeVxM',
    thumbnail: 'https://i.ytimg.com/vi/VRNu2WTeVxM/maxresdefault.jpg',
  },
  {
    tag: 'MACHINE LEARNING',
    title: 'PyTorch 101 — Getting Started Guide',
    meta: null,
    locked: true,
    tagGrad: 'linear-gradient(90deg,#60A5FA,#818CF8)',
    accent: '#60A5FA',
    url: '#',
    thumbnail: null,
  },
  {
    tag: 'WEB DEVELOPMENT',
    title: 'Structured Beginner Roadmap for Web Development',
    meta: null,
    locked: true,
    tagGrad: 'linear-gradient(90deg,#38BDF8,#60A5FA)',
    accent: '#38BDF8',
    url: '#',
    thumbnail: null,
  },
]

const FAQ = [
  { q: 'Is it actually free?', a: 'Yes. Completely free. No fees, no subscriptions, no hidden conditions — just a space to learn, build, and grow.' },
  { q: 'How do I apply?', a: 'Click on "Apply",  fill out the form — it\'s two minutes. Name, year, roll number, what you\'re interested in. That\'s it.' },
  { q: 'What happens after I apply?', a: 'We review and verify within 48 hours. You\'ll get an email with your member credentials and full dashboard access.' },
  { q: 'Is CDSC recognized by the college?', a: 'CDSC operates as a structured, student-led initiative within the department. It works alongside the academic environment to support learning, collaboration, and growth.' },
  { q: 'How active is it, really?', a: 'As active as YOU want it to be. With people showing up and contributing.' },
]

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ic = {
  github: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
  linkedin: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  mail: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  lock: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  play: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  link: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  plus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  clock: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  eye: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  yt: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
  ig: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  tw: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
}

// ─── ANIMATED PARTICLE CANVAS ─────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animId: number
    let w = 0, h = 0
    const PARTICLE_COUNT = 55
    interface P { x: number; y: number; vx: number; vy: number; r: number; alpha: number; hue: number; pulse: number; pulseSpeed: number }
    let particles: P[] = []
    const resize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w
      canvas.height = h
    }
    const init = () => {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.35 + 0.08,
        hue: [220, 200, 270, 160, 45][Math.floor(Math.random() * 5)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.018 + 0.006,
      }))
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        p.pulse += p.pulseSpeed
        const alphaActual = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},80%,70%,${alphaActual})`
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.x < -4) p.x = w + 4
        if (p.x > w + 4) p.x = -4
        if (p.y < -4) p.y = h + 4
        if (p.y > h + 4) p.y = -4
      })
      // Draw subtle connecting lines for nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    resize()
    init()
    draw()
    window.addEventListener('resize', () => { resize(); init() })
    return () => { cancelAnimationFrame(animId) }
  }, [])
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  )
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function LandingClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)

    observerRef.current = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          const delay = (e.target as HTMLElement).dataset.delay
          if (delay) (e.target as HTMLElement).style.transitionDelay = delay
        }
      }),
      { threshold: 0.07 }
    )
    document.querySelectorAll('.rev').forEach(el => observerRef.current?.observe(el))
    return () => { window.removeEventListener('scroll', onScroll); observerRef.current?.disconnect() }
  }, [])

  return (
    <div id="app">
      <style suppressHydrationWarning>{`
        #app{background:var(--bg);color:var(--text);font-family:var(--sans);overflow-x:hidden;-webkit-font-smoothing:antialiased;font-weight: 500;}
        /* ── GRAIN OVERLAY ── */
        #app::before{
          content:'';
          position:fixed;inset:0;z-index:1000;pointer-events:none;
          opacity:.022;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size:180px 180px;
          mix-blend-mode:overlay;
        }

        /* ── SCROLL REVEAL ── */
        .rev{opacity:0;transform:translateY(28px);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1);}
        .rev.in{opacity:1;transform:none;}
        .rev-left{opacity:0;transform:translateX(-28px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1);}
        .rev-left.in{opacity:1;transform:none;}
        .rev-right{opacity:0;transform:translateX(28px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1);}
        .rev-right.in{opacity:1;transform:none;}
        .rev-scale{opacity:0;transform:scale(.94);transition:opacity .65s cubic-bezier(.16,1,.3,1),transform .65s cubic-bezier(.16,1,.3,1);}
        .rev-scale.in{opacity:1;transform:none;}

        /* ── KEYFRAMES ── */
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        @keyframes fadeDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}

        /* ── ORB ANIMATIONS ── */
        @keyframes orbFloat1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(40px,-30px) scale(1.08)}66%{transform:translate(-20px,20px) scale(.95)}}
        @keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-50px,30px) scale(1.1)}70%{transform:translate(30px,-20px) scale(.92)}}
        @keyframes orbFloat3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(25px,40px) scale(1.05)}}
        @keyframes orbFloat4{0%,100%{transform:translate(0,0) scale(1)}45%{transform:translate(-35px,-25px) scale(1.12)}80%{transform:translate(20px,15px) scale(.96)}}
        @keyframes orbFloat5{0%,100%{transform:translate(0,0) scale(1)}30%{transform:translate(45px,20px) scale(1.07)}70%{transform:translate(-15px,-35px) scale(.94)}}

        /* ── AURORA SHIFT ── */
        @keyframes auroraShift{
          0%{background-position:0% 50%}
          50%{background-position:100% 50%}
          100%{background-position:0% 50%}
        }

        /* ── SHIMMER ON HERO HEADLINE ── */
        @keyframes shimmer{
          0%{background-position:200% center}
          100%{background-position:-200% center}
        }

        /* ── GLOW PULSE ── */
        @keyframes glowPulse{
          0%,100%{opacity:.3;transform:scale(1)}
          50%{opacity:.6;transform:scale(1.06)}
        }
        @keyframes glowPulse2{
          0%,100%{opacity:.25;transform:scale(1)}
          50%{opacity:.5;transform:scale(1.08)}
        }
        @keyframes glowPulse3{
          0%,100%{opacity:.2;transform:scale(1)}
          60%{opacity:.45;transform:scale(1.1)}
        }

        /* ── NAV ── */
        #nav{
          position:fixed;top:0;left:0;right:0;z-index:200;
          height:64px;padding:0 1.5rem;
          display:flex;align-items:center;justify-content:space-between;
          transition:background .3s,border-color .3s,box-shadow .3s;
          border-bottom:1px solid transparent;
        }
        #nav.scrolled{background:rgba(11,15,25,.92);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border-color:var(--border);box-shadow:0 4px 40px rgba(0,0,0,.35),0 0 0 1px rgba(99,102,241,.04);}
        .nav-logo{font-family:var(--mono);font-size:.92rem;font-weight:500;color:var(--text);text-decoration:none;letter-spacing:.04em;display:flex;align-items:center;gap:.5rem;}
        .nav-logo-dot{width:8px;height:8px;border-radius:50%;background:var(--gold);animation:glowPulse 2.5s ease-in-out infinite;box-shadow:0 0 6px rgba(251,191,36,.6);}
        .nav-logo span{color:var(--gold);}
        .nav-links{display:flex;align-items:center;gap:.25rem;}
        .nav-link{font-size:.82rem;font-weight:500;color:var(--text2);text-decoration:none;padding:.4rem .75rem;border-radius:6px;transition:color .15s,background .15s;}
        .nav-link:hover{color:var(--text);background:rgba(255,255,255,.06);}
        .nav-right{display:flex;align-items:center;gap:.75rem;}
        .nav-signin{font-size:.82rem;color:var(--text2);text-decoration:none;transition:color .15s;}
        .nav-signin:hover{color:var(--text);}
        .nav-btn{
          background:linear-gradient(90deg,#F97316,#FBBF24);color:#0B0F19;
          font-weight:700;font-size:.82rem;padding:.55rem 1.2rem;
          border-radius:20px;text-decoration:none;
          display:inline-flex;align-items:center;gap:.4rem;min-height:38px;
          transition:opacity .15s,transform .1s,box-shadow .2s;
          box-shadow:0 2px 16px rgba(249,115,22,.3);
        }
        .nav-btn:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 4px 28px rgba(249,115,22,.5);}
        .nav-mobile-btn{display:none;background:none;border:none;cursor:pointer;color:var(--text);padding:.25rem;}

        /* mobile nav */
        #mobile-menu{
          position:fixed;inset:0;z-index:190;
          background:rgba(11,15,25,.98);backdrop-filter:blur(20px);
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;
          transform:translateY(-100%);transition:transform .35s cubic-bezier(.16,1,.3,1);
        }
        #mobile-menu.open{transform:translateY(0);}
        .mob-link{font-family:var(--outfit);font-size:2rem;font-weight:800;color:var(--text2);text-decoration:none;transition:color .15s;}
        .mob-link:hover{color:var(--text);}

        @media(max-width:820px){
          .nav-links{display:none;}
          .nav-signin{display:none;}
          .nav-mobile-btn{display:flex;}
        }

        /* ── HERO ── */
        #hero{
          min-height:100vh;padding:6rem 1.5rem 4rem;
          display:flex;flex-direction:column;justify-content:center;align-items:center;
          text-align:center;position:relative;overflow:hidden;
          background:var(--bg);
        }

        /* Aurora background band */
        #hero-aurora{
          position:absolute;inset:0;pointer-events:none;z-index:0;
          background:
            radial-gradient(ellipse 120% 80% at 50% -20%, rgba(99,102,241,.45) 0%, transparent 55%),
            radial-gradient(ellipse 70% 55% at 80% 90%, rgba(251,191,36,.18) 0%, transparent 50%),
            radial-gradient(ellipse 55% 45% at 10% 65%, rgba(56,189,248,.16) 0%, transparent 48%),
            radial-gradient(ellipse 40% 35% at 90% 20%, rgba(244,114,182,.15) 0%, transparent 45%),
            radial-gradient(ellipse 50% 40% at 30% 80%, rgba(74,222,128,.12) 0%, transparent 45%);
          animation:auroraShift 18s ease-in-out infinite;
          background-size:200% 200%;
        }

        /* Deep center glow */
        #hero-glow-center{
          position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);
          width:900px;height:700px;pointer-events:none;z-index:0;
          background:radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,.28) 0%, transparent 70%);
          animation:glowPulse 6s ease-in-out infinite;
        }

        .hero-grid{
          position:absolute;inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);
          background-size:44px 44px;
          mask-image:radial-gradient(ellipse 80% 60% at 50% 40%,black,transparent);
          pointer-events:none;z-index:0;
        }

        /* ── SEC GRID — reused across sections ── */
        .sec-grid{
          position:absolute;inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);
          background-size:44px 44px;
          pointer-events:none;z-index:0;
          mask-image:radial-gradient(ellipse 85% 65% at 50% 40%,black,transparent);
          -webkit-mask-image:radial-gradient(ellipse 85% 65% at 50% 40%,black,transparent);
        }

        /* Floating orbs — much more present than before */
        .orb{position:absolute;border-radius:50%;pointer-events:none;will-change:transform;}
        .orb1{
          width:540px;height:540px;
          background:radial-gradient(circle, rgba(99,102,241,.42) 0%, rgba(99,102,241,.12) 50%, transparent 70%);
          filter:blur(52px);
          top:-160px;left:-140px;
          animation:orbFloat1 14s ease-in-out infinite;
        }
        .orb2{
          width:420px;height:420px;
          background:radial-gradient(circle, rgba(251,191,36,.34) 0%, rgba(249,115,22,.14) 50%, transparent 70%);
          filter:blur(44px);
          bottom:60px;right:-100px;
          animation:orbFloat2 18s ease-in-out infinite;
        }
        .orb3{
          width:340px;height:340px;
          background:radial-gradient(circle, rgba(74,222,128,.28) 0%, rgba(56,189,248,.14) 50%, transparent 70%);
          filter:blur(40px);
          bottom:-40px;left:18%;
          animation:orbFloat3 20s ease-in-out infinite;
        }
        .orb4{
          width:300px;height:300px;
          background:radial-gradient(circle, rgba(244,114,182,.28) 0%, transparent 70%);
          filter:blur(38px);
          top:25%;right:8%;
          animation:orbFloat4 16s ease-in-out infinite 2s;
        }
        .orb5{
          width:220px;height:220px;
          background:radial-gradient(circle, rgba(56,189,248,.3) 0%, transparent 70%);
          filter:blur(36px);
          top:60%;left:5%;
          animation:orbFloat5 22s ease-in-out infinite 1s;
        }

        .hero-inner{max-width:820px;position:relative;z-index:1;}
        .hero-pill{
          display:inline-flex;align-items:center;gap:.5rem;
          background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
          border-radius:24px;padding:.4rem 1rem;margin-bottom:2rem;
          font-family:var(--mono);font-size:.72rem;letter-spacing:.08em;color:var(--text2);
          animation:fadeDown .8s cubic-bezier(.16,1,.3,1) both;
          backdrop-filter:blur(8px);
          box-shadow:0 0 0 1px rgba(255,255,255,.04), 0 2px 12px rgba(0,0,0,.2);
        }
        .hero-blink{width:7px;height:7px;border-radius:50%;background:#4ADE80;box-shadow:0 0 6px rgba(74,222,128,.7);animation:blink 1.8s ease infinite;}

        /* Hero h1 with shimmer accent on the gold word */
        .hero-h1{
          font-family:var(--outfit);font-weight:800;
          font-size:clamp(2.8rem,9vw,6.5rem);
          line-height:.97;letter-spacing:-.035em;color:var(--text);
          margin-bottom:1.5rem;
          animation:fadeUp .9s .15s cubic-bezier(.16,1,.3,1) both;
        }
        .hero-h1 .w-gold{
          background:linear-gradient(90deg,#F97316 0%,#FBBF24 30%,#fff 50%,#FBBF24 70%,#F97316 100%);
          background-size:200% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation:shimmer 3.5s linear infinite;
        }
        .hero-h1 .w-green{
          background:linear-gradient(90deg,#34D399,#4ADE80);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .hero-h1 .w-blue{
          background:linear-gradient(90deg,#38BDF8,#818CF8);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .hero-sub{
          font-size:clamp(1rem,2.5vw,1.15rem);color:var(--text2);
          line-height:1.8;max-width:580px;margin:0 auto 2.5rem;font-weight:400;
          animation:fadeUp .9s .3s cubic-bezier(.16,1,.3,1) both;
        }
        .hero-ctas{
          display:flex;gap:.85rem;justify-content:center;flex-wrap:wrap;margin-bottom:3.5rem;
          animation:fadeUp .9s .45s cubic-bezier(.16,1,.3,1) both;
        }
        .btn-main{
          background:linear-gradient(90deg,#F97316,#FBBF24);color:#0B0F19;
          font-weight:700;font-size:.95rem;padding:.95rem 2rem;
          border-radius:28px;text-decoration:none;
          display:inline-flex;align-items:center;gap:.5rem;min-height:52px;
          transition:opacity .2s,transform .2s,box-shadow .25s;
          box-shadow:0 4px 28px rgba(249,115,22,.4), 0 0 0 0 rgba(249,115,22,0);
          position:relative;overflow:hidden;
        }
        .btn-main::after{
          content:'';position:absolute;inset:0;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent);
          transform:translateX(-100%);
          transition:transform .5s ease;
        }
        .btn-main:hover::after{transform:translateX(100%);}
        .btn-main:hover{opacity:.94;transform:translateY(-2px);box-shadow:0 8px 44px rgba(249,115,22,.55);}
        .btn-ghost{
          color:var(--text2);font-size:.95rem;font-weight:500;
          padding:.95rem 1.75rem;border-radius:28px;text-decoration:none;
          display:inline-flex;align-items:center;gap:.5rem;min-height:52px;
          background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
          transition:background .2s,color .2s,transform .2s,border-color .2s;
          backdrop-filter:blur(8px);
        }
        .btn-ghost:hover{background:rgba(255,255,255,.1);color:var(--text);transform:translateY(-1px);border-color:rgba(255,255,255,.2);}
        .hero-stats{
          display:flex;justify-content:center;gap:0;
          background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);
          border-radius:16px;overflow:hidden;max-width:420px;margin:0 auto;
          animation:fadeIn .9s .6s both;
          backdrop-filter:blur(12px);
          box-shadow:0 4px 24px rgba(0,0,0,.2), 0 0 0 1px rgba(255,255,255,.04) inset;
        }
        .hs{flex:1;padding:1.25rem .75rem;border-right:1px solid var(--border);}
        .hs:last-child{border-right:none;}
        .hs-n{font-family:var(--outfit);font-weight:800;font-size:1.9rem;line-height:1;margin-bottom:.3rem;}
        .hs-l{font-size:.7rem;color:var(--text2);font-weight:500;letter-spacing:.04em;text-transform:uppercase;}

        /* ── SEC BASE ── */
        .sec{padding:clamp(4rem,9vw,7rem) 1.5rem;position:relative;}
        .sec-c{max-width:900px;margin:0 auto;position:relative;z-index:1;}
        .pill{
          display:inline-flex;align-items:center;gap:.45rem;
          background:rgba(255,255,255,.06);border:1px solid var(--border2);
          border-radius:24px;padding:.38rem .9rem;
          font-size:.75rem;font-weight:600;color:var(--text2);
          margin-bottom:1.5rem;letter-spacing:.03em;
        }
        .pill-dot{width:6px;height:6px;border-radius:50%;display:inline-block;}
        .sh2{
          font-family:var(--outfit);font-weight:800;
          font-size:clamp(2rem,5.5vw,3.2rem);
          line-height:1.05;letter-spacing:-.03em;
          margin-bottom:.8rem;
        }
        .ssub{font-size:1rem;color:var(--text2);line-height:1.8;max-width:540px;}

        /* ── SECTION AMBIENT GLOWS ── */
        /* Each section has a subtle radial glow that breathes */
        #what::before{
          content:'';position:absolute;top:-80px;left:50%;transform:translateX(-50%);
          width:700px;height:500px;pointer-events:none;
          background:radial-gradient(ellipse 70% 60% at 50% 50%, rgba(249,115,22,.14) 0%, transparent 70%);
          animation:glowPulse2 8s ease-in-out infinite;
        }
        #domains::before{
          content:'';position:absolute;top:0;right:-100px;
          width:600px;height:500px;pointer-events:none;
          background:radial-gradient(ellipse 60% 50% at 60% 40%, rgba(56,189,248,.13) 0%, transparent 70%);
          animation:glowPulse2 10s ease-in-out infinite 2s;
        }
        #team::before{
          content:'';position:absolute;top:0;left:-80px;
          width:600px;height:500px;pointer-events:none;
          background:radial-gradient(ellipse 50% 50% at 30% 50%, rgba(129,140,248,.15) 0%, transparent 70%);
          animation:glowPulse3 12s ease-in-out infinite;
        }
        #timeline::before{
          content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          width:800px;height:700px;pointer-events:none;
          background:radial-gradient(ellipse 50% 40% at 50% 50%, rgba(251,191,36,.12) 0%, transparent 70%);
          animation:glowPulse2 14s ease-in-out infinite 1s;
        }
        #resources::before{
          content:'';position:absolute;bottom:0;right:0;
          width:500px;height:400px;pointer-events:none;
          background:radial-gradient(ellipse 55% 50% at 80% 70%, rgba(244,114,182,.13) 0%, transparent 65%);
          animation:glowPulse3 9s ease-in-out infinite;
        }
        #cta::before{
          content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          width:700px;height:600px;pointer-events:none;
          background:radial-gradient(ellipse 55% 50% at 50% 50%, rgba(99,102,241,.22) 0%, transparent 65%);
          animation:glowPulse 7s ease-in-out infinite;
        }
        #faq::before{
          content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);
          width:600px;height:400px;pointer-events:none;
          background:radial-gradient(ellipse 60% 50% at 50% 30%, rgba(96,165,250,.12) 0%, transparent 65%);
          animation:glowPulse2 11s ease-in-out infinite 3s;
        }

        /* ── WHAT YOU GET ── */
        #what{background:var(--bg2);}
        .what-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09);border-radius:20px;overflow:hidden;margin-top:2.5rem;}
        .wc{
          background:rgba(255,255,255,.035);
          backdrop-filter:blur(20px) saturate(160%);
          -webkit-backdrop-filter:blur(20px) saturate(160%);
          padding:2.25rem 2rem;
          transition:background .25s,transform .25s,box-shadow .25s;
          position:relative;
        }
        .wc:hover{background:rgba(255,255,255,.07);transform:scale(1.01);box-shadow:0 0 0 1px rgba(255,255,255,.1) inset;}
        .wc-num{font-family:var(--mono);font-size:.68rem;color:var(--text3);letter-spacing:.12em;margin-bottom:1.25rem;}
        .wc-bar{width:28px;height:3px;border-radius:2px;margin-bottom:1rem;}
        .wc-t{font-family:var(--outfit);font-weight:700;font-size:1.1rem;color:var(--text);margin-bottom:.65rem;line-height:1.25;}
        .wc-d{font-size:.92rem;color:var(--text2);line-height:1.85;}
        @media(max-width:560px){.what-grid{grid-template-columns:1fr;}}

        /* ── DOMAINS ── */
        #domains{background:var(--bg);}
        .dom-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:2.5rem;}
        .dom-card{
          background:var(--card);border:1px solid var(--border);border-radius:14px;
          padding:1.35rem 1.25rem;
          display:flex;align-items:center;gap:1rem;
          transition:background .2s,border-color .25s,transform .25s,box-shadow .25s;
          cursor:default;position:relative;overflow:hidden;
        }
        .dom-card::before{
          content:'';position:absolute;inset:0;
          background:var(--dg,transparent);opacity:0;
          transition:opacity .3s;border-radius:14px;
        }
        .dom-card:hover::before{opacity:.07;}
        .dom-card:hover{border-color:rgba(255,255,255,.15);transform:translateY(-3px);box-shadow:0 8px 36px rgba(0,0,0,.28);}
        /* subtle glow emanating from the icon on hover */
        .dom-card:hover .dom-icon{box-shadow:0 0 20px rgba(255,255,255,.1);}
        .dom-icon{width:46px;height:46px;border-radius:12px;display:grid;place-items:center;flex-shrink:0;position:relative;z-index:1;transition:box-shadow .3s;}
        .dom-icon svg{width:22px;height:22px;}
        .dom-body{position:relative;z-index:1;}
        .dom-name{font-weight:700;font-size:.9rem;color:var(--text);margin-bottom:.2rem;line-height:1.3;}
        .dom-lead{font-size:.78rem;color:var(--text2);}
        @media(max-width:560px){.dom-grid{grid-template-columns:1fr;}}

        /* ── TEAM ── */
        #team{background:var(--bg2);}
        .team-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem;margin-top:2.5rem;}
        .tc{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:0;overflow:hidden;position:relative;transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s;}
        .tc:hover{transform:translateY(-5px);box-shadow:0 16px 48px rgba(0,0,0,.4);}
        .tc-banner{height:80px;position:relative;display:flex;align-items:flex-end;padding:0 1.5rem;}
        .tc-av{width:72px;height:72px;border-radius:14px;display:grid;place-items:center;font-family:var(--outfit);font-weight:800;font-size:1.35rem;color:#fff;position:absolute;bottom:-28px;left:1.5rem;box-shadow:0 6px 24px rgba(0,0,0,.4);letter-spacing:.04em;border:3px solid var(--card);}
        .tc-badge{position:absolute;top:.75rem;right:.75rem;background:var(--gold);color:#0B0F19;font-family:var(--mono);font-size:.58rem;font-weight:700;letter-spacing:.08em;padding:.2rem .55rem;border-radius:20px;}
        .tc-body{padding:2.5rem 1.5rem 1.5rem;}
        .tc-name{font-family:var(--outfit);font-weight:800;font-size:1.05rem;color:var(--text);margin-bottom:.25rem;}
        .tc-role{font-weight:600;font-size:.82rem;margin-bottom:.2rem;}
        .tc-domains{font-family:var(--mono);font-size:.68rem;color:var(--text3);margin-bottom:1.25rem;line-height:1.6;}
        .tc-links{display:flex;gap:.5rem;}
        .tc-link{display:inline-flex;align-items:center;gap:.35rem;font-size:.75rem;font-weight:600;color:var(--text2);text-decoration:none;border:1px solid var(--border2);padding:.35rem .8rem;border-radius:20px;transition:color .15s,background .15s,border-color .15s;}
        .tc-link:hover{background:rgba(255,255,255,.08);color:var(--text);border-color:rgba(255,255,255,.2);}
        @media(max-width:600px){.team-grid{grid-template-columns:1fr;}}

        /* ── TIMELINE ── */
        #timeline{background:var(--bg3);}
        .tl-intro{max-width:900px;margin:0 auto;text-align:center;}
        .tl-track{max-width:700px;margin:3rem auto 0;position:relative;}
        .tl-spine{
          position:absolute;left:50%;top:0;bottom:0;width:2px;
          background:linear-gradient(to bottom,transparent,var(--border2) 8%,var(--border2) 92%,transparent);
          transform:translateX(-50%);
        }
        .tl-item{display:grid;grid-template-columns:1fr 40px 1fr;align-items:start;gap:0;margin-bottom:2.5rem;position:relative;}
        .tl-left{text-align:right;padding-right:1.5rem;padding-top:.2rem;}
        .tl-right{text-align:left;padding-left:1.5rem;padding-top:.2rem;}
        .tl-center{display:flex;flex-direction:column;align-items:center;z-index:2;}
        .tl-dot-wrap{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--bg3);border:2px solid var(--border2);transition:border-color .2s;flex-shrink:0;margin-top:-.1rem;}
        .tl-dot{width:14px;height:14px;border-radius:50%;}
        .tl-date-pill{display:inline-block;border-radius:12px;padding:.2rem .65rem;font-family:var(--mono);font-size:.7rem;font-weight:500;color:#fff;margin-bottom:.5rem;}
        .tl-title{font-family:var(--outfit);font-weight:800;font-size:1rem;color:var(--text);margin-bottom:.35rem;line-height:1.2;}
        .tl-desc{font-size:.83rem;color:var(--text2);line-height:1.75;}
        .tl-year{font-family:var(--mono);font-size:.62rem;color:var(--text3);letter-spacing:.1em;margin-bottom:.3rem;}
        .tl-present-badge{display:inline-flex;align-items:center;gap:.3rem;background:rgba(74,222,128,.15);border:1px solid rgba(74,222,128,.3);border-radius:20px;padding:.2rem .6rem;font-family:var(--mono);font-size:.62rem;font-weight:500;color:#4ADE80;margin-bottom:.4rem;}
        .tl-present-dot{width:5px;height:5px;border-radius:50%;background:#4ADE80;animation:blink 1.8s ease infinite;}
        @media(max-width:600px){
          .tl-spine{left:18px;}
          .tl-track{padding-left:0;}
          .tl-item{grid-template-columns:40px 1fr;grid-template-rows:auto;}
          .tl-center{grid-column:1;grid-row:1;}
          .tl-left,.tl-right{grid-column:2;text-align:left!important;padding-left:1rem;padding-right:0;}
          .tl-empty{display:none;}
          .tl-item:nth-child(odd) .tl-content,.tl-item:nth-child(even) .tl-content{grid-column:2;text-align:left;}
        }

        /* ── RESOURCES ── */
        #resources{background:var(--bg2);}
        .res-list{display:flex;flex-direction:column;gap:1rem;margin-top:2.5rem;}
        .rc{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:1.5rem;transition:background .2s,border-color .2s,transform .2s,box-shadow .2s;}
        .rc:hover{background:var(--card2);border-color:rgba(255,255,255,.13);transform:translateX(4px);box-shadow:0 4px 24px rgba(0,0,0,.2);}
        .rc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:.9rem;}
        .rc-tag{border-radius:20px;padding:.28rem .85rem;font-weight:700;font-size:.7rem;color:#fff;letter-spacing:.06em;}
        .rc-icon{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.07);color:var(--text2);flex-shrink:0;}
        .rc-title{font-family:var(--outfit);font-weight:700;font-size:.95rem;color:var(--text);line-height:1.45;margin-bottom:.75rem;}
        .rc-meta{display:flex;gap:1rem;margin-bottom:.85rem;}
        .rc-mi{display:flex;align-items:center;gap:.35rem;font-size:.8rem;color:var(--text2);}
        .rc-div{height:1px;background:var(--border);margin-bottom:.85rem;}
        .rc-bot{display:flex;align-items:center;justify-content:space-between;}
        .rc-status{font-weight:700;font-size:.88rem;}
        .rc-acts{display:flex;gap:.5rem;}
        .rc-ab{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--text2);text-decoration:none;transition:background .15s;}
        .rc-ab:hover{background:rgba(255,255,255,.12);}
        .unlock-card{
          background:linear-gradient(135deg,rgba(15,22,41,.97),rgba(20,27,48,.95));
          border:1px solid rgba(99,102,241,.2);border-radius:16px;padding:2.5rem 1.5rem;text-align:center;margin-top:1.25rem;
          position:relative;overflow:hidden;
        }
        .unlock-card::before{
          content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,.08) 0%, transparent 70%);
          animation:glowPulse 5s ease-in-out infinite;
        }
        .unlock-icon{font-size:2.5rem;margin-bottom:1rem;color:var(--gold);display:flex;justify-content:center;position:relative;z-index:1;}
        .unlock-h{font-family:var(--outfit);font-weight:800;font-size:1.3rem;color:var(--text);margin-bottom:.5rem;position:relative;z-index:1;}
        .unlock-s{font-size:.9rem;color:var(--text2);margin-bottom:1.5rem;line-height:1.65;max-width:360px;margin-left:auto;margin-right:auto;position:relative;z-index:1;}
        .unlock-btn{background:var(--gold);color:#0B0F19;font-weight:700;font-size:.9rem;padding:.8rem 2rem;border-radius:24px;text-decoration:none;display:inline-block;transition:opacity .15s,transform .15s;position:relative;z-index:1;}
        .unlock-btn:hover{opacity:.9;transform:translateY(-1px);}

        /* ── CTA ── */
        #cta{padding:clamp(4rem,8vw,6rem) 1.5rem;}
        .cta-card{
          max-width:520px;margin:0 auto;
          border:1px solid rgba(255,255,255,.1);border-radius:24px;
          padding:2.75rem 2rem;text-align:center;
          background:rgba(255,255,255,.06);
          backdrop-filter:blur(32px) saturate(200%);
          -webkit-backdrop-filter:blur(32px) saturate(200%);
          box-shadow:
            0 0 120px rgba(99,102,241,.22),
            0 32px 80px rgba(0,0,0,.45),
            0 0 0 1px rgba(255,255,255,.07) inset;
          position:relative;overflow:hidden;
        }
        .cta-card::before{
          content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse 70% 55% at 50% 30%, rgba(99,102,241,.18) 0%, transparent 65%);
          pointer-events:none;
        }
        .cta-pill{display:inline-flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.08);border:1px solid var(--border);border-radius:20px;padding:.4rem .9rem;font-size:.78rem;font-weight:600;color:var(--text2);margin-bottom:1.5rem;position:relative;z-index:1;}
        .cta-h2{font-family:var(--outfit);font-weight:800;font-size:clamp(1.8rem,5vw,2.6rem);line-height:1.05;letter-spacing:-.025em;color:var(--text);margin-bottom:.5rem;position:relative;z-index:1;}
        .cta-members{display:flex;align-items:center;gap:.75rem;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:12px;padding:.9rem 1rem;margin:1.25rem 0 1.75rem;text-align:left;position:relative;z-index:1;}
        .cta-mt{font-size:.9rem;color:var(--text2);line-height:1.45;}
        .cta-mt strong{color:var(--text);}
        .btn-cta{display:flex;align-items:center;justify-content:center;gap:.5rem;background:linear-gradient(90deg,#F97316,#FBBF24);color:#0B0F19;font-weight:700;font-size:.95rem;padding:.95rem 1.5rem;border-radius:28px;text-decoration:none;min-height:52px;margin-bottom:.85rem;transition:opacity .15s,transform .15s,box-shadow .2s;box-shadow:0 4px 20px rgba(249,115,22,.35);position:relative;z-index:1;overflow:hidden;}
        .btn-cta::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);transform:translateX(-100%);transition:transform .5s ease;}
        .btn-cta:hover::after{transform:translateX(100%);}
        .btn-cta:hover{opacity:.92;transform:translateY(-1px);box-shadow:0 8px 36px rgba(249,115,22,.5);}
        .btn-cta2{display:flex;align-items:center;justify-content:center;gap:.5rem;background:rgba(255,255,255,.07);color:var(--text);font-weight:600;font-size:.9rem;padding:.85rem 1.5rem;border-radius:28px;text-decoration:none;min-height:48px;border:1px solid var(--border2);transition:background .15s;position:relative;z-index:1;}
        .btn-cta2:hover{background:rgba(255,255,255,.12);}
        .cta-note{font-family:var(--mono);font-size:.67rem;color:var(--text3);margin-top:1.1rem;letter-spacing:.06em;position:relative;z-index:1;}

        /* ── FAQ ── */
        #faq{background:var(--bg3);}
        .faq-h2{font-family:var(--outfit);}
        .faq-item{border-bottom:1px solid var(--border);}
        .faq-btn{width:100%;background:none;border:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding:1.4rem 0;gap:1rem;min-height:56px;font-family:var(--sans);font-size:1rem;font-weight:600;color:var(--text);text-align:left;transition:color .15s;}
        .faq-btn:hover{color:var(--gold);}
        .faq-ico{flex-shrink:0;width:24px;height:24px;border-radius:50%;border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;color:var(--text3);transition:transform .25s,background .2s,border-color .2s,color .2s;}
        .faq-btn[aria-expanded=true] .faq-ico{transform:rotate(45deg);background:var(--gold);border-color:var(--gold);color:#0B0F19;}
        .faq-ans{max-height:0;overflow:hidden;transition:max-height .38s cubic-bezier(.16,1,.3,1);}
        .faq-ans.open{max-height:180px;}
        .faq-ans p{font-size:.95rem;color:var(--text2);line-height:1.9;padding-bottom:1.4rem;}

        /* ── FOOTER ── */
        #footer{padding:clamp(2.5rem,5vw,3.5rem) 1.5rem;border-top:1px solid var(--border);background:var(--bg);}
        .ft-inner{max-width:900px;margin:0 auto;}
        .ft-top{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:2.5rem;margin-bottom:2rem;}
        .ft-logo{font-family:var(--mono);font-size:.9rem;color:var(--text);letter-spacing:.04em;margin-bottom:.4rem;}
        .ft-logo span{color:var(--gold);}
        .ft-desc{font-size:.85rem;color:var(--text2);line-height:1.7;margin-bottom:.75rem;}
        .ft-email{font-family:var(--mono);font-size:.78rem;color:var(--gold);text-decoration:none;}
        .ft-lbl{font-size:.68rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--text3);margin-bottom:.85rem;}
        .ft-link{display:block;font-size:.88rem;color:var(--text2);text-decoration:none;margin-bottom:.45rem;transition:color .15s;}
        .ft-link:hover{color:var(--text);}
        .ft-socs{display:flex;gap:.55rem;flex-wrap:wrap;margin-top:.85rem;}
        .ft-soc{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.05);border:1px solid var(--border);color:var(--text2);text-decoration:none;transition:background .15s,color .15s,transform .15s,box-shadow .15s;}
        .ft-soc:hover{background:rgba(255,255,255,.1);color:var(--text);transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.3);}
        .ft-bottom{border-top:1px solid var(--border);padding-top:1.5rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:.75rem;}
        .ft-copy{font-size:.8rem;color:var(--text3);}
        @media(max-width:640px){
          .ft-top{grid-template-columns:1fr;gap:2rem;}
          #nav{padding:0 1rem;}
          .sec{padding-left:1rem;padding-right:1rem;}
        }
      `}</style>

      {/* ── MOBILE MENU ── */}
      <div id="mobile-menu" className={mobileNav ? 'open' : ''}>
        {[['Domains','#domains'],['Team','#team'],['Timeline','#timeline'],['Resources','#resources'],['Contact','#cta']].map(([l,h])=>(
          <a key={l} href={h} className="mob-link" onClick={()=>setMobileNav(false)}>{l}</a>
        ))}
        <Link href="/auth/signup" className="btn-main" style={{marginTop:'1rem'}} onClick={()=>setMobileNav(false)}>Apply Free</Link>
      </div>

      {/* ── NAV ── */}
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <a href="/" className="nav-logo">
          <span className="nav-logo-dot"/>
          CDSC<span>@SCOE</span>
        </a>
        <div className="nav-links">
          {[['Domains','#domains'],['Team','#team'],['Timeline','#timeline'],['Resources','#resources'],['Know More','#what']].map(([l,h])=>(
            <a key={l} href={h} className="nav-link">{l}</a>
          ))}
        </div>
        <div className="nav-right">
          <Link href="/auth/login" className="nav-signin">Sign In</Link>
          <Link href="/auth/signup" className="nav-btn">Apply{Ic.arrow}</Link>
          <button className="nav-mobile-btn" onClick={()=>setMobileNav(v=>!v)}>
            {mobileNav ? Ic.close : Ic.menu}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero">
        <div id="hero-aurora" />
        <div id="hero-glow-center" />
        <div className="hero-grid" />
        {/* Animated orbs — more, bigger, more alive */}
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="orb orb4" />
        <div className="orb orb5" />
        {/* Particle field */}
        <ParticleCanvas />
        <div className="hero-inner">
          <div className="hero-pill">
            <span className="hero-blink" />
            Est. October 2025 · SCOE, Pune · Computer Engineering
          </div>
          <h1 className="hero-h1">
            Find your community.<br />
            Build your path.<br />
            <span className="w-gold">@CDSC</span>
          </h1>
          <p className="hero-sub">
           CDSC@SCOE is a space built by the students and for the students those are still figuring things out, one step at a time.</p>
          <div className="hero-ctas">
            <Link href="/auth/signup" className="btn-main">Apply for Membership</Link>
            <a href="#domains" className="btn-ghost">See what we're building {Ic.arrow}</a>
          </div>
          <div className="hero-stats">
            {[{n:'119+',l:'Members',c:'#FBBF24'},{n:'13+',l:'Domains',c:'#4ADE80'},{n:'Trusted',l:'Resources',c:'#60A5FA'}].map(s=>(
              <div key={s.l} className="hs">
                <div className="hs-n" style={{color:s.c}}>{s.n}</div>
                <div className="hs-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section id="what" className="sec">
        <div className="sec-grid" />
        <div className="sec-c">
          <div className="rev" style={{textAlign:'center'}}>
            <div className="pill" style={{margin:'0 auto 1.5rem'}}><span className="pill-dot" style={{background:'#F97316'}}/>What you actually get out of this</div>
            <h2 className="sh2">A community that stays.<br /><span style={{background:'linear-gradient(90deg,#F97316,#FBBF24)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>It’s built to keep going.</span></h2>
            <p className="ssub" style={{margin:'.75rem auto 0'}}>CDSC is the first ever student-led community initiative @SCOE</p>
          </div>
          <div className="what-grid rev" data-delay=".1s">
            {[
              {num:'01',t:'People who actually respond.',d:'Doubt sessions, mentors from the year above. Connections with alumini students.',c:'#F97316'},
              {num:'02',t:'Projects without silos.',d:'Work across years, specializations, and domains. The best ideas happen when a second-year and a final-year solve the same problem.',c:'#4ADE80'},
              {num:'03',t:'Resources you can trust.',d:'Notes, roadmaps, certifications — curated by people who\'ve used them. Not aggregated from Reddit at 2am before exams.',c:'#60A5FA'},
              {num:'04',t:'Career clarity, early.',d:'LinkedIn reviews, resume critiques, GATE prep, placement strategy. The things you\'ll wish someone told you in your first year.',c:'#F472B6'},
            ].map(w=>(
              <div key={w.num} className="wc">
                <div className="wc-num">{w.num}</div>
                <div className="wc-bar" style={{background:w.c}} />
                <div className="wc-t">{w.t}</div>
                <div className="wc-d">{w.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOMAINS ── */}
      <section id="domains" className="sec">
        <div className="sec-grid" />
        <div className="sec-c">
          <div className="rev" style={{textAlign:'center'}}>
            <div className="pill" style={{margin:'0 auto 1.5rem'}}><span className="pill-dot" style={{background:'#4ADE80'}}/>13 Active Tracks</div>
            <h2 className="sh2">Explore Our <span style={{background:'linear-gradient(90deg,#34D399,#38BDF8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Domains</span></h2>
            <p className="ssub" style={{margin:'.75rem auto 0'}}>Each domain is led by passionate students dedicated to helping you grow.</p>
          </div>
          <div className="dom-grid">
            {DOMAINS.map((d,i)=>(
              <div key={i} className="dom-card rev" data-delay={`${(i%4)*.06}s`} style={{'--dg':d.grad} as React.CSSProperties}>
                <div className="dom-icon" style={{background:d.grad}}>{d.svg}</div>
                <div className="dom-body">
                  <div className="dom-name">{d.name}</div>
                  <div className="dom-lead">{d.lead}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="rev" style={{textAlign:'center',marginTop:'1.5rem',fontSize:'.9rem',color:'var(--text2)'}}>
            Can't find your interest? We're always expanding.{' '}
            <a href="mailto:cdscscoe@gmail.com" style={{color:'var(--gold)',fontWeight:600,textDecoration:'none'}}>Suggest a domain</a>
          </p>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="team" className="sec" style={{background:'var(--bg2)',paddingBottom:'3.5rem'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div className="rev" style={{textAlign:'center',paddingBottom:'2rem'}}>
            <div className="pill" style={{margin:'0 auto 1rem'}}><span className="pill-dot" style={{background:'#818CF8'}}/>Core Founding Team</div>
            <h2 className="sh2">The People <span style={{background:'linear-gradient(90deg,#818CF8,#60A5FA)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>building it.</span></h2>
            <p className="ssub" style={{margin:'.5rem auto 0'}}>One step forward.</p>
          </div>
          <div className="rev" data-delay=".08s" style={{
            display:'flex', gap:'1rem',
            padding:'.25rem 1.5rem 1rem',
            overflowX:'auto', scrollSnapType:'x mandatory',
            WebkitOverflowScrolling:'touch',
            msOverflowStyle:'none', scrollbarWidth:'none'
          }}>
            {FOUNDERS.map((f,i)=>(
              <div key={i} style={{
                flex:'0 0 280px', scrollSnapAlign:'start',
                background:'rgba(255,255,255,0.05)',
                backdropFilter:'blur(24px) saturate(180%)',
                WebkitBackdropFilter:'blur(24px) saturate(180%)',
                border:'1px solid rgba(255,255,255,0.09)',
                boxShadow:'0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05) inset',
                borderRadius:18, overflow:'hidden', position:'relative',
                transition:'transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s, border-color .3s',
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.cssText+='transform:translateY(-4px) scale(1.02);box-shadow:0 24px 64px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.14) inset;border-color:rgba(255,255,255,0.16);'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';(e.currentTarget as HTMLElement).style.boxShadow='';(e.currentTarget as HTMLElement).style.borderColor='';}}
              >
                <div style={{height:4,background:f.grad}} />
                <div style={{padding:'1.1rem 1.25rem 1.25rem'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'.85rem',marginBottom:'.9rem'}}>
                    <div style={{
                      width:52,height:52,borderRadius:13,
                      background:f.grad,flexShrink:0,
                      display:'grid',placeItems:'center',
                      fontFamily:'var(--mono)',fontWeight:800,fontSize:'1rem',
                      color:'#fff',letterSpacing:'.04em',position:'relative'
                    }}>
                      {f.initials}
                      {f.founder && (
                        <span style={{
                          position:'absolute',top:-6,right:-2,
                          background:'var(--gold)',color:'#0B0F19',
                          fontFamily:'var(--mono)',fontSize:'.48rem',fontWeight:700,
                          letterSpacing:'.08em',padding:'.18rem .38rem',borderRadius:8,lineHeight:1
                        }}>FOUNDER</span>
                      )}
                    </div>
                    <div style={{minWidth:0}}>
                      <div style={{fontFamily:'var(--outfit)',fontWeight:800,fontSize:'.95rem',color:'var(--text)',marginBottom:'.18rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{f.name}</div>
                      <div style={{fontSize:'.72rem',fontWeight:600,color:f.roleColor}}>{f.role}</div>
                    </div>
                  </div>
                  <div style={{height:1,background:'var(--border)',margin:'.85rem 0'}} />
                  <div style={{fontFamily:'var(--mono)',fontSize:'.68rem',color:'var(--text3)',lineHeight:1.55,marginBottom:'.9rem'}}>{f.domains}</div>
                  <div style={{display:'flex',gap:'.45rem'}}>
                    {[['linkedin',f.linkedin,Ic.linkedin],['github',f.github,Ic.github]].map(([k,href,icon])=>(
                      <a key={k as string} href={href as string} target="_blank" rel="noreferrer" style={{
                        flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'.3rem',
                        fontSize:'.72rem',fontWeight:600,color:'var(--text2)',textDecoration:'none',
                        background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',
                        borderRadius:10,padding:'.42rem .5rem',
                        transition:'background .2s,color .2s,border-color .2s'
                      }}
                      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='rgba(255,255,255,.1)';el.style.color='var(--text)';}}
                      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='rgba(255,255,255,.05)';el.style.color='var(--text2)';}}
                      >{icon}{k === 'linkedin' ? 'LinkedIn' : 'GitHub'}</a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{textAlign:'center',fontFamily:'var(--mono)',fontSize:'.65rem',color:'var(--text3)',marginTop:'.5rem',letterSpacing:'.06em'}}>← swipe to explore →</p>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section id="timeline" className="sec">
        <div className="tl-intro rev">
          <div className="pill" style={{margin:'0 auto 1.5rem'}}><span className="pill-dot" style={{background:'#FBBF24'}}/>Our Journey</div>
          <h2 className="sh2" style={{textAlign:'center'}}>From Inception to{' '}
            <span style={{background:'linear-gradient(90deg,#4ADE80,#38BDF8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Impact</span>
          </h2>
          <p className="ssub" style={{textAlign:'center',margin:'.75rem auto 0'}}>Tracking every milestone of our growth</p>
        </div>
        <div className="tl-track">
          <div className="tl-spine" />
          {TIMELINE.map((item,i)=>{
            const isOdd = i % 2 === 0
            const contentSide = (
              <div>
                {item.present && (
                  <div className="tl-present-badge"><span className="tl-present-dot"/>NOW</div>
                )}
                <div className="tl-date-pill" style={{background:item.color}}>{item.date}</div>
                <div className="tl-year" style={{textAlign: isOdd ? 'right' : 'left'}}>{item.year}</div>
                <div className="tl-title">{item.title}</div>
                <div className="tl-desc">{item.desc}</div>
              </div>
            )
            return (
              <div key={i} className="tl-item rev" data-delay={`${i*.04}s`}>
                {isOdd ? (
                  <>
                    <div className="tl-left">{contentSide}</div>
                    <div className="tl-center">
                      <div className="tl-dot-wrap" style={{borderColor:`${item.color}60`}}>
                        <div className="tl-dot" style={{background:item.color,boxShadow:`0 0 10px ${item.color}90`}} />
                      </div>
                    </div>
                    <div className="tl-right" />
                  </>
                ) : (
                  <>
                    <div className="tl-left" />
                    <div className="tl-center">
                      <div className="tl-dot-wrap" style={{borderColor:`${item.color}60`}}>
                        <div className="tl-dot" style={{background:item.color,boxShadow:`0 0 10px ${item.color}90`}} />
                      </div>
                    </div>
                    <div className="tl-right">{contentSide}</div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── RESOURCES ── */}
<section id="resources" className="sec">
  <div className="sec-c">
    <div className="rev" style={{textAlign:'center'}}>
      <div className="pill" style={{margin:'0 auto 1.5rem'}}>{Ic.yt} Learning Hub</div>
      <h2 className="sh2"><span style={{color:'var(--text)'}}>Curated </span><span style={{background:'linear-gradient(90deg,#FBBF24,#F97316)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Resources</span></h2>
      <p className="ssub" style={{margin:'.75rem auto 0'}}>Content to accelerate your learning journey</p>
    </div>
    <div className="res-list rev" data-delay=".1s">
      {RESOURCES.map((r,i)=>(
        <div key={i} className="rc">
          {r.thumbnail && (
            <a href={r.url} target="_blank" rel="noreferrer" style={{display:'block',marginBottom:'.9rem',borderRadius:8,overflow:'hidden',border:'1px solid rgba(255,255,255,.08)',position:'relative'}}>
              <img src={r.thumbnail} alt={r.title} style={{width:'100%',height:'160px',objectFit:'cover',display:'block'}} />
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,.3)',opacity:0,transition:'opacity .2s'}}
                onMouseEnter={e=>(e.currentTarget.style.opacity='1')}
                onMouseLeave={e=>(e.currentTarget.style.opacity='0')}>
                <div style={{width:48,height:48,borderRadius:'50%',background:'rgba(255,255,255,.9)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0B0F19"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
              </div>
            </a>
          )}
          <div className="rc-top">
            <div className="rc-tag" style={{background:r.tagGrad}}>{r.tag}</div>
            <div className="rc-icon" style={{color:r.locked?'var(--text2)':r.accent}}>{r.locked?Ic.lock:Ic.play}</div>
          </div>
          <div className="rc-title">{r.title}</div>
          {r.meta&&(
            <div className="rc-meta">
              {r.meta.time&&<span className="rc-mi">{Ic.clock}{r.meta.time}</span>}
              {r.meta.views&&<span className="rc-mi">{Ic.eye}{r.meta.views}</span>}
            </div>
          )}
          <div className="rc-div"/>
          <div className="rc-bot">
            <div className="rc-status" style={{color:r.locked?'var(--text2)':'#4ADE80'}}>{r.locked?'Members Only':'Public'}</div>
            <div className="rc-acts">
              {!r.locked&&<a href={r.url} target="_blank" rel="noreferrer" className="rc-ab">{Ic.link}</a>}
              {r.locked&&<span className="rc-ab">{Ic.lock}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="unlock-card rev" data-delay=".15s">
      <div className="unlock-icon">{Ic.lock}</div>
      <div className="unlock-h">Unlock All Resources</div>
      <div className="unlock-s">Get access to exclusive members-only content, tutorials, and roadmaps</div>
      <Link href="/auth/signup" className="unlock-btn">Join CDSC@SCOE</Link>
    </div>
  </div>
</section>

      {/* ── CTA ── */}
      <section id="cta" className="sec">
        <div className="cta-card rev">
          <div className="cta-pill">✦ Join the Movement</div>
          <h2 className="cta-h2">Ready to Be Part of<br />Something <span style={{background:'linear-gradient(90deg,#FBBF24,#F97316)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Bigger?</span></h2>
          <div className="cta-members">
            <span style={{color:'var(--text2)',flexShrink:0}}>{Ic.users}</span>
            <span className="cta-mt">Join <strong>119+</strong> verified students already learning, building, and growing together</span>
          </div>
          <Link href="/auth/signup" className="btn-cta">Apply for Membership {Ic.arrow}</Link>
          <a href="mailto:cdscscoe@gmail.com" className="btn-cta2">{Ic.mail} Contact Us</a>
          <p className="cta-note">Applications are reviewed on a rolling basis</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="sec">
        <div className="sec-c" style={{maxWidth:680}}>
          <div className="rev">
            <h2 className="sh2 faq-h2" style={{marginBottom:'2rem'}}>Questions<span style={{background:'linear-gradient(90deg,#60A5FA,#818CF8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}> you might have</span></h2>
          </div>
          <div className="rev" data-delay=".1s">
            {FAQ.map((item,i)=>(
              <div key={i} className="faq-item">
                <button className="faq-btn" aria-expanded={openFaq===i} onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  {item.q}
                  <span className="faq-ico">{Ic.plus}</span>
                </button>
                <div className={`faq-ans${openFaq===i?' open':''}`}>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="footer">
        <div className="ft-inner">
          <div className="ft-top">
            <div>
              <div className="ft-logo">CDSC<span>@SCOE</span></div>
              <p className="ft-desc">Computer Department Student Community<br/>Siddhant College of Engineering, Pune</p>
              <a href="mailto:cdscscoe@gmail.com" className="ft-email">cdscscoe@gmail.com</a>
              <p style={{fontSize:'.82rem',color:'var(--text2)',marginTop:'.35rem'}}>SCOE, Pune</p>
              <div className="ft-socs">
                {[{h:'https://linkedin.com/in/cdsc-2025-scoe',ic:Ic.linkedin},{h:'https://github.com/cdscscoe',ic:Ic.github},{h:'https://youtube.com/@CDSCSCOE',ic:Ic.yt},{h:'https://instagram.com/cdscscoe',ic:Ic.ig},{h:'https://x.com/cdscscoe',ic:Ic.tw}].map((s,i)=>(
                  <a key={i} href={s.h} target="_blank" rel="noreferrer" className="ft-soc">{s.ic}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="ft-lbl">Quick Links</div>
              {[['About','#what'],['Domains','#domains'],['Team','#team'],['Timeline','#timeline'],['Resources','#resources']].map(([l,h])=>(
                <a key={l} href={h} className="ft-link">{l}</a>
              ))}
            </div>
            <div>
              <div className="ft-lbl">Connect</div>
              <a href="mailto:cdscscoe@gmail.com" className="ft-link">cdscscoe@gmail.com</a>
              <Link href="/auth/signup" className="ft-link">Apply for Membership</Link>
              <Link href="/auth/login" className="ft-link">Sign In</Link>
            </div>
          </div>
          <div className="ft-bottom">
            <span className="ft-copy">© 2025 CDSC@SCOE · Made with ♥ by students</span>
            <span className="ft-copy">Privacy Policy · Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  )
}