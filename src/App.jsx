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

  // Background Music (.Feast - Nina) Audio State
  const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(false);
  const bgAudioRef = useRef(null);

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

    // Setup Background Music (.Feast - Nina Chorus)
    const audio = new Audio('/audio/nina_full.webm');
    audio.loop = true;
    bgAudioRef.current = audio;

    // Jump to chorus (reff) timestamp ~75 seconds
    const startChorus = () => {
      if (audio.currentTime < 75 || audio.currentTime > 165) {
        audio.currentTime = 75;
      }
    };

    audio.addEventListener('loadedmetadata', startChorus);
    audio.addEventListener('timeupdate', () => {
      // Loop chorus section (from 75s to 165s)
      if (audio.currentTime >= 165) {
        audio.currentTime = 75;
      }
    });

    // Attempt Autoplay on Page Load
    const tryAutoplay = () => {
      audio.play().then(() => {
        setIsBgMusicPlaying(true);
      }).catch(() => {
        // Autoplay blocked by browser policy until user gesture
        console.log('Autoplay waiting for user gesture...');
        const enableAudioOnGesture = () => {
          audio.play().then(() => {
            setIsBgMusicPlaying(true);
          }).catch(() => {});
          window.removeEventListener('click', enableAudioOnGesture);
          window.removeEventListener('touchstart', enableAudioOnGesture);
          window.removeEventListener('scroll', enableAudioOnGesture);
        };

        window.addEventListener('click', enableAudioOnGesture);
        window.addEventListener('touchstart', enableAudioOnGesture);
        window.addEventListener('scroll', enableAudioOnGesture);
      });
    };

    tryAutoplay();

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
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
      window.removeEventListener('popstate', handleCheckAdminRoute);
      window.removeEventListener('hashchange', handleCheckAdminRoute);
    };
  }, []);

  // Toggle Background Music (.Feast - Nina)
  const toggleBgMusic = () => {
    if (!bgAudioRef.current) return;

    if (isBgMusicPlaying) {
      bgAudioRef.current.pause();
      setIsBgMusicPlaying(false);
    } else {
      if (bgAudioRef.current.currentTime < 75 || bgAudioRef.current.currentTime > 165) {
        bgAudioRef.current.currentTime = 75;
      }
      bgAudioRef.current.play().then(() => {
        setIsBgMusicPlaying(true);
      }).catch(() => {});
    }
  };

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
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBgMusicPlaying={isBgMusicPlaying}
        toggleBgMusic={toggleBgMusic}
      />

      {/* Main Page Layout */}
      <main>
        <HeroSection
          onExplore={() => {
            const el = document.getElementById('foto-kelas') || document.getElementById('linimasa');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Foto Kelas Bersama Guru Wali */}
        <ClassPhotoSection
          initialClassPhoto={classPhoto}
          onUpdateClassPhoto={fetchData}
        />

        <TimelineSection
          timeline={timeline}
          memories={memories}
          onAddMemory={handleAddMemory}
        />

        <GallerySection
          memories={memories}
          onAddMemory={handleAddMemory}
        />

        <MusicPlayer
          songs={songs}
          onAddSong={handleAddSong}
        />

        <MemoryWall
          messages={guestbook}
          onPostMessage={handlePostGuestbook}
        />

        <CircleRoster
          members={members}
          onSendNote={handlePostGuestbook}
        />
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
