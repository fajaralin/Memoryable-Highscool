import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Plus, Music, Volume2, VolumeX, X } from 'lucide-react';

export default function MusicPlayer({ songs = [], onAddSong }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [audioFile, setAudioFile] = useState(null);

  const audioRef = useRef(null);

  const currentTrack = songs[currentIndex] || {
    title: 'Lagu Waktu Kelas Daring (Lo-Fi)',
    artist: 'ditambahin oleh Circle',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex]);

  const togglePlayTrack = (index) => {
    if (index === currentIndex) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newTitle || 'Lagu Kenangan Baru');
    formData.append('artist', newArtist || 'Teman Circle');
    if (audioFile) {
      formData.append('audioFile', audioFile);
    } else if (newAudioUrl) {
      formData.append('audioUrl', newAudioUrl);
    }

    if (onAddSong) {
      await onAddSong(formData);
    }

    setShowAddModal(false);
    setNewTitle('');
    setNewArtist('');
    setNewAudioUrl('');
    setAudioFile(null);
  };

  return (
    <section id="playlist">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onEnded={() => {
          if (songs.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % songs.length);
          }
        }}
      />

      <div className="section-head">
        <span className="label">Setelan Galau Angkatan</span>
        <h2>Playlist Nostalgia</h2>
      </div>

      <div className="cassette-wrap">
        {/* Cassette Tape Header */}
        <div className="cassette-header">
          <span>Mixtape — Kita, Dulu</span>
          <div className="reels">
            <div className={`reel ${isPlaying ? 'spinning' : ''}`}></div>
            <div className={`reel ${isPlaying ? 'spinning' : ''}`}></div>
          </div>
        </div>

        {/* Currently Playing Sub-banner */}
        {isPlaying && (
          <div style={{
            background: 'rgba(63,111,100,0.25)',
            border: '1px solid var(--teal)',
            borderRadius: '6px',
            padding: '10px 14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: "'Special Elite', monospace",
            fontSize: '0.75rem',
            color: 'var(--paper)'
          }}>
            <span>▶ Sedang memutar: <strong>{currentTrack.title}</strong></span>
            <span style={{ color: 'var(--teal)' }}>● Playing</span>
          </div>
        )}

        {/* Tracklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {songs.map((song, idx) => {
            const isThisTrack = idx === currentIndex && isPlaying;
            return (
              <div 
                key={song.id || idx}
                className={`track ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => togglePlayTrack(idx)}
              >
                <span className="track-num">{String(idx + 1).padStart(2, '0')}</span>
                <div className="track-info">
                  <h4>{song.title}</h4>
                  <p>{song.artist || song.tag || 'Lagu Kenangan'}</p>
                </div>

                <button 
                  className="track-play"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayTrack(idx);
                  }}
                >
                  {isThisTrack ? <Pause style={{ width: '14px', height: '14px' }} /> : <Play style={{ width: '14px', height: '14px', marginLeft: '2px' }} />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Add Track Button */}
        <div 
          className="add-track"
          onClick={() => setShowAddModal(true)}
        >
          + tambah lagu ke mixtape
        </div>
      </div>

      {/* Add Track Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-caveat" style={{ fontSize: '2rem', color: 'var(--ink)', margin: '0 0 16px' }}>
              Tambah Lagu ke Mixtape Circle
            </h3>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '4px' }}>Judul Lagu:</label>
                <input
                  type="text"
                  placeholder="misal: Monokrom - Tulus / Sound PKL..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="paper-input"
                  required
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '4px' }}>Penyanyi / Ditambahkan oleh:</label>
                <input
                  type="text"
                  placeholder="misal: Sheila on 7 (ditambahin oleh Dimas)..."
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  className="paper-input"
                  required
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '4px' }}>URL Audio MP3 (Opsional):</label>
                <input
                  type="url"
                  placeholder="https://... audio link mp3"
                  value={newAudioUrl}
                  onChange={(e) => setNewAudioUrl(e.target.value)}
                  className="paper-input"
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '4px' }}>Atau Upload File MP3:</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files[0])}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" className="fake-btn">Simpan ke Mixtape</button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--ink-soft)',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    fontFamily: "'Special Elite', monospace",
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
