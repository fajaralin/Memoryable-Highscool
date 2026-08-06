import React, { useState } from 'react';
import { Quote, Send, MessageCircle } from 'lucide-react';

export default function CircleRoster({ members = [], onSendNote }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [noteMessage, setNoteMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!noteMessage.trim()) return;

    if (onSendNote) {
      onSendNote({
        name: senderName.trim() || 'Teman Circle',
        message: `[Untuk ${selectedMember.name}]: ${noteMessage.trim()}`,
        sticker: '💬'
      });
    }

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setNoteMessage('');
      setSenderName('');
      setSelectedMember(null);
    }, 1500);
  };

  return (
    <section id="roster">
      <div className="section-head">
        <span className="label">Circle Core Squad</span>
        <h2>Anggota Circle Kita</h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '28px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {members.map((member, idx) => (
          <div
            key={member.id || idx}
            className="polaroid"
            style={{
              transform: `rotate(${((idx % 4) - 1.5) * 2}deg)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div className="frame" style={{ height: '180px' }}>
                <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <h3 className="font-caveat" style={{ fontSize: '1.6rem', color: 'var(--ink)', margin: 0 }}>
                  {member.name}
                </h3>
                <span className="font-special" style={{ fontSize: '0.68rem', color: 'var(--maroon)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {member.role || 'Circle Core'}
                </span>
              </div>

              {/* Quote */}
              <div style={{
                marginTop: '10px',
                padding: '8px 10px',
                background: 'rgba(234, 224, 205, 0.5)',
                borderRadius: '4px',
                fontSize: '0.9rem',
                color: 'var(--ink-soft)'
              }} className="font-caveat">
                "{member.quote || 'Kenangan SMK tak terlupakan.'}"
              </div>
            </div>

            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed rgba(35,48,74,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--teal)' }} className="font-special">
                <span>{member.status}</span>
                <span>{member.social}</span>
              </div>

              <button
                onClick={() => setSelectedMember(member)}
                className="t-more font-special"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                💌 Titip pesan ke {member.name.split(' ')[0]}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Secret Message Modal */}
      {selectedMember && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 className="font-caveat" style={{ fontSize: '2rem', color: 'var(--ink)', margin: '0 0 8px' }}>
              Titip Pesan untuk {selectedMember.name}
            </h3>
            <p className="font-special" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginBottom: '16px' }}>
              Pesan ini akan tertempel otomatis di Sticky Notes Buku Tamu!
            </p>

            {sentSuccess ? (
              <div style={{ padding: '16px', background: 'var(--teal)', color: '#fff', borderRadius: '4px', textAlign: 'center' }} className="font-special">
                ✨ Pesan kamu berhasil ditempelkan di Buku Tamu!
              </div>
            ) : (
              <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Namamu di circle..."
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="paper-input"
                  required
                />
                <textarea
                  placeholder={`Tulis pesan atau cerita seru buat ${selectedMember.name}...`}
                  value={noteMessage}
                  onChange={(e) => setNoteMessage(e.target.value)}
                  className="paper-input"
                  rows={4}
                  required
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="fake-btn">Kirim Pesan</button>
                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
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
            )}
          </div>
        </div>
      )}
    </section>
  );
}
