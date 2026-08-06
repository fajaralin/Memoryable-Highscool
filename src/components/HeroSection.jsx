import React from 'react';

export default function HeroSection({ onExplore }) {
  return (
    <header className="hero" style={{
      position: 'relative',
      minHeight: '88vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '60px 20px',
      overflow: 'hidden',
      background: 'repeating-linear-gradient(135deg, rgba(168,124,82,0.10) 0 2px, transparent 2px 26px), var(--cork)',
      boxShadow: 'inset 0 -40px 60px -20px rgba(35,26,15,0.35)',
      borderRadius: '0 0 16px 16px'
    }}>
      {/* Stamp Private */}
      <div className="stamp-private" style={{ position: 'absolute', top: '26px', right: '34px' }}>
        CIRCLE ONLY <span>bukan buat umum</span>
      </div>

      {/* Floating Polaroids (Hidden on small screens) */}
      <div className="polaroid p1 hidden lg:block" style={{ position: 'absolute', top: '12%', left: '6%', transform: 'rotate(-9deg)' }}>
        <div className="frame" style={{ width: '140px', height: '140px', background: 'linear-gradient(135deg,#93a8b8,#3F6F64)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>📷</div>
        <div className="cap">MPLS, masih pake masker</div>
      </div>

      <div className="polaroid p2 hidden lg:block" style={{ position: 'absolute', bottom: '8%', left: '10%', transform: 'rotate(7deg)' }}>
        <div className="frame" style={{ width: '140px', height: '140px', background: 'linear-gradient(135deg,#c9a05a,#7A2E35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>💻</div>
        <div className="cap">kelas Zoom, cam off</div>
      </div>

      <div className="polaroid p3 hidden lg:block" style={{ position: 'absolute', top: '16%', right: '7%', transform: 'rotate(11deg)' }}>
        <div className="frame" style={{ width: '140px', height: '140px', background: 'linear-gradient(135deg,#7a95a8,#23304A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🎓</div>
        <div className="cap">akhirnya wisuda 2023</div>
      </div>

      <div className="polaroid p4 hidden lg:block" style={{ position: 'absolute', bottom: '10%', right: '9%', transform: 'rotate(-6deg)' }}>
        <div className="frame" style={{ width: '140px', height: '140px', background: 'linear-gradient(135deg,#b7c2a5,#3F6F64)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🚌</div>
        <div className="cap">prakerin & PKL seru</div>
      </div>

      {/* Washi Tapes */}
      <div className="washi" style={{ top: '10%', left: '42%', transform: 'rotate(-20deg)' }}></div>
      <div className="washi" style={{ bottom: '14%', right: '38%', transform: 'rotate(16deg)' }}></div>

      {/* Hero Content */}
      <h1 className="hero-title font-caveat" style={{
        fontSize: 'clamp(3rem, 7vw, 5.5rem)',
        color: 'var(--ink)',
        lineHeight: 1.05,
        margin: 0,
        fontWeight: 700,
        textShadow: '2px 2px 0 rgba(251,248,241,0.5)'
      }}>
        Kenangan yang<br />nggak pernah usai
      </h1>

      <p className="hero-sub font-special" style={{
        fontSize: '0.95rem',
        letterSpacing: '0.08em',
        color: 'var(--ink)',
        marginTop: '18px',
        textTransform: 'uppercase',
        fontWeight: 'bold'
      }}>
        SMK · Angkatan 2020 — 2023
      </p>

      <p className="hero-note" style={{
        maxWidth: '520px',
        margin: '26px auto 0',
        fontSize: '1.05rem',
        color: 'var(--ink-soft)',
        background: 'rgba(251,248,241,0.75)',
        padding: '18px 24px',
        borderRadius: '4px',
        transform: 'rotate(-1deg)',
        lineHeight: 1.5,
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
      }}>
        Website ini cuma buat kita. Isinya cerita, foto, lagu, dan semua hal receh yang bikin masa itu paling berkesan — apalagi pas dunia lagi aneh-anehnya di era Covid 19.
      </p>

      <div 
        className="scroll-hint font-special"
        onClick={onExplore}
        style={{
          marginTop: '36px',
          fontSize: '0.72rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--ink)',
          opacity: 0.8,
          cursor: 'pointer'
        }}
      >
        ↓ gulir buat mulai nostalgia
      </div>
    </header>
  );
}
