import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  User,
  Sparkles,
  Cloud,
  CheckCircle2,
  LogOut,
  ExternalLink,
  Code2,
  Mail,
  Loader2,
  Edit3,
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    firebaseUser,
    isFirestoreConnected,
    loginWithGoogle,
    loginAnonymously,
    logout,
    updateProfileData,
    theme,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [tagline, setTagline] = useState(currentUser.tagline);
  const [bio, setBio] = useState(currentUser.bio);
  const [location, setLocation] = useState(currentUser.location || '');
  const [website, setWebsite] = useState(currentUser.website || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [skillsStr, setSkillsStr] = useState(currentUser.skills.join(', '));
  const [collabStatus, setCollabStatus] = useState(currentUser.collaborationStatus);

  useEffect(() => {
    setName(currentUser.name);
    setUsername(currentUser.username);
    setTagline(currentUser.tagline);
    setBio(currentUser.bio);
    setLocation(currentUser.location || '');
    setWebsite(currentUser.website || '');
    setAvatar(currentUser.avatar);
    setSkillsStr(currentUser.skills.join(', '));
    setCollabStatus(currentUser.collaborationStatus);
  }, [currentUser]);

  if (!isAuthModalOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const skillsArray = skillsStr
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await updateProfileData({
        name: name.trim() || 'Anonymous Builder',
        username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || 'builder',
        tagline: tagline.trim(),
        bio: bio.trim(),
        location: location.trim(),
        website: website.trim(),
        avatar: avatar.trim(),
        skills: skillsArray.length > 0 ? skillsArray : ['AI', 'Builder'],
        collaborationStatus: collabStatus,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile in Firestore');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Popup was blocked or closed. You can also use 1-Click Guest Sign-In below.');
      } else {
        setErrorMessage(err.message || 'Sign in error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await loginAnonymously();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Anonymous sign in error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Logout error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs">
      <div
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-slate-100">Account & Profile Settings</h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {isFirestoreConnected ? 'Cloud Sync Active' : 'Connecting to Cloud...'}
                </span>
                <span className="text-slate-400">• Firestore</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 text-xs font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`pb-2.5 px-3 text-xs font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'account'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Auth & Cloud Sync</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <span className="font-semibold">Error:</span> {errorMessage}
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-medium block mb-1.5 text-slate-700 dark:text-slate-300">Avatar Photo</label>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={avatar}
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-600 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <input
                      type="url"
                      value={avatar}
                      onChange={e => setAvatar(e.target.value)}
                      placeholder="https://... image URL"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">Paste custom image link or select preset:</span>
                  </div>
                </div>

                {/* Avatar presets */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(preset)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 cursor-pointer shrink-0 ${
                        avatar === preset ? 'border-indigo-600 ring-2 ring-indigo-400' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt={`preset-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name and Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1 text-slate-700 dark:text-slate-300">Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1 text-slate-700 dark:text-slate-300">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="text-xs font-medium block mb-1 text-slate-700 dark:text-slate-300">Tagline / Role</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="e.g. AI Researcher • Designer • Software Engineer"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-medium block mb-1 text-slate-700 dark:text-slate-300">Bio / About</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell the community what you are working on..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="text-xs font-medium block mb-1 text-slate-700 dark:text-slate-300">Skills (comma separated)</label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={e => setSkillsStr(e.target.value)}
                  placeholder="Python, React, TypeScript, Product Design"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Location & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1 text-slate-700 dark:text-slate-300">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="City, Country or Remote"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1 text-slate-700 dark:text-slate-300">Website or GitHub</label>
                  <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Collaboration Status */}
              <div>
                <label className="text-xs font-medium block mb-1.5 text-slate-700 dark:text-slate-300">Collaboration Status</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'open_for_collab', label: '🤝 Open for Collab' },
                    { id: 'building_team', label: '🚀 Building Team' },
                    { id: 'mentoring', label: '💡 Mentoring' },
                    { id: 'focused', label: '🔒 Deep Focus' },
                  ].map(status => (
                    <label
                      key={status.id}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        collabStatus === status.id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="collabStatus"
                        value={status.id}
                        checked={collabStatus === status.id}
                        onChange={() => setCollabStatus(status.id as any)}
                        className="hidden"
                      />
                      <span>{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Profile */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Cloud Connection Summary */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Database Status</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-medium">
                    Connected
                  </span>
                </div>
                <div className="text-xs space-y-1.5">
                  <p className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Database:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">Cloud Firestore</span>
                  </p>
                  <p className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Sync Mode:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Real-time</span>
                  </p>
                </div>
              </div>

              {/* Current Auth User */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Current User</span>
                <div className="flex items-center gap-3 pt-1">
                  <img src={currentUser.avatar} alt="Current" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{currentUser.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {firebaseUser ? (firebaseUser.email || `UID: ${firebaseUser.uid.slice(0, 12)}...`) : 'Active User'}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 rounded-md">
                    Reputation: {currentUser.identityScore}
                  </span>
                </div>
              </div>

              {/* Auth Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  onClick={handleAnonymousSignIn}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Continue as Guest</span>
                </button>

                {firebaseUser && (
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full py-2 px-4 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center gap-1.5 cursor-pointer transition-colors mt-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
