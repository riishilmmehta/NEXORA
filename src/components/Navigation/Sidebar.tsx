import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Compass,
  Layers,
  FolderGit2,
  MessageSquare,
  Bookmark,
  Briefcase,
  Share2,
  Sparkles,
  Plus,
  Flame,
  ArrowUpRight,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    theme,
    spaces,
    setSelectedSpaceId,
    setIsComposerOpen,
    setDefaultComposerType,
  } = useApp();

  const navItems = [
    { id: 'home', label: 'Home Feed', icon: Home, badge: null },
    { id: 'discover', label: 'Explore', icon: Compass, badge: 'Hot' },
    { id: 'spaces', label: 'Communities', icon: Layers, badge: null },
    { id: 'projects', label: 'Projects', icon: FolderGit2, badge: null },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: null },
    { id: 'collections', label: 'Collections', icon: Bookmark, badge: null },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase, badge: 'New' },
    { id: 'graph', label: 'Network Graph', icon: Share2, badge: null },
  ];

  const joinedSpaces = spaces.filter(s => s.isMember);

  return (
    <aside
      id="nexora-desktop-sidebar"
      className="hidden lg:flex flex-col w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] p-4 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 overflow-y-auto"
    >
      {/* Primary Navigation */}
      <nav className="space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => {
                setActiveView(item.id);
                setSelectedSpaceId(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Idea Evolution Mini Hero Banner */}
      <div className="my-5 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            Idea Evolution
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Stage Tracker</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Share your idea, gather feedback, launch a community space, and build your project.
        </p>

        <button
          onClick={() => {
            setDefaultComposerType('thought');
            setIsComposerOpen(true);
          }}
          className="mt-3 w-full py-2 px-3 rounded-xl text-xs font-medium text-center text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Post an Idea
        </button>
      </div>

      {/* Your Communities Section */}
      <div className="mt-2 flex-1">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">YOUR COMMUNITIES</span>
          <button
            onClick={() => setActiveView('spaces')}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Explore
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-1">
          {joinedSpaces.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSpaceId(s.id);
                setActiveView('spaces');
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <img src={s.avatar} alt={s.name} className="w-6 h-6 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate text-slate-900 dark:text-slate-100">{s.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{s.membersCount.toLocaleString()} members</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
