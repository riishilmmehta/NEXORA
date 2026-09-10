import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, X, Sparkles, Clock, ArrowRight } from 'lucide-react';

export const MomentsBar: React.FC = () => {
  const {
    moments,
    createMoment,
    currentUser,
    theme,
    activeMomentIndex,
    setActiveMomentIndex,
  } = useApp();

  const [isAddMomentOpen, setIsAddMomentOpen] = useState(false);
  const [momentMedia, setMomentMedia] = useState('');
  const [momentCaption, setMomentCaption] = useState('');
  const [momentType, setMomentType] = useState<any>('progress');

  const handleCreateMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!momentMedia.trim() && !momentCaption.trim()) return;
    createMoment(
      momentMedia.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      momentCaption.trim(),
      momentType
    );
    setMomentMedia('');
    setMomentCaption('');
    setIsAddMomentOpen(false);
  };

  const activeMoment = activeMomentIndex !== null ? moments[activeMomentIndex] : null;

  return (
    <>
      <div
        id="nexora-moments-bar"
        className="w-full flex items-center gap-3 overflow-x-auto no-scrollbar py-2"
      >
        {/* Add Moment Button */}
        <button
          onClick={() => setIsAddMomentOpen(true)}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group focus:outline-none"
        >
          <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 group-hover:border-indigo-500 group-hover:text-indigo-600 transition-colors flex items-center justify-center">
            <Plus className="w-5 h-5" strokeWidth={2} />
          </div>
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 text-center truncate max-w-[64px]">New</span>
        </button>

        {/* Moments List */}
        {(moments || []).map((mom, idx) => (
          <button
            key={mom.id}
            onClick={() => setActiveMomentIndex(idx)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group focus:outline-none"
          >
            <div className="relative w-14 h-14 rounded-2xl p-[2px] ring-2 ring-indigo-500/80 group-hover:ring-indigo-600 transition-all">
              <img
                src={mom.media}
                alt={mom.caption}
                className="w-full h-full rounded-[14px] object-cover"
              />
            </div>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[64px] text-center">
              {mom.author.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Fullscreen Moment Viewer Modal */}
      {activeMoment && (
        <div
          id="moment-viewer-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 nexora-glass animate-in fade-in duration-200"
        >
          <div
            className={`relative w-full max-w-sm h-[80vh] rounded-3xl overflow-hidden border shadow-2xl flex flex-col justify-between p-4 ${
              theme === 'dark' ? 'border-white/[0.15]' : 'border-white/20'
            }`}
          >
            {/* Background Image with Gradient Overlay */}
            <img
              src={activeMoment.media}
              alt={activeMoment.caption}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />

            {/* Header: Author & Countdown */}
            <div className="relative z-10 space-y-2">
              {/* Progress Line */}
              <div className="w-full h-1 rounded-full bg-white/30 overflow-hidden">
                <div className="w-2/3 h-full bg-cyan-400 animate-pulse" />
              </div>

              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <img
                    src={activeMoment.author.avatar}
                    alt={activeMoment.author.name}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/20"
                  />
                  <div>
                    <span className="font-bold text-xs">{activeMoment.author.name}</span>
                    <div className="flex items-center gap-1 text-[10px] text-cyan-300">
                      <Clock className="w-3 h-3" />
                      <span>Expires in {activeMoment.expiresInHours}h</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveMomentIndex(null)}
                  className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Caption */}
            <div className="relative z-10 space-y-2 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                {activeMoment.type.replace('_', ' ')}
              </span>
              <p className="text-sm font-medium leading-snug drop-shadow-md">
                {activeMoment.caption}
              </p>

              {/* Next / Previous Navigator */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={activeMomentIndex === 0}
                  onClick={() => setActiveMomentIndex(Math.max(0, activeMomentIndex! - 1))}
                  className="text-xs text-white/70 hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  ← Prev
                </button>
                <button
                  disabled={activeMomentIndex === moments.length - 1}
                  onClick={() => setActiveMomentIndex(Math.min(moments.length - 1, activeMomentIndex! + 1))}
                  className="text-xs text-white font-bold hover:underline cursor-pointer"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Moment Dialog */}
      {isAddMomentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4 text-slate-900 dark:text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <h3 className="font-semibold text-sm">Post a 24-Hour Update</h3>
              </div>
              <button
                onClick={() => setIsAddMomentOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMoment} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={momentMedia}
                  onChange={e => setMomentMedia(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={momentCaption}
                  onChange={e => setMomentCaption(e.target.value)}
                  placeholder="What are you building or exploring right now?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMomentOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs cursor-pointer shadow-xs"
                >
                  Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
