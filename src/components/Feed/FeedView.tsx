import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PostCard } from './PostCard';
import { MomentsBar } from './MomentsBar';
import { PostType } from '../../types';
import {
  Sparkles,
  MessageSquare,
  FolderGit2,
  HelpCircle,
  Image,
  TrendingUp,
  Users2,
  Layers,
  ArrowUpRight,
  Flame,
  Plus,
} from 'lucide-react';

export const FeedView: React.FC = () => {
  const {
    posts,
    currentUser,
    spaces,
    projects,
    theme,
    setIsComposerOpen,
    setDefaultComposerType,
    setExpandedPostId,
    setSelectedProjectId,
    setSelectedSpaceId,
    setActiveView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'for_you' | 'following' | 'spaces'>('for_you');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredPosts = posts.filter(p => {
    // Tab filter
    if (activeTab === 'spaces' && !p.spaceId) return false;
    // Type filter
    if (filterType === 'all') return true;
    if (filterType === 'ideas') return p.type === 'thought' || !!p.evolution;
    return p.type === filterType;
  });

  return (
    <div className="w-full max-w-7xl mx-auto flex gap-6">
      {/* Main Feed Column */}
      <div className="flex-1 max-w-2xl mx-auto w-full space-y-5 pb-20 lg:pb-10">
        {/* Welcome & Quick Composer Trigger */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <button
              onClick={() => {
                setDefaultComposerType('thought');
                setIsComposerOpen(true);
              }}
              className="flex-1 text-left px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-sm hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer"
            >
              Share an idea, update, or ask a question...
            </button>
          </div>

          {/* Quick Archetype Action Pills */}
          <div className="flex items-center justify-between gap-1 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
            {[
              { type: 'thought' as PostType, label: 'Post Idea', icon: Sparkles, color: 'text-indigo-600 dark:text-indigo-400' },
              { type: 'project' as PostType, label: 'Project', icon: FolderGit2, color: 'text-blue-600 dark:text-blue-400' },
              { type: 'question' as PostType, label: 'Question', icon: HelpCircle, color: 'text-amber-600 dark:text-amber-400' },
              { type: 'showcase' as PostType, label: 'Showcase', icon: Image, color: 'text-purple-600 dark:text-purple-400' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => {
                    setDefaultComposerType(item.type);
                    setIsComposerOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Moments Bar (Temporary 24h progress updates) */}
        <div className="p-3 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Daily Updates
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">24h moments</span>
          </div>
          <MomentsBar />
        </div>

        {/* Feed Tabs: For You | Following | Spaces */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
          <div className="flex items-center gap-4 text-sm font-semibold">
            {[
              { id: 'for_you', label: 'For You' },
              { id: 'following', label: 'Following' },
              { id: 'spaces', label: 'Communities' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2 relative cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Quick Filter Chips */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            {['all', 'ideas', 'project', 'question', 'showcase'].map(filter => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-2.5 py-1 rounded-full capitalize transition-colors cursor-pointer text-xs ${
                  filterType === filter
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="p-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-500 mx-auto" />
              <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100">No posts in this stream yet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Share an idea, start a discussion, or post a project update to get started.
              </p>
              <button
                onClick={() => setIsComposerOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Create First Post
              </button>
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onExpand={postId => setExpandedPostId(postId)}
              />
            ))
          )}
        </div>
      </div>

      {/* Desktop Right Discovery Rail */}
      <div className="hidden xl:block w-80 shrink-0 space-y-5 sticky top-20 h-fit">
        {/* Trending Ideas */}
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Trending Ideas
            </span>
          </div>

          <div className="space-y-2.5">
            {posts
              .filter(p => p.evolution)
              .slice(0, 3)
              .map(p => (
                <div
                  key={p.id}
                  onClick={() => setExpandedPostId(p.id)}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs cursor-pointer transition-all"
                >
                  <p className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">{p.title || p.content}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    <span className="capitalize">Stage: {p.evolution?.currentStage}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">✨ {p.sparks} sparks</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
              Active Projects
            </span>
            <button
              onClick={() => setActiveView('projects')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
            >
              All
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {(projects || []).slice(0, 2).map(proj => (
              <div
                key={proj.id}
                onClick={() => {
                  setSelectedProjectId(proj.id);
                  setActiveView('projects');
                }}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2">
                  <img src={proj.coverImage} alt={proj.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{proj.name}</p>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{(proj.technologies || []).slice(0, 2).join(' • ')}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400">
                  <span>{(proj.contributors || []).length} Contributors</span>
                  <span className="font-medium">View Project →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Communities Showcase */}
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              Suggested Communities
            </span>
            <button
              onClick={() => setActiveView('spaces')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
            >
              Explore
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {(spaces || []).slice(0, 3).map(s => (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedSpaceId(s.id);
                  setActiveView('spaces');
                }}
                className="p-2 rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">{s.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{s.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
