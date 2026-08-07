import React from 'react';
import { Calendar, Image as ImageIcon, Users, MessageSquare, Music } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
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
    <nav 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(234, 224, 205, 0.96)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px dashed rgba(35,48,74,0.25)',
        boxShadow: '0 4px 20px rgba(35,26,15,0.08)'
      }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
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

        {/* Nav Links (Horizontal Scrollable on Mobile for Pixel-Perfect Layout) */}
        <div 
          className="nav-links-scroll" 
          style={{ 
            display: 'flex', 
            gap: '10px', 
            alignItems: 'center',
            overflowX: 'auto',
            maxWidth: '100%',
            padding: '4px 0',
            scrollbarWidth: 'none'
          }}
        >
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
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
                  fontSize: '0.72rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: isActive ? '#fff' : 'var(--ink)',
                  background: isActive ? 'var(--maroon)' : 'rgba(251,248,241,0.8)',
                  padding: '7px 14px',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: isActive ? '1px solid var(--maroon)' : '1px solid rgba(35,48,74,0.15)',
                  boxShadow: isActive ? '0 4px 10px rgba(122,46,53,0.3)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <IconComp style={{ width: '13px', height: '13px' }} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
