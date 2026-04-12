// app/auth/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="auth-page"
      style={{
        minHeight: '100vh',
        background: '#0B0F19',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @keyframes orbFloat1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.06)}66%{transform:translate(-15px,15px) scale(.96)}}
        @keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-40px,25px) scale(1.08)}70%{transform:translate(25px,-15px) scale(.93)}}
        @keyframes orbFloat3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,30px) scale(1.04)}}
        @keyframes auroraShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .auth-orb{position:absolute;border-radius:50%;pointer-events:none;will-change:transform;}
        .auth-orb1{width:480px;height:480px;background:radial-gradient(circle,rgba(99,102,241,.38) 0%,rgba(99,102,241,.1) 50%,transparent 70%);filter:blur(56px);top:-160px;left:-160px;animation:orbFloat1 15s ease-in-out infinite;}
        .auth-orb2{width:380px;height:380px;background:radial-gradient(circle,rgba(251,191,36,.28) 0%,rgba(249,115,22,.1) 50%,transparent 70%);filter:blur(48px);bottom:40px;right:-120px;animation:orbFloat2 19s ease-in-out infinite;}
        .auth-orb3{width:280px;height:280px;background:radial-gradient(circle,rgba(74,222,128,.22) 0%,rgba(56,189,248,.1) 50%,transparent 70%);filter:blur(40px);bottom:-60px;left:20%;animation:orbFloat3 22s ease-in-out infinite;}
        .auth-aurora{position:absolute;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 110% 70% at 50% -10%,rgba(99,102,241,.35) 0%,transparent 55%),radial-gradient(ellipse 60% 45% at 85% 85%,rgba(251,191,36,.14) 0%,transparent 50%),radial-gradient(ellipse 50% 40% at 10% 70%,rgba(56,189,248,.12) 0%,transparent 45%);animation:auroraShift 20s ease-in-out infinite;background-size:200% 200%;}
        .auth-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:44px 44px;mask-image:radial-gradient(ellipse 80% 70% at 50% 50%,black,transparent);pointer-events:none;z-index:0;}
        .auth-grain{position:fixed;inset:0;z-index:1000;pointer-events:none;opacity:.02;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");background-size:180px 180px;mix-blend-mode:overlay;}
      `}</style>

      <div className="auth-grain" />
      <div className="auth-aurora" />
      <div className="auth-grid" />
      <div className="auth-orb auth-orb1" />
      <div className="auth-orb auth-orb2" />
      <div className="auth-orb auth-orb3" />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 460 }}>
        {children}
      </div>
    </div>
  )
}