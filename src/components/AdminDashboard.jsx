import React, { useState } from 'react';
import { ShieldCheck, Plus, Image as ImageIcon, Users, Music, Key, Check } from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose, refreshData }) {
  const [pin, setPin] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState('memories'); // 'memories', 'members', 'songs', 'settings'

  // Forms State
  const [memoryForm, setMemoryForm] = useState({
    title: '',
    category: 'Sekolah',
    description: '',
    author: '',
    tags: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [imageFile, setImageFile] = useState(null);

  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    quote: '',
    avatar: '',
    social: '',
    status: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);

  const [songForm, setSongForm] = useState({
    title: '',
    artist: '',
    albumCover: '',
    audioUrl: '',
    tag: 'Nostalgia'
  });
  const [audioFile, setAudioFile] = useState(null);

  const [settingsForm, setSettingsForm] = useState({
    circlePasscode: '2023',
    adminPin: '1234'
  });

  const [statusMsg, setStatusMsg] = useState('');

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuth(true);
      } else {
        setAuthError(data.message || 'PIN Admin Salah!');
      }
    } catch (err) {
      if (pin.trim() === '1234') {
        setIsAuth(true);
      } else {
        setAuthError('PIN Admin Salah! (Default: 1234)');
      }
    }
  };

  // Submit Memory
  const handleAddMemory = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    const formData = new FormData();
    formData.append('title', memoryForm.title);
    formData.append('category', memoryForm.category);
    formData.append('description', memoryForm.description);
    formData.append('author', memoryForm.author);
    formData.append('tags', memoryForm.tags);
    formData.append('date', memoryForm.date);
    if (imageFile) {
      formData.append('image', imageFile);
    } else {
      formData.append('imageUrl', memoryForm.imageUrl);
    }

    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setStatusMsg('✅ Foto & Cerita Berhasil Diunggah!');
        setMemoryForm({
          title: '', category: 'Sekolah', description: '', author: '', tags: '', imageUrl: '', date: new Date().toISOString().split('T')[0]
        });
        setImageFile(null);
        refreshData();
      }
    } catch (err) {
      setStatusMsg('❌ Gagal mengunggah foto.');
    }
  };

  // Submit Member
  const handleAddMember = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    const formData = new FormData();
    formData.append('name', memberForm.name);
    formData.append('role', memberForm.role);
    formData.append('quote', memberForm.quote);
    formData.append('social', memberForm.social);
    formData.append('status', memberForm.status);
    if (avatarFile) {
      formData.append('avatarFile', avatarFile);
    } else {
      formData.append('avatar', memberForm.avatar);
    }

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setStatusMsg('✅ Anggota Circle Berhasil Ditambahkan!');
        setMemberForm({ name: '', role: '', quote: '', avatar: '', social: '', status: '' });
        setAvatarFile(null);
        refreshData();
      }
    } catch (err) {
      setStatusMsg('❌ Gagal menambahkan anggota.');
    }
  };

  // Submit Song
  const handleAddSong = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    const formData = new FormData();
    formData.append('title', songForm.title);
    formData.append('artist', songForm.artist);
    formData.append('albumCover', songForm.albumCover);
    formData.append('tag', songForm.tag);
    if (audioFile) {
      formData.append('audioFile', audioFile);
    } else {
      formData.append('audioUrl', songForm.audioUrl);
    }

    try {
      const res = await fetch('/api/songs', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setStatusMsg('✅ Lagu Kenangan Berhasil Ditambahkan!');
        setSongForm({ title: '', artist: '', albumCover: '', audioUrl: '', tag: 'Nostalgia' });
        setAudioFile(null);
        refreshData();
      }
    } catch (err) {
      setStatusMsg('❌ Gagal menambahkan lagu.');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        setStatusMsg('✅ Pengaturan Akses Berhasil Diperbarui!');
      }
    } catch (err) {
      setStatusMsg('❌ Gagal menyimpan pengaturan.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-3xl w-full p-6 sm:p-8 rounded-3xl border border-amber-300 relative my-8 bg-white text-slate-900 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          ✕
        </button>

        {!isAuth ? (
          /* Login PIN Admin */
          <div className="max-w-md mx-auto text-center space-y-4 py-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-slate-900">
              Akses Admin Backend
            </h3>
            <p className="text-xs text-slate-500">
              Masukkan PIN Admin untuk mengelola foto, cerita, lagu, dan profil anggota.
            </p>

            <form onSubmit={handleAdminAuth} className="space-y-4 pt-2">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Masukkan PIN Admin (Default: 1234)"
                className="w-full px-4 py-3 rounded-xl glass-input text-center text-base tracking-widest font-mono font-bold"
                required
              />
              {authError && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {authError}
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25"
              >
                Masuk Backend Admin
              </button>
            </form>
          </div>
        ) : (
          /* Admin CMS Content */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-bold font-heading text-slate-900">
                  Panel Kelola Kenangan (Admin)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-300">
                Logged in
              </span>
            </div>

            {/* Admin Subtabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
              <button
                onClick={() => setAdminTab('memories')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  adminTab === 'memories' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-amber-50'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> Upload Foto & Cerita
              </button>
              <button
                onClick={() => setAdminTab('members')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  adminTab === 'members' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-amber-50'
                }`}
              >
                <Users className="w-4 h-4" /> Profil Anggota Circle
              </button>
              <button
                onClick={() => setAdminTab('songs')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  adminTab === 'songs' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-amber-50'
                }`}
              >
                <Music className="w-4 h-4" /> Tambah Lagu MP3
              </button>
              <button
                onClick={() => setAdminTab('settings')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  adminTab === 'settings' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-amber-50'
                }`}
              >
                <Key className="w-4 h-4" /> Pengaturan Admin PIN
              </button>
            </div>

            {statusMsg && (
              <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
                {statusMsg}
              </div>
            )}

            {/* Subtab 1: Memories Form */}
            {adminTab === 'memories' && (
              <form onSubmit={handleAddMemory} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kenangan</label>
                    <input
                      type="text"
                      value={memoryForm.title}
                      onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                      placeholder="Misal: Foto Mabar PJJ Covid 2020"
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                    <select
                      value={memoryForm.category}
                      onChange={(e) => setMemoryForm({ ...memoryForm, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-xs bg-white"
                    >
                      <option value="Online Class">Online Class</option>
                      <option value="Nongkrong">Nongkrong</option>
                      <option value="Sekolah">Sekolah</option>
                      <option value="PKL">PKL / Magang</option>
                      <option value="Farewell">Farewell / Kelulusan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Upload File Gambar</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full p-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Atau Image URL</label>
                    <input
                      type="url"
                      value={memoryForm.imageUrl}
                      onChange={(e) => setMemoryForm({ ...memoryForm, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cerita di Balik Foto</label>
                  <textarea
                    value={memoryForm.description}
                    onChange={(e) => setMemoryForm({ ...memoryForm, description: e.target.value })}
                    placeholder="Ceritakan kejadian seru, lucu, atau haru..."
                    rows={4}
                    className="w-full p-3 rounded-xl glass-input text-xs leading-relaxed"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Penulis Cerita</label>
                    <input
                      type="text"
                      value={memoryForm.author}
                      onChange={(e) => setMemoryForm({ ...memoryForm, author: e.target.value })}
                      placeholder="Nama kamu / Anggota Circle"
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tags (pisahkan koma)</label>
                    <input
                      type="text"
                      value={memoryForm.tags}
                      onChange={(e) => setMemoryForm({ ...memoryForm, tags: e.target.value })}
                      placeholder="PJJ, Discord, Covid"
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Simpan Foto & Cerita
                </button>
              </form>
            )}

            {/* Subtab 2: Members Form */}
            {adminTab === 'members' && (
              <form onSubmit={handleAddMember} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Anggota Circle</label>
                    <input
                      type="text"
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      placeholder="Rian 'Kuncen Discord'"
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Peran / Role di Sekolah</label>
                    <input
                      type="text"
                      value={memberForm.role}
                      onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                      placeholder="Seksi Konsumsi / Tech Guy"
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quote Khas Pas SMK</label>
                  <input
                    type="text"
                    value={memberForm.quote}
                    onChange={(e) => setMemberForm({ ...memberForm, quote: e.target.value })}
                    placeholder="“Bentar bang, emak gua nyuruh beli beras...”"
                    className="w-full p-2.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Upload Foto Profil</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files[0])}
                      className="w-full p-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Atau Avatar URL</label>
                    <input
                      type="url"
                      value={memberForm.avatar}
                      onChange={(e) => setMemberForm({ ...memberForm, avatar: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Tambah Profil Anggota
                </button>
              </form>
            )}

            {/* Subtab 3: Songs Form */}
            {adminTab === 'songs' && (
              <form onSubmit={handleAddSong} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Lagu</label>
                    <input
                      type="text"
                      value={songForm.title}
                      onChange={(e) => setSongForm({ ...songForm, title: e.target.value })}
                      placeholder="Monokrom"
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Penyanyi / Artist</label>
                    <input
                      type="text"
                      value={songForm.artist}
                      onChange={(e) => setSongForm({ ...songForm, artist: e.target.value })}
                      placeholder="Tulus"
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Upload File MP3</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setAudioFile(e.target.files[0])}
                      className="w-full p-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Atau Audio Direct URL (.mp3)</label>
                    <input
                      type="url"
                      value={songForm.audioUrl}
                      onChange={(e) => setSongForm({ ...songForm, audioUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Tambah Lagu ke Jukebox
                </button>
              </form>
            )}

            {/* Subtab 4: Security Settings */}
            {adminTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PIN Admin CMS</label>
                  <input
                    type="password"
                    value={settingsForm.adminPin}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                    className="w-full p-2.5 rounded-xl glass-input text-xs font-mono font-bold"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">PIN untuk membuka dashboard admin backend ini.</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" /> Simpan PIN Admin
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
