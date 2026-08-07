import React, { useState, useEffect } from 'react';

export default function ClassPhotoSection({ initialClassPhoto, onUpdateClassPhoto }) {
  const defaultPhotoState = {
    imageUrl: '/class_photo.webp',
    className: 'XII RPL 3 — SMK Angkatan 2020–2023',
    teacherName: 'Siti Mariatul Kiptiyah Spd. M.Pd',
    teacherRole: 'Guru Wali Kelas Utama',
    quote: '“Sukses selalu untuk kalian semua. Meskipun masa SMK diwarnai PJJ dan pandemi, kalian terbukti tangguh, kreatif, dan luar biasa!”',
    totalStudents: '36 Siswa'
  };

  const [photoData, setPhotoData] = useState(() => {
    const saved = localStorage.getItem('classPhotoInfo');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return initialClassPhoto || defaultPhotoState;
  });

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Form state
  const [editImageUrl, setEditImageUrl] = useState(photoData.imageUrl);
  const [editClassName, setEditClassName] = useState(photoData.className);
  const [editTeacherName, setEditTeacherName] = useState(photoData.teacherName);
  const [editTeacherRole, setEditTeacherRole] = useState(photoData.teacherRole);
  const [editQuote, setEditQuote] = useState(photoData.quote);
  const [uploadFile, setUploadFile] = useState(null);

  // Fetch from API backend on mount
  useEffect(() => {
    const fetchClassPhoto = async () => {
      try {
        const res = await fetch('/api/class-photo');
        if (res.ok) {
          const data = await res.json();
          if (data && data.imageUrl) {
            setPhotoData(data);
            localStorage.setItem('classPhotoInfo', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.log('Using local state for class photo');
      }
    };
    fetchClassPhoto();
  }, []);

  // Update edit form fields whenever modal opens or photoData changes
  useEffect(() => {
    setEditImageUrl(photoData.imageUrl);
    setEditClassName(photoData.className);
    setEditTeacherName(photoData.teacherName);
    setEditTeacherRole(photoData.teacherRole);
    setEditQuote(photoData.quote);
  }, [photoData, isEditOpen]);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('className', editClassName || 'XII RPL 1 — SMK Angkatan 2020–2023');
      formData.append('teacherName', editTeacherName || 'Drs. H. Mulyadi, M.Pd');
      formData.append('teacherRole', editTeacherRole || 'Guru Wali Kelas Utama');
      formData.append('quote', editQuote || '');

      if (uploadFile) {
        formData.append('image', uploadFile);
      } else {
        formData.append('imageUrl', editImageUrl || '/class_photo.webp');
      }

      const res = await fetch('/api/class-photo', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        if (result.classPhoto) {
          setPhotoData(result.classPhoto);
          localStorage.setItem('classPhotoInfo', JSON.stringify(result.classPhoto));
        }
      } else {
        // Fallback update local state
        const updated = {
          imageUrl: editImageUrl || '/class_photo.webp',
          className: editClassName,
          teacherName: editTeacherName,
          teacherRole: editTeacherRole,
          quote: editQuote,
          totalStudents: photoData.totalStudents
        };
        setPhotoData(updated);
        localStorage.setItem('classPhotoInfo', JSON.stringify(updated));
      }
    } catch (err) {
      console.log('API save error, updated locally', err);
      const updated = {
        imageUrl: editImageUrl || '/class_photo.webp',
        className: editClassName,
        teacherName: editTeacherName,
        teacherRole: editTeacherRole,
        quote: editQuote,
        totalStudents: photoData.totalStudents
      };
      setPhotoData(updated);
      localStorage.setItem('classPhotoInfo', JSON.stringify(updated));
    } finally {
      setIsSaving(false);
      setIsEditOpen(false);
      setUploadFile(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
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
        padding: '50px 14px 65px',
        background: 'linear-gradient(180deg, rgba(35,48,74,0.03) 0%, rgba(196,153,110,0.12) 50%, rgba(234,224,203,0) 100%)',
        borderTop: '2px dashed rgba(122,46,53,0.2)',
        borderBottom: '2px dashed rgba(122,46,53,0.2)',
        margin: '20px 0 30px'
      }}
    >
      {/* Header Info */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 30px', padding: '0 8px' }}>
        <div 
          className="label" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--maroon)',
            color: 'var(--paper)',
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            marginBottom: '12px',
            boxShadow: '0 4px 10px rgba(122,46,53,0.25)'
          }}
        >
          <span>📜</span> DOKUMEN RESMI KELAS & WALI KELAS
        </div>

        <h2 
          className="font-caveat" 
          style={{
            fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
            color: 'var(--ink)',
            lineHeight: 1.1,
            marginBottom: '10px'
          }}
        >
          Foto Kebersamaan Satu Kelas & Wali Kelas
        </h2>

        <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
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
          className="washi hidden sm:block" 
          style={{ 
            top: '-18px', 
            left: '20px', 
            transform: 'rotate(-8deg)',
            zIndex: 10,
            width: '110px',
            height: '28px'
          }} 
        />
        <div 
          className="washi hidden sm:block" 
          style={{ 
            top: '-18px', 
            right: '20px', 
            transform: 'rotate(6deg)',
            zIndex: 10,
            width: '110px',
            height: '28px'
          }} 
        />

        {/* Master Deluxe Frame */}
        <div
          className="class-frame-outer"
          style={{
            position: 'relative',
            background: 'linear-gradient(145deg, #2b1810 0%, #4a2918 35%, #2b1810 70%, #170d08 100%)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: `
              0 20px 45px -10px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 215, 0, 0.25),
              inset 0 0 15px rgba(0, 0, 0, 0.8),
              inset 0 0 3px 2px rgba(212, 175, 55, 0.4)
            `,
            border: '6px solid #3d2314'
          }}
        >
          {/* Gold Decorative Corner Brackets */}
          <div style={{ position: 'absolute', top: '8px', left: '8px', width: '22px', height: '22px', borderTop: '3px solid #dfb76c', borderLeft: '3px solid #dfb76c', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: '8px', right: '8px', width: '22px', height: '22px', borderTop: '3px solid #dfb76c', borderRight: '3px solid #dfb76c', zIndex: 3 }} />
          <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '22px', height: '22px', borderBottom: '3px solid #dfb76c', borderLeft: '3px solid #dfb76c', zIndex: 3 }} />
          <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '22px', height: '22px', borderBottom: '3px solid #dfb76c', borderRight: '3px solid #dfb76c', zIndex: 3 }} />

          {/* Wax Stamp Seal */}
          <div 
            style={{
              position: 'absolute',
              top: '-12px',
              right: '-10px',
              width: '62px',
              height: '62px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #a8323e, #661820)',
              color: '#fbe8d3',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.55rem',
              fontWeight: 'bold',
              textAlign: 'center',
              border: '2px dashed #d4af37',
              boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
              transform: 'rotate(14deg)',
              zIndex: 12,
              lineHeight: 1.2
            }}
          >
            <span style={{ fontSize: '0.9rem', marginBottom: '1px' }}>🎗️</span>
            SEAL OF<br/>CLASS
          </div>

          {/* Passe-Partout / Matboard Inner Frame */}
          <div
            style={{
              background: '#fdfcf7',
              padding: '12px 12px 42px',
              borderRadius: '4px',
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)',
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
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                border: '2px solid #e0c38c'
              }}
            >
              <img
                src={photoData.imageUrl}
                alt="Foto Satu Kelas dan Wali Kelas"
                loading="eager"
                decoding="async"
                style={{
                  width: '100%',
                  maxHeight: '600px',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'contrast(1.03) saturate(1.05)'
                }}
              />
            </div>

            {/* Engraved Brass Plaque Plate at bottom of matboard */}
            <div
              style={{
                position: 'absolute',
                bottom: '6px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #d4af37 0%, #fff3a8 25%, #b8860b 60%, #e6ca65 100%)',
                padding: '5px 18px',
                borderRadius: '4px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.4)',
                border: '1px solid #7c5c16',
                textAlign: 'center',
                minWidth: '220px',
                maxWidth: '94%'
              }}
            >
              {/* Screws/Rivets */}
              <div style={{ position: 'absolute', top: '50%', left: '6px', transform: 'translateY(-50%)', width: '5px', height: '5px', borderRadius: '50%', background: '#5c430e', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.8)' }} />
              <div style={{ position: 'absolute', top: '50%', right: '6px', transform: 'translateY(-50%)', width: '5px', height: '5px', borderRadius: '50%', background: '#5c430e', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.8)' }} />

              <div 
                className="font-special" 
                style={{
                  fontSize: 'clamp(0.65rem, 2.2vw, 0.78rem)',
                  fontWeight: 'bold',
                  letterSpacing: '0.1em',
                  color: '#2a1c04',
                  textTransform: 'uppercase',
                  textShadow: '0 1px 0 rgba(255,255,255,0.4)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                FOTO KELAS & GURU WALI TERCINTA
              </div>
              <div 
                style={{
                  fontSize: 'clamp(0.6rem, 2vw, 0.7rem)',
                  color: '#473209',
                  fontWeight: '600',
                  marginTop: '1px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
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
            marginTop: '22px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          {/* Homeroom Teacher Details Card */}
          <div
            style={{
              background: 'var(--polaroid)',
              padding: '16px 18px',
              borderRadius: '8px',
              border: '1px solid rgba(196,153,110,0.4)',
              boxShadow: '0 6px 16px rgba(35,26,15,0.06)',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start'
            }}
          >
            <div 
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--teal), var(--ink))',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                flexShrink: 0,
                border: '2px solid var(--paper)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }}
            >
              👨‍🏫
            </div>
            <div>
              <span className="label" style={{ color: 'var(--maroon)', fontSize: '0.68rem' }}>{photoData.teacherRole}</span>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--ink)', margin: '2px 0 4px', fontWeight: 700 }}>
                {photoData.teacherName}
              </h3>
              <p className="scrawl" style={{ fontSize: '1.05rem', color: 'var(--ink-soft)', lineHeight: 1.3 }}>
                {photoData.quote}
              </p>
            </div>
          </div>

          {/* Quick Stats & Controls Card */}
          <div
            style={{
              background: 'var(--polaroid)',
              padding: '16px 18px',
              borderRadius: '8px',
              border: '1px solid rgba(196,153,110,0.4)',
              boxShadow: '0 6px 16px rgba(35,26,15,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span className="label" style={{ fontSize: '0.68rem' }}>Informasi Kebersamaan</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                <span style={{ background: 'var(--paper)', padding: '5px 10px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: 600, border: '1px solid rgba(0,0,0,0.08)' }}>
                  🎓 Angkatan: 2020–2023
                </span>
                <span style={{ background: 'var(--paper)', padding: '5px 10px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: 600, border: '1px solid rgba(0,0,0,0.08)' }}>
                  👥 {photoData.totalStudents}
                </span>
                <span style={{ background: 'var(--paper)', padding: '5px 10px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: 600, border: '1px solid rgba(0,0,0,0.08)' }}>
                  ❤️ Kebersamaan Selamanya
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
