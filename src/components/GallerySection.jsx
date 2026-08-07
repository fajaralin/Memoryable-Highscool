import React, { useState } from 'react';
import { Camera, Heart, Calendar, User, PartyPopper, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GallerySection({ memories = [], onAddMemory }) {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState('2020');
  const [newDesc, setNewDesc] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newImage, setNewImage] = useState(null);

  const handleOpenMemory = (memory) => {
    setSelectedMemory(memory);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newTitle || 'Foto Kenangan SMK');
    formData.append('year', newYear);
    formData.append('description', newDesc);
    formData.append('author', newAuthor || 'Circle Member');
    if (newImage) {
      formData.append('image', newImage);
    }

    if (onAddMemory) {
      await onAddMemory(formData);
    }
    setShowUploadModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewAuthor('');
    setNewImage(null);
  };

  return (
    <section id="galeri" style={{ padding: '0' }}>
      <div className="section-head" style={{ paddingTop: '80px' }}>
        <span className="label">Papan Mading</span>
        <h2>Galeri Kenangan</h2>
      </div>

      <div className="gallery-board">
        {memories.map((item, idx) => (
          <div
            key={item.id || idx}
            className="g-item"
            onClick={() => handleOpenMemory(item)}
          >
            <div className="g-frame">
              <img src={item.imageUrl} alt={item.title} loading="lazy" decoding="async" />
            </div>
            <div className="g-cap font-caveat">{item.title}</div>
            <div style={{
              textAlign: 'center',
              fontFamily: "'Special Elite', monospace",
              fontSize: '0.6rem',
              opacity: 0.7,
              marginTop: '4px',
              textTransform: 'uppercase'
            }}>
              {item.year ? `Tahun ${item.year}` : '2020-2023'}
            </div>
          </div>
        ))}

        {/* Upload Card Button */}
        <div 
          className="g-item g-upload"
          onClick={() => setShowUploadModal(true)}
        >
          <Camera style={{ width: '28px', height: '28px', marginBottom: '8px' }} />
          <span>+ tambah<br />foto kenangan</span>
        </div>
      </div>

      {/* Detail Lightbox Modal */}
      {selectedMemory && (
        <div className="modal-overlay" onClick={() => setSelectedMemory(null)}>
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px' }}
          >
            <button
              onClick={() => setSelectedMemory(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'var(--maroon)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>

            <div style={{
              aspectRatio: '4/3',
              width: '100%',
              background: '#23304A',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '18px'
            }}>
              <img 
                src={selectedMemory.imageUrl} 
                alt={selectedMemory.title} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <h3 className="font-caveat" style={{ fontSize: '2rem', color: 'var(--ink)', margin: '0 0 8px' }}>
              {selectedMemory.title}
            </h3>

            <div style={{
              display: 'flex',
              gap: '14px',
              fontFamily: "'Special Elite', monospace",
              fontSize: '0.72rem',
              color: 'var(--teal)',
              marginBottom: '14px'
            }}>
              <span>📅 {selectedMemory.date || selectedMemory.year || '2020-2023'}</span>
              <span>👤 {selectedMemory.author || 'Circle'}</span>
            </div>

            <p style={{ fontSize: '1rem', lineHeight: 1.5, color: 'var(--ink-soft)' }}>
              {selectedMemory.description || 'Kenangan tak terlupakan bersama circle SMK 2020-2023.'}
            </p>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
                }}
                className="fake-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <PartyPopper style={{ width: '16px', height: '16px' }} />
                Rayakan Momen Ini 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Memory Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-caveat" style={{ fontSize: '2rem', color: 'var(--ink)', margin: '0 0 16px' }}>
              Upload Foto Memory Baru
            </h3>
            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '4px' }}>Judul Foto / Momen:</label>
                <input
                  type="text"
                  placeholder="misal: Jajan Kantin Setelah PJJ..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="paper-input"
                  required
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '4px' }}>Tahun Kenangan:</label>
                <select
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="paper-input"
                >
                  <option value="2020">2020 (Awal Covid / MPLS)</option>
                  <option value="2021">2021 (Kelas Zoom / PJJ)</option>
                  <option value="2022">2022 (PTM / Prakerin PKL)</option>
                  <option value="2023">2023 (Wisuda / Perpisahan)</option>
                </select>
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '4px' }}>Cerita Singkat:</label>
                <textarea
                  placeholder="Ceritakan momen seru di balik foto ini..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="paper-input"
                  rows={3}
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '4px' }}>Nama Pengunggah:</label>
                <input
                  type="text"
                  placeholder="Namamu di circle..."
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="paper-input"
                  required
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '4px' }}>Pilih File Foto (Image):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files[0])}
                  style={{ fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" className="fake-btn">Unggah Foto Memory</button>
                <button 
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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
