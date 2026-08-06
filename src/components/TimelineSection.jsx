import React, { useState } from 'react';
import YearDetailModal from './YearDetailModal';

export default function TimelineSection({ timeline = [], memories = [], onAddMemory }) {
  const [selectedYear, setSelectedYear] = useState(null);

  const defaultEvents = [
    {
      year: '2020',
      title: 'MPLS di tengah dunia yang tiba-tiba berhenti',
      desc: 'Baru juga kenalan sama sekolah baru, eh langsung disuruh belajar dari rumah. Grup WA kelas jadi tempat pertama kita saling kenal.',
      photos: ['📷', '💻', '😷']
    },
    {
      year: '2021',
      title: 'Setahun penuh lewat layar',
      desc: 'Zoom mati kamera, tugas numpuk, sinyal putus-putus. Tapi entah kenapa candaan di Discord & WA malah makin absurd tiap hari.',
      photos: ['💻', '🎮', '🎧']
    },
    {
      year: '2022',
      title: 'PTM terbatas & prakerin',
      desc: 'Akhirnya ketemu langsung, walau masih jaga jarak. Prakerin/PKL jadi cerita paling banyak diomongin sampe sekarang.',
      photos: ['🛠️', '🎒', '🚌']
    },
    {
      year: '2023',
      title: 'Ujian, perpisahan, dan lulus',
      desc: 'Semua kelar dalam waktu singkat rasanya. Foto wisuda, tanda tangan di baju, sampe nangis pas acara perpisahan.',
      photos: ['🎓', '💐', '✨']
    }
  ];

  return (
    <section id="linimasa" style={{ position: 'relative' }}>
      <div className="section-head">
        <span className="label">Perjalanan Kita</span>
        <h2>Linimasa 2020–2023</h2>
      </div>

      <div className="timeline">
        {defaultEvents.map((item, idx) => {
          const isRight = idx % 2 !== 0;
          return (
            <div key={item.year} className={`t-row ${isRight ? 'right' : ''}`}>
              <div className="t-dot"></div>
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
                  Lihat selengkapnya ({item.year}) →
                </button>
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
