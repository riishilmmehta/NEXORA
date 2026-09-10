import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Space, SpaceChannel } from '../../types';
import {
  Layers,
  Users,
  Plus,
  Hash,
  MessageSquare,
  Sparkles,
  Calendar,
  FileText,
  ShieldCheck,
  Send,
  Lock,
  Globe,
  ArrowLeft,
  Share2,
  FolderGit2,
  ArrowUpRight,
} from 'lucide-react';

export const SpacesView: React.FC = () => {
  const {
    spaces,
    selectedSpaceId,
    setSelectedSpaceId,
    toggleJoinSpace,
    createSpace,
    theme,
    projects,
    setSelectedProjectId,
    setActiveView,
    channelMessages,
    sendChannelMessage,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'channels' | 'projects' | 'resources' | 'events' | 'members'>('overview');
  const [selectedChannelId, setSelectedChannelId] = useState<string>('ch-general');
  const [channelInput, setChannelInput] = useState('');
  const [isNewSpaceModalOpen, setIsNewSpaceModalOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceTagline, setNewSpaceTagline] = useState('');
  const [newSpaceCategory, setNewSpaceCategory] = useState('Artificial Intelligence');

  const currentSpace = spaces.find(s => s.id === selectedSpaceId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelInput.trim()) return;
    sendChannelMessage(selectedChannelId, channelInput.trim());
    setChannelInput('');
  };

  const handleCreateNewSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;
    const created = createSpace({
      name: newSpaceName.trim(),
      tagline: newSpaceTagline.trim() || 'A vibrant creative space.',
      category: newSpaceCategory,
    });
    setNewSpaceName('');
    setNewSpaceTagline('');
    setIsNewSpaceModalOpen(false);
    setSelectedSpaceId(created.id);
  };

  // If no space is selected, display the Spaces Directory
  if (!currentSpace) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-20 lg:pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
              <span className="text-xs uppercase font-semibold tracking-wider">Communities</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">Community Spaces</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Join spaces to collaborate on shared interests, discuss ideas, and follow projects.
            </p>
          </div>

          <button
            onClick={() => setIsNewSpaceModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs cursor-pointer self-start sm:self-auto transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Space</span>
          </button>
        </div>

        {/* Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {spaces.map(s => {
            const isMember = s.isMember;
            return (
              <div
                key={s.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 tracking-tight">{s.name}</h3>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{s.category}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] uppercase font-semibold px-2.5 py-0.5 rounded-full ${
                        s.visibility === 'public'
                          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60'
                          : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60'
                      }`}
                    >
                      {s.visibility}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
                    {s.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(s.tags || []).slice(0, 4).map(t => (
                      <span
                        key={t}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{s.membersCount.toLocaleString()} members</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleJoinSpace(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isMember
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {isMember ? 'Joined' : 'Join'}
                    </button>

                    <button
                      onClick={() => setSelectedSpaceId(s.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
                    >
                      Enter →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Space Dialog */}
        {isNewSpaceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="w-full max-w-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl space-y-4">
              <h3 className="font-bold text-base">Create a Community Space</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Spaces are persistent places for project updates, discussions, and member channels.
              </p>

              <form onSubmit={handleCreateNewSpace} className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Space Name</label>
                  <input
                    type="text"
                    value={newSpaceName}
                    onChange={e => setNewSpaceName(e.target.value)}
                    placeholder="e.g. AI & Robotics Collective"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={newSpaceTagline}
                    onChange={e => setNewSpaceTagline(e.target.value)}
                    placeholder="What is the goal of this community?"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={newSpaceCategory}
                    onChange={e => setNewSpaceCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option>Artificial Intelligence</option>
                    <option>Robotics & Hardware</option>
                    <option>Design & Interfaces</option>
                    <option>Ecology & Science</option>
                    <option>Open Source Infrastructure</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewSpaceModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs"
                  >
                    Create Space
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Space Detail View
  const spaceProjects = projects.filter(p => p.spaceId === currentSpace.id);
  const activeChannelMessages = channelMessages[selectedChannelId] || [];

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-20 lg:pb-10">
      {/* Back button */}
      <button
        onClick={() => setSelectedSpaceId(null)}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Communities</span>
      </button>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="h-40 sm:h-52 w-full overflow-hidden relative">
          <img
            src={currentSpace.coverImage}
            alt={currentSpace.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Space Identity Profile Strip */}
        <div className="px-5 sm:px-6 pb-5 pt-0 relative -mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <img
              src={currentSpace.avatar}
              alt={currentSpace.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{currentSpace.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium">
                  {currentSpace.category}
                </span>
                {currentSpace.userRole && (
                  <span className="text-[11px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Role: {currentSpace.userRole}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                {currentSpace.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleJoinSpace(currentSpace.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                currentSpace.isMember
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              {currentSpace.isMember ? 'Joined' : 'Join Space'}
            </button>
          </div>
        </div>

        {/* Space Navigation Tabs */}
        <div className="px-5 sm:px-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar py-2 text-xs font-medium">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'channels', label: 'Channels & Chat' },
            { id: 'projects', label: `Projects (${spaceProjects.length})` },
            { id: 'resources', label: `Resources (${currentSpace.resources.length})` },
            { id: 'events', label: `Events (${currentSpace.events.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
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

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-4">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 tracking-tight mb-2">About this Community</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentSpace.description}
              </p>
            </div>

            {/* Featured Projects in Space */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Projects in {currentSpace.name}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {spaceProjects.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setActiveView('projects');
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
                  >
                    <img src={p.coverImage} alt={p.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{p.name}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 mt-0.5">{p.tagline}</p>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-2 block font-medium">View Project →</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Rail: Upcoming Events & Channels */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 tracking-tight mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Upcoming Events</span>
              </h3>

              {(!currentSpace.events || currentSpace.events.length === 0) ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">No scheduled events this week.</p>
              ) : (
                <div className="space-y-3">
                  {(currentSpace.events || []).map(ev => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
                    >
                      <span className="text-[10px] uppercase font-semibold text-indigo-600 dark:text-indigo-400">
                        {ev.type.replace('_', ' ')}
                      </span>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mt-0.5">{ev.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                        {ev.date} at {ev.time}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{ev.attendeesCount} RSVPed</span>
                        <button className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer">
                          Attend
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Channels & Live Chat */}
      {activeTab === 'channels' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col md:flex-row h-[550px] shadow-xs">
          {/* Channels Sidebar */}
          <div className="w-full md:w-56 p-3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-1">
            <span className="text-[11px] uppercase font-semibold text-slate-400 px-2 mb-2 block">
              Channels
            </span>
            {(currentSpace.channels || []).map(ch => (
              <button
                key={ch.id}
                onClick={() => setSelectedChannelId(ch.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  selectedChannelId === ch.id
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Hash className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{ch.name}</span>
                </div>
                {ch.unreadCount && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Chat Pane */}
          <div className="flex-1 flex flex-col justify-between p-4">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {activeChannelMessages.length === 0 ? (
                <div className="text-center py-20 text-xs text-slate-400">
                  <Hash className="w-8 h-8 mx-auto mb-2 opacity-30 text-indigo-500" />
                  <p>Start the conversation in #{selectedChannelId}!</p>
                </div>
              ) : (
                activeChannelMessages.map(msg => (
                  <div key={msg.id} className="flex items-start gap-2.5 text-xs">
                    <img
                      src={msg.author.avatar}
                      alt={msg.author.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">{msg.author.name}</span>
                        <span className="text-[10px] text-slate-400">{msg.createdAt}</span>
                      </div>
                      <p className="mt-0.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                        {msg.content}
                      </p>
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex gap-1.5 mt-1.5">
                          {msg.reactions.map((rx, rxi) => (
                            <span
                              key={rxi}
                              className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                            >
                              {rx.emoji} {rx.count}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Composer */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={channelInput}
                onChange={e => setChannelInput(e.target.value)}
                placeholder={`Message #${selectedChannelId}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {spaceProjects.map(proj => (
              <div
                key={proj.id}
                onClick={() => {
                  setSelectedProjectId(proj.id);
                  setActiveView('projects');
                }}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all"
              >
                <img src={proj.coverImage} alt={proj.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{proj.name}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mt-1">{proj.tagline}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400">
                  <span>{proj.contributors.length} Contributors</span>
                  <span className="font-medium">Open Project →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Resources */}
      {activeTab === 'resources' && (
        <div className="space-y-3">
          {(currentSpace.resources || []).map((res, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">{res.title}</h4>
                  <span className="text-[11px] text-slate-400">{res.category}</span>
                </div>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
              >
                Access Spec
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
