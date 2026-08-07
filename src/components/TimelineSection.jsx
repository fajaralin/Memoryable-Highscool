import React, { useState } from 'react';
import YearDetailModal from './YearDetailModal';

export default function TimelineSection({ timeline = [], memories = [], onAddMemory }) {
  const [selectedYear, setSelectedYear] = useState(null);

  const defaultEvents = [
    {
      year: '2020',
      title: 'MPLS di tengah dunia yang tiba-tiba berhenti',
      desc: 'Baru juga kenalan sama sekolah baru, eh langsung disuruh belajar dari rumah. Grup WA kelas jadi tempat pertama kita saling kenal.',
      photos: ['📷', '💻', '😷'],
      decor: {
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        caption: 'Masa PJJ & Kamera Zoom 📷',
        badge: '📱 PJJ ERA',
        stamp: 'APPROVED MEMORY',
        rotation: -3,
        highlights: [
          '💻 100+ jam Zoom & Google Meet',
          '😷 Seragam SMP dipake PJJ di rumah',
          '💬 Kenalan cuma lewat WA Group kelas'
        ]
      }
    },
    {
      year: '2021',
      title: 'Setahun penuh lewat layar',
      desc: 'Zoom mati kamera, tugas numpuk, sinyal putus-putus. Tapi entah kenapa candaan di Discord & WA malah makin absurd tiap hari.',
      photos: ['💻', '🎮', '🎧'],
      decor: {
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
        caption: 'Mabar Discord Jam 2 Pagi 🎮',
        badge: '⚡ DISCORD & WARKOP',
        stamp: 'TOP SECRET 2021',
        rotation: 4,
        highlights: [
          '🎮 Mabar ML/Among Us pas jam pelajaran',
          '🔌 "Maaf Pak, sinyal saya putus-putus!"',
          '☕ Janji nongkrong warkop rahasia'
        ]
      }
    },
    {
      year: '2022',
      title: 'PTM terbatas & prakerin',
      desc: 'Akhirnya ketemu langsung, walau masih jaga jarak. Prakerin/PKL jadi cerita paling banyak diomongin sampe sekarang.',
      photos: ['🛠️', '🎒', '🚌'],
      decor: {
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
        caption: 'Pengalaman PKL & Magang 🛠️',
        badge: '🎒 PRAKERIN 2022',
        stamp: 'VERIFIED MEMORY',
        rotation: -4,
        highlights: [
          '🎒 Kaget temen sekelas udah pada tinggi',
          '📄 Laporan PKL tebal 100+ halaman',
          '🚌 Akhirnya PTM terbatas & jalan bareng'
        ]
      }
    },
    {
      year: '2023',
      title: 'Ujian, perpisahan, dan lulus',
      desc: 'Semua kelar dalam waktu singkat rasanya. Foto wisuda, tanda tangan di baju, sampe nangis pas acara perpisahan.',
      photos: ['🎓', '💐', '✨'],
      decor: {
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
        caption: 'Kelulusan & Perpisahan 🎓',
        badge: '✨ CLASS OF 2023',
        stamp: 'LULUS 100%',
        rotation: 3,
        highlights: [
          '🎨 Tanda tangan seragam pake pilox & spidol',
          '💐 Tangisan haru pas perpisahan angkatan',
          '🤝 Janji tetep kontakan selamanya'
        ]
      }
    }
  ];

  const eventsToDisplay = timeline && timeline.length > 0
    ? timeline.map((item, idx) => {
        const fallback = defaultEvents[idx % defaultEvents.length];
        return {
          year: item.year || fallback.year,
          title: item.title || item.tag || fallback.title,
          desc: item.description || item.desc || fallback.desc,
          photos: fallback.photos,
          decor: fallback.decor
        };
      })
    : defaultEvents;

  const renderCard = (item) => (
    <div className="t-card">
      <span className="t-year">{item.year}</span>
      <h3>{item.title}</h3>
      <p>{item.desc}</p>
      
      <div className="t-photos" style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
        {item.photos.map((p, pIdx) => (
          <span 
            key={pIdx} 
            style={{
              flex: 1,
              aspectRatio: '1/1',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              background: pIdx === 0 ? 'linear-gradient(135deg,#3F6F64,#23304A)' : pIdx === 1 ? 'linear-gradient(135deg,#7A2E35,#C4996E)' : 'linear-gradient(135deg,#23304A,#7a95a8)',
              color: '#fff'
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <button 
        className="t-more font-special"
        onClick={() => setSelectedYear(item.year)}
      >
        Lihat album ({item.year}) →
      </button>
    </div>
  );

  const renderDecor = (item) => (
    <div 
      className="t-decor-side" 
      onClick={() => setSelectedYear(item.year)}
      title={`Klik untuk lihat album kenangan ${item.year}`}
    >
      <div className="decor-polaroid" style={{ transform: `rotate(${item.decor.rotation}deg)` }}>
        <div className="tape-strip top-tape"></div>
        <div className="polaroid-photo-frame">
          <img src={item.decor.image} alt={item.decor.caption} />
          <span className="decor-badge">{item.decor.badge}</span>
        </div>
        <div className="decor-caption">
          <span>{item.decor.caption}</span>
        </div>
        <div className="decor-stamp">{item.decor.stamp}</div>
      </div>

      <div className="decor-memo">
        <div className="memo-pin">📌</div>
        <div className="memo-title">Highlights {item.year}:</div>
        <ul className="memo-list">
          {item.decor.highlights.map((h, hIdx) => (
            <li key={hIdx}>{h}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <section id="linimasa" style={{ position: 'relative' }}>
      <div className="section-head">
        <span className="label">Perjalanan Kita</span>
        <h2>Linimasa 2020–2023</h2>
      </div>

      <div className="timeline">
        {eventsToDisplay.map((item, idx) => {
          const isRight = idx % 2 !== 0;
          return (
            <div key={item.year} className={`t-row ${isRight ? 'right-card' : 'left-card'}`}>
              <div className="t-slot t-slot-left">
                {isRight ? renderDecor(item) : renderCard(item)}
              </div>

              <div className="t-dot"></div>

              <div className="t-slot t-slot-right">
                {isRight ? renderCard(item) : renderDecor(item)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Year Detail Album Modal */}
      {selectedYear && (
        <YearDetailModal
          year={selectedYear}
          onClose={() => setSelectedYear(null)}
          memories={memories}
          onAddMemory={onAddMemory}
        />
      )}
    </section>
  );
}

