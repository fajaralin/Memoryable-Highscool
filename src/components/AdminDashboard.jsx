import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Image as ImageIcon, Users, Music, Key, Trash2, Edit3, MessageSquare, Check, RefreshCw } from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose, refreshData }) {
  const [pin, setPin] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState('classPhoto'); // 'classPhoto', 'memories', 'members', 'songs', 'guestbook', 'settings'

  // Data States for Management List
  const [classPhotoData, setClassPhotoData] = useState({
    imageUrl: '/class_photo.webp',
    className: 'XII RPL 3 — SMK Angkatan 2020–2023',
    teacherName: 'Siti Mariatul Kiptiyah Spd. M.Pd',
    teacherRole: 'Guru Wali Kelas Utama',
    quote: '“Sukses selalu untuk kalian semua. Meskipun masa SMK diwarnai PJJ dan pandemi, kalian terbukti tangguh, kreatif, dan luar biasa!”',
    totalStudents: '36 Siswa'
  });
  const [memoriesList, setMemoriesList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [songsList, setSongsList] = useState([]);
  const [guestbookList, setGuestbookList] = useState([]);

  // Class Photo Edit Form
  const [classPhotoForm, setClassPhotoForm] = useState(classPhotoData);
  const [classPhotoFile, setClassPhotoFile] = useState(null);

  // Memory Form
  const [memoryForm, setMemoryForm] = useState({
    title: '',
    year: '2020',
    category: 'Sekolah',
    description: '',
    author: '',
    tags: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [imageFile, setImageFile] = useState(null);

  // Member Form
  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    quote: '',
    avatar: '',
    social: '',
    status: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);

  // Song Form
  const [songForm, setSongForm] = useState({
    title: '',
    artist: '',
    albumCover: '',
    audioUrl: '',
    tag: 'Nostalgia'
  });
  const [audioFile, setAudioFile] = useState(null);

  // Settings Form
  const [settingsForm, setSettingsForm] = useState({
    circlePasscode: '2023',
    adminPin: '1234'
  });

  const [statusMsg, setStatusMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all admin data lists
  const fetchAdminData = async () => {
    try {
      const [cpRes, memRes, mbrRes, sngRes, gbRes] = await Promise.all([
        fetch('/api/class-photo'),
        fetch('/api/memories'),
        fetch('/api/members'),
        fetch('/api/songs'),
        fetch('/api/guestbook')
      ]);
      if (cpRes.ok) {
        const cp = await cpRes.json();
        setClassPhotoData(cp);
        setClassPhotoForm(cp);
      }
      if (memRes.ok) setMemoriesList(await memRes.json());
      if (mbrRes.ok) setMembersList(await mbrRes.json());
      if (sngRes.ok) setSongsList(await sngRes.json());
      if (gbRes.ok) setGuestbookList(await gbRes.json());
    } catch (e) {
      console.log('Error fetching admin data', e);
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchAdminData();
    }
  }, [isAuth]);

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

  // Submit Save Class Photo & Homeroom Teacher Info
  const handleSaveClassPhoto = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('className', classPhotoForm.className);
    formData.append('teacherName', classPhotoForm.teacherName);
    formData.append('teacherRole', classPhotoForm.teacherRole);
    formData.append('quote', classPhotoForm.quote);
    formData.append('totalStudents', classPhotoForm.totalStudents);

    if (classPhotoFile) {
      formData.append('image', classPhotoFile);
    } else {
      formData.append('imageUrl', classPhotoForm.imageUrl);
    }

    try {
      const res = await fetch('/api/class-photo', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.classPhoto) {
          setClassPhotoData(data.classPhoto);
          localStorage.setItem('classPhotoInfo', JSON.stringify(data.classPhoto));
        }
        setStatusMsg('✅ Foto Kelas & Wali Kelas Berhasil Diperbarui!');
        setClassPhotoFile(null);
        refreshData();
        fetchAdminData();
      }
    } catch (err) {
      setStatusMsg('❌ Gagal mengupdate foto kelas.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Memory Photo
  const handleAddMemory = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', memoryForm.title);
    formData.append('year', memoryForm.year);
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
        setStatusMsg('✅ Foto & Cerita Kenangan Berhasil Ditambahkan!');
        setMemoryForm({
          title: '', year: '2020', category: 'Sekolah', description: '', author: '', tags: '', imageUrl: '', date: new Date().toISOString().split('T')[0]
        });
        setImageFile(null);
        refreshData();
        fetchAdminData();
      }
    } catch (err) {
      setStatusMsg('❌ Gagal mengunggah foto kenangan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMemory = async (id) => {
    if (!window.confirm('Yakin ingin menghapus foto kenangan ini?')) return;
    try {
      const res = await fetch(`/api/memories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg('🗑️ Foto kenangan berhasil dihapus.');
        refreshData();
        fetchAdminData();
      }
    } catch (e) {
      setStatusMsg('❌ Gagal menghapus foto.');
    }
  };

  // Submit Member
  const handleAddMember = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setIsLoading(true);

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
        fetchAdminData();
      }
    } catch (err) {
      setStatusMsg('❌ Gagal menambahkan anggota.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Yakin ingin menghapus profil anggota ini?')) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg('🗑️ Profil anggota berhasil dihapus.');
        refreshData();
        fetchAdminData();
      }
    } catch (e) {
      setStatusMsg('❌ Gagal menghapus anggota.');
    }
  };

  // Submit Song
  const handleAddSong = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setIsLoading(true);

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
        fetchAdminData();
      }
    } catch (err) {
      setStatusMsg('❌ Gagal menambahkan lagu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSong = async (id) => {
    if (!window.confirm('Yakin ingin menghapus lagu ini?')) return;
    try {
      const res = await fetch(`/api/songs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg('🗑️ Lagu berhasil dihapus.');
        refreshData();
        fetchAdminData();
      }
    } catch (e) {
      setStatusMsg('❌ Gagal menghapus lagu.');
    }
  };

  // Delete Guestbook Message
  const handleDeleteGuestbook = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pesan cerita ini?')) return;
    try {
      const res = await fetch(`/api/guestbook/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg('🗑️ Pesan cerita berhasil dihapus.');
        refreshData();
        fetchAdminData();
      }
    } catch (e) {
      setStatusMsg('❌ Gagal menghapus pesan.');
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
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="glass-card max-w-4xl w-full p-4 sm:p-8 rounded-3xl border border-amber-300 relative my-6 bg-white text-slate-900 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full"
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
              Masukkan PIN Admin untuk mengelola foto kelas, mading, lagu, dan profil anggota.
            </p>

            <form onSubmit={handleAdminAuth} className="space-y-4 pt-2">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Masukkan PIN Admin (Default: 1234)"
                className="w-full px-4 py-3 rounded-xl glass-input text-center text-base tracking-widest font-mono font-bold border border-slate-300"
                required
              />
              {authError && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {authError}
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/25"
              >
                Masuk Backend Admin
              </button>
            </form>
          </div>
        ) : (
          /* Admin CMS Content */
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-bold font-heading text-slate-900">
                  Panel Kelola Backend Kenangan (Admin)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={fetchAdminData}
                  className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
                </button>
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-teal-100 text-teal-900 border border-teal-300">
                  Online Sync
                </span>
              </div>
            </div>

            {/* Sub-tabs Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setAdminTab('classPhoto')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'classPhoto'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> Foto Kelas & Wali
              </button>

              <button
                onClick={() => setAdminTab('memories')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'memories'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> Galeri Mading ({memoriesList.length})
              </button>

              <button
                onClick={() => setAdminTab('members')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'members'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Users className="w-4 h-4" /> Anggota Circle ({membersList.length})
              </button>

              <button
                onClick={() => setAdminTab('songs')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'songs'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Music className="w-4 h-4" /> Playlist Lagu ({songsList.length})
              </button>

              <button
                onClick={() => setAdminTab('guestbook')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'guestbook'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Pesan Cerita ({guestbookList.length})
              </button>

              <button
                onClick={() => setAdminTab('settings')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'settings'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Key className="w-4 h-4" /> Pengaturan Akses
              </button>
            </div>

            {/* Status Feedback Message */}
            {statusMsg && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs font-semibold flex items-center justify-between">
                <span>{statusMsg}</span>
                <button onClick={() => setStatusMsg('')} className="text-teal-500 font-bold">✕</button>
              </div>
            )}

            {/* TAB 1: Edit Foto Kelas & Wali Kelas */}
            {adminTab === 'classPhoto' && (
              <div className="space-y-6">
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex gap-4 items-center flex-wrap sm:flex-nowrap">
                  <img
                    src={classPhotoData.imageUrl}
                    alt="Current Class Photo"
                    className="w-32 h-20 object-cover rounded-lg border border-amber-300 shadow-sm"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded">
                      FOTO AKTIF DI DATABASE
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{classPhotoData.className}</h4>
                    <p className="text-xs text-slate-600">Wali Kelas: {classPhotoData.teacherName}</p>
                  </div>
                </div>

                <form onSubmit={handleSaveClassPhoto} className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900">✏️ Edit Foto & Info Wali Kelas</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Upload Foto Baru (dari Laptop/HP):
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setClassPhotoFile(e.target.files[0])}
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Atau URL Foto Kelas (Online):
                      </label>
                      <input
                        type="text"
                        value={classPhotoForm.imageUrl}
                        onChange={(e) => setClassPhotoForm({ ...classPhotoForm, imageUrl: e.target.value })}
                        placeholder="https://... atau /class_photo.webp"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kelas & Angkatan:</label>
                      <input
                        type="text"
                        value={classPhotoForm.className}
                        onChange={(e) => setClassPhotoForm({ ...classPhotoForm, className: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Wali Kelas:</label>
                      <input
                        type="text"
                        value={classPhotoForm.teacherName}
                        onChange={(e) => setClassPhotoForm({ ...classPhotoForm, teacherName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Peran / Status Wali Kelas:</label>
                      <input
                        type="text"
                        value={classPhotoForm.teacherRole}
                        onChange={(e) => setClassPhotoForm({ ...classPhotoForm, teacherRole: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Siswa / Kapasitas:</label>
                      <input
                        type="text"
                        value={classPhotoForm.totalStudents}
                        onChange={(e) => setClassPhotoForm({ ...classPhotoForm, totalStudents: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pesan / Kesan Guru Wali Kelas:</label>
                    <textarea
                      rows="3"
                      value={classPhotoForm.quote}
                      onChange={(e) => setClassPhotoForm({ ...classPhotoForm, quote: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
                  >
                    {isLoading ? 'Menyimpan...' : '💾 Simpan Perubahan Foto Kelas ke Database'}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: Kelola Foto Galeri / Mading */}
            {adminTab === 'memories' && (
              <div className="space-y-6">
                <form onSubmit={handleAddMemory} className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-900">📷 Tambah Foto Kenangan Baru</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Judul Foto Mading:</label>
                      <input
                        type="text"
                        value={memoryForm.title}
                        onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                        placeholder="Contoh: Foto Mabar Discord 2020"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Kenangan:</label>
                      <select
                        value={memoryForm.year}
                        onChange={(e) => setMemoryForm({ ...memoryForm, year: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      >
                        <option value="2020">2020 (PJJ & Covid)</option>
                        <option value="2021">2021 (Hybrid Class & Game)</option>
                        <option value="2022">2022 (Offline & PKL)</option>
                        <option value="2023">2023 (Wisuda & Perpisahan)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Upload Berkas Foto:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Atau URL Gambar Online:</label>
                      <input
                        type="text"
                        value={memoryForm.imageUrl}
                        onChange={(e) => setMemoryForm({ ...memoryForm, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi / Cerita Singkat:</label>
                    <textarea
                      rows="2"
                      value={memoryForm.description}
                      onChange={(e) => setMemoryForm({ ...memoryForm, description: e.target.value })}
                      placeholder="Ceritakan momen seru di balik foto ini..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                  >
                    {isLoading ? 'Mengunggah...' : '+ Tambah Foto ke Mading'}
                  </button>
                </form>

                {/* List Existing Memories */}
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-3">Daftar Foto Kenangan Terdaftar ({memoriesList.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {memoriesList.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 gap-3">
                        <img src={m.imageUrl} alt={m.title} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{m.title}</p>
                          <p className="text-[10px] text-slate-500">Tahun {m.year || '2020-2023'}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteMemory(m.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg"
                          title="Hapus Foto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Kelola Anggota Circle */}
            {adminTab === 'members' && (
              <div className="space-y-6">
                <form onSubmit={handleAddMember} className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-900">👥 Tambah Anggota Circle Baru</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Anggota:</label>
                      <input
                        type="text"
                        value={memberForm.name}
                        onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                        placeholder="Contoh: Rian 'Tech Guy'"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Role / Peran di Circle:</label>
                      <input
                        type="text"
                        value={memberForm.role}
                        onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                        placeholder="Contoh: Ketua Circle / Seksi Konsumsi"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Upload Foto Avatar:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatarFile(e.target.files[0])}
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Atau URL Avatar Online:</label>
                      <input
                        type="text"
                        value={memberForm.avatar}
                        onChange={(e) => setMemberForm({ ...memberForm, avatar: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Quote Khas Masa Sekolah:</label>
                    <input
                      type="text"
                      value={memberForm.quote}
                      onChange={(e) => setMemberForm({ ...memberForm, quote: e.target.value })}
                      placeholder="“Candaan khas anggota...”"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                  >
                    {isLoading ? 'Menambahkan...' : '+ Tambah Anggota Circle'}
                  </button>
                </form>

                {/* List Existing Members */}
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-3">Daftar Anggota Terdaftar ({membersList.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {membersList.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 gap-3">
                        <img src={m.avatar} alt={m.name} className="w-10 h-10 object-cover rounded-full flex-shrink-0 border" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{m.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{m.role}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteMember(m.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg"
                          title="Hapus Anggota"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Kelola Playlist Lagu */}
            {adminTab === 'songs' && (
              <div className="space-y-6">
                <form onSubmit={handleAddSong} className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-900">🎵 Tambah Lagu Kenangan Baru</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Judul Lagu:</label>
                      <input
                        type="text"
                        value={songForm.title}
                        onChange={(e) => setSongForm({ ...songForm, title: e.target.value })}
                        placeholder="Contoh: Monokrom"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Penyanyi / Band:</label>
                      <input
                        type="text"
                        value={songForm.artist}
                        onChange={(e) => setSongForm({ ...songForm, artist: e.target.value })}
                        placeholder="Contoh: Tulus"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Upload Berkas MP3:</label>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setAudioFile(e.target.files[0])}
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Atau URL Audio MP3 Online:</label>
                      <input
                        type="text"
                        value={songForm.audioUrl}
                        onChange={(e) => setSongForm({ ...songForm, audioUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                  >
                    {isLoading ? 'Menambahkan...' : '+ Tambah Lagu ke Playlist'}
                  </button>
                </form>

                {/* List Songs */}
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-3">Daftar Lagu Terdaftar ({songsList.length})</h4>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {songsList.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{s.title}</p>
                          <p className="text-[10px] text-slate-500 truncate">{s.artist}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteSong(s.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg"
                          title="Hapus Lagu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Kelola Pesan Cerita / Guestbook */}
            {adminTab === 'guestbook' && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-900">💬 Kelola Pesan Mading Cerita ({guestbookList.length})</h4>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {guestbookList.map((g) => (
                    <div key={g.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{g.sticker} {g.name}</span>
                        <p className="text-xs text-slate-600 mt-1">{g.message}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteGuestbook(g.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg flex-shrink-0"
                        title="Hapus Pesan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: Pengaturan PIN Admin & Passcode */}
            {adminTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-md mx-auto py-2">
                <h4 className="font-bold text-sm text-slate-900 text-center">⚙️ Pengaturan Akses Circle & Admin</h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Passcode Rahasia Circle (Pengunjung):</label>
                  <input
                    type="text"
                    value={settingsForm.circlePasscode}
                    onChange={(e) => setSettingsForm({ ...settingsForm, circlePasscode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-center"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PIN Rahasia Backend Admin:</label>
                  <input
                    type="password"
                    value={settingsForm.adminPin}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-center"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                >
                  Simpan Pengaturan Akses
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
