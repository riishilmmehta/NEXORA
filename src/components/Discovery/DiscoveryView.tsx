import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Sparkles,
  Users2,
  FolderGit2,
  Layers,
  Image,
  Briefcase,
  Search,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { PostCard } from '../Feed/PostCard';

export const DiscoveryView: React.FC = () => {
  const {
    posts,
    spaces,
    projects,
    users,
    opportunities,
    theme,
    setExpandedPostId,
    setSelectedProjectId,
    setSelectedSpaceId,
    setSelectedUserProfileId,
    setActiveView,
  } = useApp();

  const [activeLayer, setActiveLayer] = useState<'everything' | 'ideas' | 'people' | 'projects' | 'spaces' | 'visuals' | 'opportunities'>('everything');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const popularTags = ['AI', 'SpatialUX', 'Robotics', 'Neuroscience', 'DistributedSystems', 'DesignSystems', 'OpenSource'];

  const filteredPosts = posts.filter(p => {
    const matchesSearch = !searchQuery || p.content.toLowerCase().includes(searchQuery.toLowerCase()) || (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'all' || p.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const filteredProjects = projects.filter(p => {
    return !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredSpaces = spaces.filter(s => {
    return !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.tagline.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredUsers = users
    .filter((u, index, self) => self.findIndex(o => o.id === u.id) === index)
    .filter(u => {
      return !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 lg:pb-10">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Compass className="w-5 h-5" />
            <span className="text-xs uppercase font-semibold tracking-wider">Discovery</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">Explore Communities & Projects</h2>
        </div>

        {/* Search Input with Tag Chips */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search posts, topics, people, or communities..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                selectedTag === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All Topics
            </button>
            {popularTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layer Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-medium">
        {[
          { id: 'everything', label: 'Everything', icon: Compass },
          { id: 'ideas', label: 'Discussions', icon: Sparkles },
          { id: 'people', label: 'People', icon: Users2 },
          { id: 'projects', label: 'Projects', icon: FolderGit2 },
          { id: 'spaces', label: 'Communities', icon: Layers },
          { id: 'visuals', label: 'Media', icon: Image },
          { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
        ].map(layer => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{layer.label}</span>
            </button>
          );
        })}
      </div>

      {/* Layer Content View */}
      {/* 1. Everything Layer */}
      {activeLayer === 'everything' && (
        <div className="space-y-8">
          {/* Section: Featured Projects */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-indigo-500" />
                <span>Featured Projects</span>
              </h3>
              <button
                onClick={() => setActiveLayer('projects')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
              >
                View all
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.slice(0, 3).map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProjectId(p.id);
                    setActiveView('projects');
                  }}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all"
                >
                  <img src={p.coverImage} alt={p.name} className="w-full h-28 object-cover rounded-lg mb-2" />
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{p.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{p.tagline}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Evolving Ideas Stream */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Recent Discussions</span>
              </h3>
              <button
                onClick={() => setActiveLayer('ideas')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
              >
                View all
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-4">
              {filteredPosts.slice(0, 4).map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onExpand={id => setExpandedPostId(id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Ideas Layer */}
      {activeLayer === 'ideas' && (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onExpand={id => setExpandedPostId(id)}
            />
          ))}
        </div>
      )}

      {/* 3. People Layer */}
      {activeLayer === 'people' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((u, userIdx) => (
            <div
              key={`${u.id}-${userIdx}`}
              onClick={() => {
                setSelectedUserProfileId(u.id);
                setActiveView('profile');
              }}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{u.name}</h4>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Score: {u.identityScore}</span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{u.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {(u.skills || []).slice(0, 3).map((sk: any, ski: number) => {
                  const skillName = typeof sk === 'string' ? sk : sk?.name || `Skill ${ski + 1}`;
                  return (
                    <span key={skillName || ski} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      {skillName}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Projects Layer */}
      {activeLayer === 'projects' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredProjects.map(proj => (
            <div
              key={proj.id}
              onClick={() => {
                setSelectedProjectId(proj.id);
                setActiveView('projects');
              }}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden p-4 text-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all"
            >
              <img src={proj.coverImage} alt={proj.name} className="w-full h-40 object-cover rounded-lg mb-3" />
              <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100">{proj.name}</h4>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{proj.tagline}</p>
              <div className="mt-3 flex items-center justify-between text-indigo-600 dark:text-indigo-400">
                <span>{(proj.contributors || []).length} Contributors</span>
                <span className="font-medium">View Project →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Spaces Layer */}
      {activeLayer === 'spaces' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredSpaces.map(s => (
            <div
              key={s.id}
              onClick={() => {
                setSelectedSpaceId(s.id);
                setActiveView('spaces');
              }}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{s.name}</h4>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400">{s.category}</span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 line-clamp-2">{s.tagline}</p>
            </div>
          ))}
        </div>
      )}

      {/* 6. Visual Works Layer */}
      {activeLayer === 'visuals' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts
            .filter(p => p.type === 'showcase' || (p.media && p.media.length > 0))
            .map(p => (
              <div
                key={p.id}
                onClick={() => setExpandedPostId(p.id)}
                className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-64 cursor-pointer"
              >
                <img
                  src={p.media?.[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                  alt={p.title || 'Visual'}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <h4 className="font-semibold text-sm line-clamp-1">{p.title || p.content}</h4>
                  <span className="text-[11px] text-slate-300">by {p.author.name}</span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 7. Opportunities Layer */}
      {activeLayer === 'opportunities' && (
        <div className="space-y-4">
          {(opportunities || []).map(opp => (
            <div
              key={opp.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    {opp.type.replace('_', ' ')}
                  </span>
                  {opp.compensation && (
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{opp.compensation}</span>
                  )}
                </div>
                <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100 mt-1.5">{opp.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{opp.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                  <span>By {opp.creator.name}</span>
                  <span>• {opp.location}</span>
                </div>
              </div>

              <button className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer self-start sm:self-auto transition-colors shadow-xs">
                Apply →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
