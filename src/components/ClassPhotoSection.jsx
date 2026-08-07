import React, { useState, useEffect } from 'react';

export default function ClassPhotoSection() {
  // State for Class Photo and Teacher Info (with localStorage persistence)
  const [photoData, setPhotoData] = useState(() => {
    const saved = localStorage.getItem('classPhotoInfo');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      imageUrl: '/class_photo.webp',
      className: 'XII RPL 1 — SMK Angkatan 2020–2023',
      teacherName: 'Drs. H. Mulyadi, M.Pd',
      teacherRole: 'Guru Wali Kelas Utama',
      quote: '“Sukses selalu untuk kalian semua. Meskipun masa SMK diwarnai PJJ dan pandemi, kalian terbukti tangguh, kreatif, dan luar biasa!”',
      totalStudents: '36 Siswa'
    };
  });

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Edit Form state
  const [editImageUrl, setEditImageUrl] = useState(photoData.imageUrl);
  const [editClassName, setEditClassName] = useState(photoData.className);
  const [editTeacherName, setEditTeacherName] = useState(photoData.teacherName);
  const [editTeacherRole, setEditTeacherRole] = useState(photoData.teacherRole);
  const [editQuote, setEditQuote] = useState(photoData.quote);

  useEffect(() => {
    localStorage.setItem('classPhotoInfo', JSON.stringify(photoData));
  }, [photoData]);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setPhotoData({
      imageUrl: editImageUrl || '/class_photo.png',
      className: editClassName || 'XII RPL 1 — SMK Angkatan 2020–2023',
      teacherName: editTeacherName || 'Drs. H. Mulyadi, M.Pd',
      teacherRole: editTeacherRole || 'Guru Wali Kelas Utama',
      quote: editQuote || '',
      totalStudents: photoData.totalStudents
    });
    setIsEditOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setEditImageUrl(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section 
      id="foto-kelas" 
      style={{
        position: 'relative',
        padding: '70px 20px 80px',
        background: 'linear-gradient(180deg, rgba(35,48,74,0.03) 0%, rgba(196,153,110,0.12) 50%, rgba(234,224,203,0) 100%)',
        borderTop: '2px dashed rgba(122,46,53,0.2)',
        borderBottom: '2px dashed rgba(122,46,53,0.2)',
        margin: '20px 0 40px'
      }}
    >
      {/* Header Info */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
        <div 
          className="label" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--maroon)',
            color: 'var(--paper)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            letterSpacing: '0.12em',
            marginBottom: '14px',
            boxShadow: '0 4px 10px rgba(122,46,53,0.25)'
          }}
        >
          <span>📜</span> DOKUMEN RESMI KELAS & WALI KELAS
        </div>

        <h2 
          className="font-caveat" 
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
            color: 'var(--ink)',
            lineHeight: 1.1,
            marginBottom: '12px'
          }}
        >
          Foto Kebersamaan Satu Kelas & Wali Kelas
        </h2>

        <p style={{ fontSize: '1.05rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Potret penuh kenangan seluruh anggota kelas didampingi Bapak/Ibu Guru Wali Kelas tercinta.
          Momen bersejarah masa SMK angkatan 2020–2023.
        </p>
      </div>

      {/* Frame Container */}
      <div 
        style={{
          maxWidth: '1020px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        {/* Washi Tapes on Top Left & Top Right of Frame */}
        <div 
          className="washi" 
          style={{ 
            top: '-18px', 
            left: '30px', 
            transform: 'rotate(-8deg)',
            zIndex: 10,
            width: '130px',
            height: '32px'
          }} 
        />
        <div 
          className="washi" 
          style={{ 
            top: '-18px', 
            right: '30px', 
            transform: 'rotate(6deg)',
            zIndex: 10,
            width: '130px',
            height: '32px'
          }} 
        />

        {/* Master Deluxe Frame */}
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(145deg, #2b1810 0%, #4a2918 35%, #2b1810 70%, #170d08 100%)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 215, 0, 0.25),
              inset 0 0 15px rgba(0, 0, 0, 0.8),
              inset 0 0 3px 2px rgba(212, 175, 55, 0.4)
            `,
            border: '8px solid #3d2314'
          }}
        >
          {/* Gold Decorative Corner Brackets */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', width: '30px', height: '30px', borderTop: '3px solid #dfb76c', borderLeft: '3px solid #dfb76c', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', borderTop: '3px solid #dfb76c', borderRight: '3px solid #dfb76c', zIndex: 3 }} />
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '30px', height: '30px', borderBottom: '3px solid #dfb76c', borderLeft: '3px solid #dfb76c', zIndex: 3 }} />
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '30px', height: '30px', borderBottom: '3px solid #dfb76c', borderRight: '3px solid #dfb76c', zIndex: 3 }} />

          {/* Wax Stamp Seal */}
          <div 
            style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #a8323e, #661820)',
              color: '#fbe8d3',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              textAlign: 'center',
              border: '3px dashed #d4af37',
              boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
              transform: 'rotate(14deg)',
              zIndex: 12,
              lineHeight: 1.2
            }}
          >
            <span style={{ fontSize: '1rem', marginBottom: '2px' }}>🎗️</span>
            SEAL OF<br/>CLASS
          </div>

          {/* Passe-Partout / Matboard Inner Frame */}
          <div
            style={{
              background: '#fdfcf7',
              padding: '20px 20px 48px',
              borderRadius: '4px',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.1)',
              border: '2px solid #c59b27',
              position: 'relative'
            }}
          >
            {/* Inner Gold Bevel Line */}
            <div
              style={{
                position: 'relative',
                borderRadius: '2px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                border: '3px solid #e0c38c',
                cursor: 'pointer'
              }}
              onClick={() => setIsLightboxOpen(true)}
              title="Klik untuk memperbesar foto kelas"
            >
              <img
                src={photoData.imageUrl}
                alt="Foto Satu Kelas dan Wali Kelas"
                loading="eager"
                decoding="async"
                style={{
                  width: '100%',
                  maxHeight: '620px',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.5s ease',
                  filter: 'contrast(1.03) saturate(1.05)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.025)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />

              {/* Hover Overlay Hint */}
              <div
                className="font-special"
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  background: 'rgba(35,48,74,0.85)',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              >
                <span>🔍</span> Klik untuk perbesar (Fullscreen)
              </div>
            </div>

            {/* Engraved Brass Plaque Plate at bottom of matboard */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #d4af37 0%, #fff3a8 25%, #b8860b 60%, #e6ca65 100%)',
                padding: '6px 28px',
                borderRadius: '4px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.4)',
                border: '1px solid #7c5c16',
                textAlign: 'center',
                minWidth: '280px',
                maxWidth: '90%'
              }}
            >
              {/* Screws/Rivets */}
              <div style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', width: '6px', height: '6px', borderRadius: '50%', background: '#5c430e', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.8)' }} />
              <div style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)', width: '6px', height: '6px', borderRadius: '50%', background: '#5c430e', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.8)' }} />

              <div 
                className="font-special" 
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  letterSpacing: '0.12em',
                  color: '#2a1c04',
                  textTransform: 'uppercase',
                  textShadow: '0 1px 0 rgba(255,255,255,0.4)'
                }}
              >
                FOTO KELAS & GURU WALI TERCINTA
              </div>
              <div 
                style={{
                  fontSize: '0.7rem',
                  color: '#473209',
                  fontWeight: '600',
                  marginTop: '1px'
                }}
              >
                {photoData.className}
              </div>
            </div>
          </div>
        </div>

        {/* Info & Action Cards Bar */}
        <div 
          style={{
            marginTop: '28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}
        >
          {/* Homeroom Teacher Details Card */}
          <div
            style={{
              background: 'var(--polaroid)',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid rgba(196,153,110,0.4)',
              boxShadow: '0 8px 20px rgba(35,26,15,0.08)',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start'
            }}
          >
            <div 
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--teal), var(--ink))',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                flexShrink: 0,
                border: '2px solid var(--paper)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              👨‍🏫
            </div>
            <div>
              <span className="label" style={{ color: 'var(--maroon)' }}>{photoData.teacherRole}</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--ink)', margin: '4px 0 6px', fontWeight: 700 }}>
                {photoData.teacherName}
              </h3>
              <p className="scrawl" style={{ fontSize: '1.15rem', color: 'var(--ink-soft)', lineHeight: 1.3 }}>
                {photoData.quote}
              </p>
            </div>
          </div>

          {/* Quick Stats & Controls Card */}
          <div
            style={{
              background: 'var(--polaroid)',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid rgba(196,153,110,0.4)',
              boxShadow: '0 8px 20px rgba(35,26,15,0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span className="label">Informasi Kebersamaan</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                <span style={{ background: 'var(--paper)', padding: '6px 12px', borderRadius: '16px', fontSize: '0.82rem', fontWeight: 600, border: '1px solid rgba(0,0,0,0.08)' }}>
                  🎓 Angkatan: 2020 – 2023
                </span>
                <span style={{ background: 'var(--paper)', padding: '6px 12px', borderRadius: '16px', fontSize: '0.82rem', fontWeight: 600, border: '1px solid rgba(0,0,0,0.08)' }}>
                  👥 Kapasitas: {photoData.totalStudents}
                </span>
                <span style={{ background: 'var(--paper)', padding: '6px 12px', borderRadius: '16px', fontSize: '0.82rem', fontWeight: 600, border: '1px solid rgba(0,0,0,0.08)' }}>
                  ❤️ Kebersamaan: Selamanya
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button
                className="font-special"
                onClick={() => setIsEditOpen(true)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: 'var(--teal)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 10px rgba(63,111,100,0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                ✏️ Ganti Foto / Info Kelas
              </button>

              <button
                className="font-special"
                onClick={() => setIsLightboxOpen(true)}
                style={{
                  padding: '10px 16px',
                  background: 'var(--ink)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 10px rgba(35,48,74,0.3)'
                }}
              >
                🔍 Perbesar Foto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom View Modal */}
      {isLightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(15, 20, 30, 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              style={{
                position: 'absolute',
                top: '-45px',
                right: '0',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            {/* Lightbox Image with Frame */}
            <div
              style={{
                border: '12px solid #3d2314',
                borderRadius: '8px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
                background: '#fff',
                padding: '12px',
                maxHeight: '82vh',
                overflow: 'hidden'
              }}
            >
              <img
                src={photoData.imageUrl}
                alt="Foto Satu Kelas dan Wali Kelas"
                style={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  borderRadius: '2px',
                  display: 'block'
                }}
              />
            </div>

            <div 
              className="font-special"
              style={{
                color: '#fff',
                marginTop: '16px',
                textAlign: 'center',
                fontSize: '0.9rem',
                opacity: 0.9
              }}
            >
              📸 {photoData.className} — Wali Kelas: {photoData.teacherName}
            </div>
          </div>
        </div>
      )}

      {/* Edit Photo & Info Modal */}
      {isEditOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsEditOpen(false)}
        >
          <div
            style={{
              background: 'var(--paper)',
              maxWidth: '520px',
              width: '100%',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '2px solid var(--cork)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--ink)', margin: 0 }}>
                ✏️ Edit Foto Kelas & Wali Kelas
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>
                  Upload Foto Baru (dari Komputer):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'var(--polaroid)',
                    border: '1px solid var(--cork)',
                    borderRadius: '6px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>
                  Atau Input URL Foto Kelas:
                </label>
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  placeholder="https://... atau /class_photo.png"
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'var(--polaroid)',
                    border: '1px solid var(--cork)',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>
                  Nama Kelas & Angkatan:
                </label>
                <input
                  type="text"
                  value={editClassName}
                  onChange={(e) => setEditClassName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'var(--polaroid)',
                    border: '1px solid var(--cork)',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>
                  Nama Wali Kelas:
                </label>
                <input
                  type="text"
                  value={editTeacherName}
                  onChange={(e) => setEditTeacherName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'var(--polaroid)',
                    border: '1px solid var(--cork)',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '6px' }}>
                  Pesan / Pesan Kesan Guru Wali:
                </label>
                <textarea
                  rows="3"
                  value={editQuote}
                  onChange={(e) => setEditQuote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'var(--polaroid)',
                    border: '1px solid var(--cork)',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid var(--ink-soft)',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'var(--maroon)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
