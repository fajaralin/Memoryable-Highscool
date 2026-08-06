import React, { useState } from 'react';
import { Lock, Sparkles, Key, HelpCircle, HeartHandshake } from 'lucide-react';

export default function PasscodeGate({ onUnlock }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onUnlock();
      } else {
        setError(data.message || 'Passcode salah!');
      }
    } catch (err) {
      // Fallback local check if server offline
      if (passcode.trim() === '2023') {
        onUnlock();
      } else {
        setError('Kode salah! Hint: Tahun kelulusan circle kita (4 angka)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-glow flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center relative z-10 border border-slate-800 shadow-2xl">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-teal-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/10">
          <Lock className="w-10 h-10 text-amber-400" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Circle Sanctuary Passcode
        </span>

        <h1 className="text-3xl font-extrabold font-heading bg-gradient-to-r from-amber-200 via-slate-100 to-teal-200 bg-clip-text text-transparent mb-2">
          Kenangan SMK 2020–2023
        </h1>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          Satu tempat khusus untuk circle kita mengenang masa PJJ Covid, warkop, magang, hingga hari wisuda.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Masukkan Passcode Circle..."
              className="w-full px-5 py-3.5 rounded-2xl glass-input text-center text-lg tracking-widest font-mono font-bold focus:ring-2 focus:ring-amber-500/50"
              required
            />
            <Key className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              <>
                <HeartHandshake className="w-5 h-5" /> Buka Kenangan Circle
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => setShowHint(!showHint)}
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4" /> Hint Passcode
          </button>
          <span className="font-mono text-slate-500">Default: 2023</span>
        </div>

        {showHint && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
            💡 <strong>Petunjuk:</strong> Masukkan 4 angka tahun kelulusan SMK kita (contoh: <code>2023</code>).
          </div>
        )}
      </div>
    </div>
  );
}
