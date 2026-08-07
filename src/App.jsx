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

  // Rain Audio Synthesizer State
  const [isRainPlaying, setIsRainPlaying] = useState(false);
  const rainAudioCtxRef = useRef(null);
  const rainGainNodeRef = useRef(null);

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
      window.removeEventListener('popstate', handleCheckAdminRoute);
      window.removeEventListener('hashchange', handleCheckAdminRoute);
    };
  }, []);

  // Web Audio Rain Sound Synthesizer
  const toggleRain = () => {
    if (!isRainPlaying) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        rainAudioCtxRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.05;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        rainGainNodeRef.current = gainNode;

        whiteNoise.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();

        setIsRainPlaying(true);
      } catch (err) {
        console.log('Audio error', err);
      }
    } else {
      if (rainAudioCtxRef.current) {
        rainAudioCtxRef.current.close();
      }
      setIsRainPlaying(false);
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
        isRainPlaying={isRainPlaying}
        toggleRain={toggleRain}
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
