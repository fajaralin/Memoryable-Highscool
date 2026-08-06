import React, { useState } from 'react';
import { X, Upload, Camera } from 'lucide-react';

export default function YearDetailModal({ year, onClose, memories = [], onAddMemory }) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newImage, setNewImage] = useState(null);

  const yearTitles = {
    '2020': 'MPLS di tengah dunia yang tiba-tiba berhenti',
    '2021': 'Setahun penuh lewat layar Zoom & Meet',
    '2022': 'PTM Terbatas & Cerita Paling Banyak di Prakerin',
    '2023': 'Ujian, Coret-Coret Seragam, & Tangis Perpisahan'
  };

  const yearSubtitles = {
    '2020': 'Semua foto, video, dan cerita dari momen ini — mulai dari hari pertama MPLS sampe minggu-minggu awal belajar dari rumah.',
    '2021': 'Zoom mati kamera, tugas numpuk, sinyal putus-putus. Tapi candaan di Discord & WA malah makin kocak tiap hari.',
    '2022': 'Akhirnya ketemu langsung sekelas setelah sekian lama! Lanjut magang PKL yang bikin cerita kita makin mengalir deras.',
    '2023': 'Tahun pamungkas. Foto wisuda, stempel kenangan, tanda tangan di baju putih abu-abu, dan janji tak melupakan circle ini.'
  };

  const filteredMemories = memories.filter(
    (m) => m.year === year || (m.tags && m.tags.includes(year))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newTitle || `Momen SMK ${year}`);
    formData.append('description', newDesc);
    formData.append('author', newAuthor || 'Teman Circle');
    formData.append('year', year);
    if (newImage) {
      formData.append('image', newImage);
    }
    await onAddMemory(formData);
    setShowUploadForm(false);
    setNewTitle('');
    setNewDesc('');
    setNewAuthor('');
    setNewImage(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '900px',
          background: 'var(--paper)',
          padding: '0',
          overflow: 'hidden',
          border: '2px dashed var(--maroon)'
        }}
      >
        {/* Top Sticky Header */}
        <div style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(234,224,205,0.95)',
          borderBottom: '1px dashed rgba(35,48,74,0.25)'
        }}>
          <button 
            onClick={onClose}
            className="font-special"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--maroon)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← Kembali ke linimasa
          </button>
          <span className="label font-special">Album Kenangan {year}</span>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink-soft)'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Hero Year Header */}
        <div style={{
          textAlign: 'center',
          padding: '40px 20px 30px',
          background: 'repeating-linear-gradient(135deg, rgba(168,124,82,0.12) 0 2px, transparent 2px 24px), var(--cork)',
          boxShadow: 'inset 0 -20px 30px -10px rgba(0,0,0,0.2)'
        }}>
          <span className="label font-special" style={{
            background: 'rgba(251,248,241,0.7)',
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '3px',
            fontWeight: 'bold',
            color: 'var(--maroon)'
          }}>
            Tahun {year}
          </span>

          <h2 className="font-caveat" style={{
            color: 'var(--ink)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            margin: '12px 0 0',
            fontWeight: 700
          }}>
            {yearTitles[year] || `Kenangan Spesial Tahun ${year}`}
          </h2>

          <p style={{
            maxWidth: '560px',
            margin: '14px auto 0',
            background: 'rgba(251,248,241,0.65)',
            padding: '12px 20px',
            borderRadius: '4px',
            fontSize: '0.95rem',
            lineHeight: 1.5,
            color: 'var(--ink-soft)'
          }}>
            {yearSubtitles[year]}
          </p>
        </div>

        {/* Photo Grid */}
        <div style={{
          padding: '36px 24px',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '26px'
          }}>
            {filteredMemories.map((mem, idx) => (
              <div 
                key={mem.id || idx} 
                className="g-item"
                style={{
                  transform: `rotate(${((idx % 4) - 1.5) * 2.5}deg)`
                }}
              >
                <div className="g-frame">
                  <img src={mem.imageUrl} alt={mem.title} />
                </div>
                <div className="g-cap font-caveat">{mem.title}</div>
                <span style={{
                  display: 'block',
                  textAlign: 'center',
                  fontFamily: "'Special Elite', monospace",
                  fontSize: '0.62rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  opacity: 0.7,
                  marginTop: '4px',
                  color: 'var(--teal)'
                }}>
                  diunggah oleh {mem.author || 'Circle'}
                </span>
              </div>
            ))}

            {/* Upload Card */}
            <div 
              className="g-item g-upload"
              onClick={() => setShowUploadForm(true)}
              style={{
                borderColor: 'var(--maroon)',
                color: 'var(--maroon)'
              }}
            >
              <Camera style={{ width: '28px', height: '28px', marginBottom: '8px' }} />
              <span>+ Tambah foto<br />ke momen {year}</span>
            </div>
          </div>

          {/* Form Modal for uploading photo to this year */}
          {showUploadForm && (
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: 'rgba(251,248,241,0.9)',
              borderRadius: '6px',
              border: '1px dashed var(--teal)'
            }}>
              <h3 className="font-caveat" style={{ fontSize: '1.6rem', color: 'var(--ink)', margin: '0 0 14px' }}>
                Tambahkan Kenangan Baru Tahun {year}
              </h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Judul foto / momen..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="paper-input"
                  required
                />
                <textarea
                  placeholder="Cerita singkat di balik foto ini..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="paper-input"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="Namamu / Pengunggah..."
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="paper-input"
                  required
                />
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '4px' }}>Pilih File Gambar:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImage(e.target.files[0])}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="fake-btn">Simpan Kenangan</button>
                  <button 
                    type="button" 
                    onClick={() => setShowUploadForm(false)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--ink-soft)',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      fontFamily: "'Special Elite', monospace",
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
