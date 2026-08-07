import React from 'react';
import { Calendar, Image as ImageIcon, Users, MessageSquare, CloudRain, Music } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isRainPlaying, toggleRain }) {
  const navItems = [
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
        {/* Rain Sound Toggle */}
        <button
          onClick={toggleRain}
          title={isRainPlaying ? 'Matikan Suara Hujan' : 'Nyalakan Suara Hujan'}
          style={{
            background: isRainPlaying ? 'var(--teal)' : 'transparent',
            color: isRainPlaying ? '#fff' : 'var(--ink-soft)',
            border: '1px dashed var(--teal)',
            padding: '6px 14px',
            borderRadius: '4px',
            fontFamily: "'Special Elite', monospace",
            fontSize: '0.7rem',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textTransform: 'uppercase'
          }}
        >
          <CloudRain style={{ width: '14px', height: '14px' }} />
          <span>{isRainPlaying ? 'Rain ON' : 'Rain Sound'}</span>
        </button>
      </div>
    </nav>
  );
}

