import React from 'react';
import { Calendar, Image as ImageIcon, Users, MessageSquare, CloudRain, Music } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isBgMusicPlaying, toggleBgMusic }) {
  const navItems = [
    { id: 'foto-kelas', label: 'Foto Kelas', icon: ImageIcon, href: '#foto-kelas' },
    { id: 'timeline', label: 'Linimasa', icon: Calendar, href: '#linimasa' },
    { id: 'gallery', label: 'Galeri', icon: ImageIcon, href: '#galeri' },
    { id: 'playlist', label: 'Playlist', icon: Music, href: '#playlist' },
    { id: 'guestbook', label: 'Cerita', icon: MessageSquare, href: '#cerita' },
    { id: 'roster', label: 'Circle', icon: Users, href: '#roster' },
  ];

  const handleNavClick = (tabId, href) => {
    setActiveTab(tabId);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 32px',
      background: 'rgba(234, 224, 205, 0.94)',
      backdropFilter: 'blur(6px)',
      borderBottom: '1px dashed rgba(35,48,74,0.25)'
    }}>
      {/* Brand */}
      <div 
        className="brand"
        onClick={() => handleNavClick('timeline', '#linimasa')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div className="stamp-mini">'23</div>
        <div className="brand-name font-caveat" style={{ fontSize: '1.6rem', color: 'var(--ink)', fontWeight: 700 }}>
          kita, dulu.
        </div>
      </div>

      {/* Nav Links */}
      <div className="nav-links hidden md:flex" style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(item.id, item.href);
            }}
            style={{
              textDecoration: 'none',
              fontFamily: "'Special Elite', monospace",
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: activeTab === item.id ? 'var(--maroon)' : 'var(--ink-soft)',
              borderBottom: activeTab === item.id ? '2px solid var(--maroon)' : 'none',
              paddingBottom: '3px',
              transition: 'color 0.2s'
            }}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Background Music Toggle (.Feast - Nina) */}
        <button
          onClick={toggleBgMusic}
          title={isBgMusicPlaying ? 'Matikan Musik Nina - .Feast' : 'Putar Musik Nina - .Feast'}
          style={{
            background: isBgMusicPlaying ? 'var(--maroon)' : 'transparent',
            color: isBgMusicPlaying ? '#fff' : 'var(--ink-soft)',
            border: '1px dashed var(--maroon)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontFamily: "'Special Elite', monospace",
            fontSize: '0.7rem',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textTransform: 'uppercase',
            boxShadow: isBgMusicPlaying ? '0 4px 10px rgba(122,46,53,0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <Music style={{ width: '14px', height: '14px', animation: isBgMusicPlaying ? 'spin 4s linear infinite' : 'none' }} />
          <span>{isBgMusicPlaying ? '🎵 Nina - .Feast (ON)' : '🎵 Nina - .Feast (OFF)'}</span>
        </button>
      </div>
    </nav>
  );
}

