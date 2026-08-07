import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ClassPhotoSection from './components/ClassPhotoSection';
import TimelineSection from './components/TimelineSection';
import GallerySection from './components/GallerySection';
import MusicPlayer from './components/MusicPlayer';
import MemoryWall from './components/MemoryWall';
import CircleRoster from './components/CircleRoster';
import AdminDashboard from './components/AdminDashboard';
import FloatingParticles from './components/FloatingParticles';

export default function App() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Data States
  const [classPhoto, setClassPhoto] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [memories, setMemories] = useState([]);
  const [members, setMembers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [guestbook, setGuestbook] = useState([]);

  // Fetch Data from Backend
  const fetchData = async () => {
    try {
      const [cpRes, tlRes, memRes, mbrRes, sngRes, gbRes] = await Promise.all([
        fetch('/api/class-photo'),
        fetch('/api/timeline'),
        fetch('/api/memories'),
        fetch('/api/members'),
        fetch('/api/songs'),
        fetch('/api/guestbook')
      ]);

      if (cpRes.ok) setClassPhoto(await cpRes.json());
      if (tlRes.ok) setTimeline(await tlRes.json());
      if (memRes.ok) setMemories(await memRes.json());
      if (mbrRes.ok) setMembers(await mbrRes.json());
      if (sngRes.ok) setSongs(await sngRes.json());
      if (gbRes.ok) setGuestbook(await gbRes.json());
    } catch (e) {
      console.log('API fallback local state');
    }
  };

  useEffect(() => {
    fetchData();

    // Scroll Reveal Observer
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    revealElements.forEach((el) => observer.observe(el));

    // Listener for manual /admin route or #admin hash
    const handleCheckAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.endsWith('/admin') || path.includes('/admin') || hash === '#admin') {
        setIsAdminOpen(true);
      }
    };

    handleCheckAdminRoute();
    window.addEventListener('popstate', handleCheckAdminRoute);
    window.addEventListener('hashchange', handleCheckAdminRoute);
    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', handleCheckAdminRoute);
      window.removeEventListener('hashchange', handleCheckAdminRoute);
    };
  }, [timeline, memories, members, songs]);

  const handlePostGuestbook = async (entry) => {
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.log('Guestbook error', e);
    }
  };

  const handleAddMemory = async (formData) => {
    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.log('Memory post error', e);
    }
  };

  const handleAddSong = async (formData) => {
    try {
      const res = await fetch('/api/songs', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.log('Song post error', e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', position: 'relative' }}>
      {/* Floating Memory Ambient Particles */}
      <FloatingParticles />

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Page Layout */}
      <main style={{ position: 'relative', zIndex: 2 }}>
        <HeroSection
          onExplore={() => {
            const el = document.getElementById('foto-kelas') || document.getElementById('linimasa');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Foto Kelas Bersama Guru Wali */}
        <div className="scroll-reveal">
          <ClassPhotoSection
            initialClassPhoto={classPhoto}
            onUpdateClassPhoto={fetchData}
          />
        </div>

        <div className="scroll-reveal">
          <TimelineSection
            timeline={timeline}
            memories={memories}
            onAddMemory={handleAddMemory}
          />
        </div>

        <div className="scroll-reveal">
          <GallerySection
            memories={memories}
            onAddMemory={handleAddMemory}
          />
        </div>

        <div className="scroll-reveal">
          <MusicPlayer
            songs={songs}
            onAddSong={handleAddSong}
          />
        </div>

        <div className="scroll-reveal">
          <MemoryWall
            messages={guestbook}
            onPostMessage={handlePostGuestbook}
          />
        </div>

        <div className="scroll-reveal">
          <CircleRoster
            members={members}
            onSendNote={handlePostGuestbook}
          />
        </div>
      </main>

      {/* Footer from kenangan-smk-concept */}
      <footer style={{
        textAlign: 'center',
        padding: '60px 20px 50px',
        background: 'var(--ink)',
        color: 'var(--paper)',
        marginTop: '60px'
      }}>
        <div className="scrawl" style={{ fontSize: '1.9rem', opacity: 0.9 }}>
          sampai kapan pun, kita tetap satu angkatan.
        </div>
        <div className="label" style={{ color: 'var(--paper)', opacity: 0.6, marginTop: '10px' }}>
          kita-dulu.web · private circle · dibuat dengan kenangan 2020-2023
        </div>
      </footer>

      {/* Admin CMS Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        refreshData={fetchData}
      />
    </div>
  );
}
