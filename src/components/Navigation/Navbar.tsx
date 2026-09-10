import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  CheckCheck,
  Briefcase,
  Users,
  FolderGit2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  User as UserIcon,
  Cloud,
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenSearch?: () => void }> = ({ onOpenSearch }) => {
  const {
    currentUser,
    setCurrentUser,
    users,
    theme,
    setTheme,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsComposerOpen,
    setActiveView,
    setSelectedUserProfileId,
    isFirestoreConnected,
    firebaseUser,
    setIsAuthModalOpen,
  } = useApp();

  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [selectedNotifFilter, setSelectedNotifFilter] = useState<string>('all');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifs = notifications.filter(n => {
    if (selectedNotifFilter === 'all') return true;
    return n.category === selectedNotifFilter;
  });

  return (
    <header
      id="nexora-navbar"
      className="sticky top-0 z-40 w-full border-b transition-colors duration-200 bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 nexora-glass"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <button
            id="brand-home-btn"
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
          >
            {/* Clean Modern Logo Symbol */}
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-700 transition-colors">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5"
                strokeWidth="2.4"
                stroke="currentColor"
              >
                <circle cx="5" cy="5" r="2" fill="currentColor" />
                <circle cx="19" cy="5" r="2" fill="currentColor" />
                <circle cx="12" cy="19" r="2" fill="currentColor" />
                <path d="M5 7v10M19 7v10M5 7l14 10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                NEXORA
              </span>
              <span className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                Ideas to Communities & Projects
              </span>
            </div>
          </button>
        </div>

        {/* Center: Universal Search Input Trigger */}
        <div className="hidden sm:block w-48 md:w-60">
          <button
            id="global-search-trigger"
            onClick={() => (onOpenSearch ? onOpenSearch() : setActiveView('discover'))}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs sm:text-sm transition-all duration-200 cursor-pointer bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-indigo-500" />
              <span>Search</span>
            </div>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real Firebase Cloud Connection Indicator */}
          <button
            id="nav-cloud-status-btn"
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition-all cursor-pointer bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
            title="Firebase Real-Time Cloud Database & Profile Settings"
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isFirestoreConnected ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
            <span className="hidden md:inline text-[11px] font-medium text-slate-700 dark:text-slate-300">
              {isFirestoreConnected ? 'Live Sync' : 'Connecting'}
            </span>
          </button>

          {/* Mobile search button */}
          <button
            id="mobile-search-btn"
            onClick={() => (onOpenSearch ? onOpenSearch() : setActiveView('discover'))}
            className="sm:hidden p-2 rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Universal Create Button */}
          <button
            id="create-action-btn"
            onClick={() => setIsComposerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Create Post</span>
          </button>

          {/* Messages Quick Button */}
          <button
            id="nav-messages-btn"
            onClick={() => setActiveView('messages')}
            className="relative p-2 rounded-xl border transition-colors cursor-pointer bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Messages"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
          </button>

          {/* Notifications Trigger & Dropdown */}
          <div className="relative">
            <button
              id="notifications-bell-btn"
              onClick={() => setIsNotifsOpen(!isNotifsOpen)}
              className="relative p-2 rounded-xl border transition-colors cursor-pointer bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-600 text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Menu */}
            {isNotifsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark read
                    </button>
                  )}
                </div>

                {/* Categories Filter */}
                <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar text-xs">
                  {['all', 'projects', 'spaces', 'social', 'opportunities'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedNotifFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer ${
                        selectedNotifFilter === cat
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Notifications List */}
                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {filteredNotifs.length === 0 ? (
                    <p className="text-center py-6 text-xs text-slate-500 dark:text-slate-400">No notifications in this category</p>
                  ) : (
                    filteredNotifs.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          setIsNotifsOpen(false);
                          if (notif.actionUrl?.includes('project')) {
                            setActiveView('projects');
                          } else if (notif.actionUrl?.includes('space')) {
                            setActiveView('spaces');
                          } else if (notif.actionUrl?.includes('messages')) {
                            setActiveView('messages');
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          !notif.isRead
                            ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <img
                            src={notif.actor.avatar}
                            alt={notif.actor.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs leading-snug text-slate-900 dark:text-slate-100">{notif.title}</p>
                            <p className="line-clamp-2 mt-0.5 text-slate-600 dark:text-slate-400">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 block">{notif.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl border transition-colors cursor-pointer bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Identity Button & Account Switcher Dropdown */}
          <div className="relative">
            <button
              id="user-profile-menu-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl border transition-all cursor-pointer bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs"
            >
              <div className="relative w-7 h-7">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
              </div>

              <span className="hidden md:inline font-medium text-xs truncate max-w-[100px] text-slate-800 dark:text-slate-200">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>

            {/* User Menu & Account Switcher */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-3 z-50 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">@{currentUser.username}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">{currentUser.tagline}</p>
                </div>

                <div className="py-2 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <span className="font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      Edit Profile & Cloud Sync
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                      LIVE
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedUserProfileId(currentUser.id);
                      setActiveView('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span>View Profile & Portfolio</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('graph');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span>Community Network Graph</span>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2 mb-1.5">
                    Switch Perspective (Demo)
                  </p>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {users.filter((u, index, self) => self.findIndex(o => o.id === u.id) === index).map((u, index) => (
                      <button
                        key={`${u.id}-${index}`}
                        onClick={() => {
                          setCurrentUser(u);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          u.id === currentUser.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                        <span className="truncate">{u.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
