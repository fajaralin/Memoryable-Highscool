import React, { useState } from 'react';

export default function MemoryWall({ messages = [], onPostMessage }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await onPostMessage({
        name: name.trim() || 'Teman Circle',
        message: message.trim(),
        sticker: '✨'
      });
      setMessage('');
      setName('');
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="cerita">
      <div className="section-head">
        <span className="label">Buku Tamu</span>
        <h2>Cerita dari Kita</h2>
      </div>

      <div className="notes-board">
        {messages.map((item, idx) => (
          <div key={item.id || idx} className="note">
            “{item.message}”
            <span className="who">— {item.name}</span>
          </div>
        ))}

        {/* Input Form Card */}
        <div className="note-add">
          <span className="label">Tambahkan Ceritamu</span>
          <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
            <input
              type="text"
              placeholder="Namamu di circle..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="paper-input"
              style={{ maxWidth: '520px', margin: '0 auto 10px', display: 'block' }}
              required
            />
            <textarea
              placeholder="Tulis kenangan atau momen receh kamu di sini (PJJ, Zoom, Prakerin, Warkop, Kelulusan)..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="paper-input"
              rows={3}
              style={{ maxWidth: '520px', margin: '0 auto', display: 'block' }}
              required
            />
            <button type="submit" disabled={isSubmitting} className="fake-btn" style={{ marginTop: '14px' }}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Cerita'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
