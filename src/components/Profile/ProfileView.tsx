import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Layers,
  FolderGit2,
  Award,
  CheckCircle2,
  Calendar,
  Code2,
  Briefcase,
  MapPin,
  Link,
  ArrowUpRight,
  TrendingUp,
  Flame,
  Check,
  Plus,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    users,
    selectedUserProfileId,
    currentUser,
    projects,
    spaces,
    posts,
    theme,
    setSelectedProjectId,
    setSelectedSpaceId,
    setActiveView,
    setExpandedPostId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'work' | 'matrix' | 'knowledge' | 'ideas'>('work');

  const profileUser = users.find(u => u.id === selectedUserProfileId) || currentUser;
  const isSelf = profileUser.id === currentUser.id;

  const userProjects = projects.filter(p => (p.contributors || []).some(c => c.id === profileUser.id));
  const userSpaces = spaces.filter(s =>
    (profileUser as any).spacesJoined && Array.isArray((profileUser as any).spacesJoined)
      ? (profileUser as any).spacesJoined.includes(s.id)
      : s.isMember
  );
  const userPosts = posts.filter(p => p.author?.id === profileUser.id);
  const userEvolvedPosts = userPosts.filter(p => !!p.evolution);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 lg:pb-10">
      {/* Profile Header & Identity Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        {/* Cover Canvas */}
        <div className="h-44 sm:h-56 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={profileUser.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80'}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Identity Details */}
        <div className="px-6 sm:px-8 pb-6 relative -mt-16 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="relative group">
                <img
                  src={profileUser.avatar}
                  alt={profileUser.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-md"
                />
                <span
                  title="Verified Builder"
                  className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-indigo-600 text-white ring-2 ring-white dark:ring-slate-900"
                >
                  <Award className="w-4 h-4" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{profileUser.name}</h1>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    @{profileUser.username}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium mt-0.5 text-indigo-600 dark:text-indigo-400">
                  {profileUser.tagline}
                </p>
                {profileUser.location && (
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{profileUser.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* IDENTITY SCORE BADGE (Peer contribution metric) */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
                <span className="font-semibold text-base text-indigo-600 dark:text-indigo-400">
                  {profileUser.identityScore}
                </span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 dark:text-slate-100">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Builder Score</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Community contributions</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed max-w-2xl text-slate-600 dark:text-slate-300">
            {profileUser.bio}
          </p>

          {/* Open to Opportunities Pill */}
          {profileUser.openToOpportunities && profileUser.openToOpportunities.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                Open to:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profileUser.openToOpportunities.map(opp => (
                  <span
                    key={opp}
                    className="text-[11px] px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
                  >
                    {opp}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="px-6 sm:px-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar py-2 text-xs font-medium">
          {[
            { id: 'work', label: `Projects (${userProjects.length})` },
            { id: 'matrix', label: 'Contribution Activity' },
            { id: 'knowledge', label: 'Skills & Endorsements' },
            { id: 'ideas', label: `Ideas & Sparks (${userEvolvedPosts.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Work & Projects */}
      {activeTab === 'work' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProjects.map(proj => (
              <div
                key={proj.id}
                onClick={() => {
                  setSelectedProjectId(proj.id);
                  setActiveView('projects');
                }}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all"
              >
                <img src={proj.coverImage} alt={proj.name} className="w-full h-36 object-cover rounded-lg mb-3" />
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100">{proj.name}</h4>
                  <span className="text-[11px] uppercase font-semibold text-indigo-600 dark:text-indigo-400">{proj.status}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 line-clamp-2">{proj.tagline}</p>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">⚡️ {proj.sparksCount} sparks</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">View Project →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Contribution Matrix (GitHub-style Heatmap) */}
      {activeTab === 'matrix' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Contribution Activity</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Activity across code commits, ideas, discussions, and collaborations.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">312 Contributions this Year</span>
          </div>

          {/* Matrix Visual Grid (52 weeks x 7 days simulated preview) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[600px]">
              {Array.from({ length: 364 }).map((_, i) => {
                const activityLevel = (i * 7 + 3) % 5;
                const colors = [
                  'bg-slate-200 dark:bg-slate-700/60',
                  'bg-emerald-200 dark:bg-emerald-900/60',
                  'bg-emerald-400 dark:bg-emerald-700',
                  'bg-emerald-500 dark:bg-emerald-600',
                  'bg-emerald-600 dark:bg-emerald-500',
                ];
                return (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-[3px] ${colors[activityLevel]} hover:scale-125 transition-transform`}
                    title={`Day ${i + 1}: ${activityLevel * 3} contributions`}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-slate-200 dark:bg-slate-700/60" />
                <span className="w-2.5 h-2.5 rounded-[3px] bg-emerald-200 dark:bg-emerald-900/60" />
                <span className="w-2.5 h-2.5 rounded-[3px] bg-emerald-400 dark:bg-emerald-700" />
                <span className="w-2.5 h-2.5 rounded-[3px] bg-emerald-500 dark:bg-emerald-600" />
                <span className="w-2.5 h-2.5 rounded-[3px] bg-emerald-600 dark:bg-emerald-500" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Knowledge Graph & Skills */}
      {activeTab === 'knowledge' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 tracking-tight">Skills & Domains</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(profileUser.skills || []).map((sk: any, idx: number) => {
              const skillName = typeof sk === 'string' ? sk : sk?.name || `Skill ${idx + 1}`;
              const skillLevel = typeof sk === 'object' && sk?.level ? sk.level : 'Advanced';
              const endorsements = typeof sk === 'object' && sk?.endorsements ? sk.endorsements : 12 + (idx * 3);

              return (
                <div
                  key={skillName}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">{skillName}</h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">{skillLevel}</span>
                  </div>
                  <span className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold">★ {endorsements}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Evolved Ideas */}
      {activeTab === 'ideas' && (
        <div className="space-y-3">
          {userEvolvedPosts.map(p => (
            <div
              key={p.id}
              onClick={() => setExpandedPostId(p.id)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{p.title || 'Untitled Spark'}</span>
                <span className="text-[11px] uppercase font-semibold text-indigo-600 dark:text-indigo-400">
                  Stage: {p.evolution?.currentStage}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 line-clamp-2">{p.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
