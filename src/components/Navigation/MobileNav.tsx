import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Compass, Plus, Layers, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    theme,
    setIsComposerOpen,
    currentUser,
    setSelectedUserProfileId,
  } = useApp();

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'create', label: 'Create', icon: Plus, isAction: true },
    { id: 'spaces', label: 'Spaces', icon: Layers },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      id="nexora-mobile-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t pb-safe transition-colors bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 backdrop-blur-md"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                id="mobile-create-fab"
                onClick={() => setIsComposerOpen(true)}
                className="w-12 h-12 -mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
                aria-label="Create Post"
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => {
                if (item.id === 'profile') {
                  setSelectedUserProfileId(currentUser.id);
                }
                setActiveView(item.id);
              }}
              className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
