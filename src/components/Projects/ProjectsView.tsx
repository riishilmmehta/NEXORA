import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus } from '../../types';
import {
  FolderGit2,
  Users2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Github,
  Sparkles,
  Plus,
  ArrowLeft,
  ArrowUpRight,
  TrendingUp,
  Layers,
  HeartHandshake,
  Check,
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    theme,
    currentUser,
    requestCollaboration,
    addProjectMilestone,
    setSelectedUserProfileId,
    setActiveView,
    createProject,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [collabNote, setCollabNote] = useState('');
  const [isNewMilestoneOpen, setIsNewMilestoneOpen] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjTagline, setNewProjTagline] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTech, setNewProjTech] = useState('');

  const currentProject = projects.find(p => p.id === selectedProjectId);

  const filteredProjects = projects.filter(p => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const handleSendCollabRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;
    requestCollaboration(currentProject.id, collabNote);
    setCollabNote('');
    setIsCollabModalOpen(false);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject || !newMilestoneTitle.trim()) return;
    addProjectMilestone(currentProject.id, newMilestoneTitle, newMilestoneDesc, newMilestoneDate || 'Q2 2026');
    setNewMilestoneTitle('');
    setNewMilestoneDesc('');
    setIsNewMilestoneOpen(false);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    const p = createProject({
      name: newProjName.trim(),
      tagline: newProjTagline.trim(),
      description: newProjDesc.trim(),
      technologies: newProjTech.split(',').map(t => t.trim()).filter(Boolean),
    });
    setNewProjName('');
    setNewProjTagline('');
    setNewProjDesc('');
    setNewProjTech('');
    setIsNewProjectModalOpen(false);
    setSelectedProjectId(p.id);
  };

  // If viewing all projects
  if (!currentProject) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-20 lg:pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <FolderGit2 className="w-5 h-5" />
              <span className="text-xs uppercase font-semibold tracking-wider">Projects</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">Living Projects & Open Source</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Where ideas become concrete implementations, open-source repositories, and verified builder portfolios.
            </p>
          </div>

          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs cursor-pointer self-start sm:self-auto transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Start a Project</span>
          </button>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['all', 'building', 'beta', 'active', 'completed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map(proj => {
            const isContributor = proj.contributors.some(c => c.id === currentUser.id);
            return (
              <div
                key={proj.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all duration-150"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={proj.coverImage}
                      alt={proj.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-[11px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                        {proj.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 tracking-tight">{proj.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                      {proj.tagline}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 my-3">
                      {(proj.technologies || []).slice(0, 4).map(tech => (
                        <span
                          key={tech}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Contributors Avatars */}
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex -space-x-2">
                        {(proj.contributors || [])
                          .filter((c, idx, arr) => arr.findIndex(x => x?.id === c?.id) === idx)
                          .map((c, i) => (
                            <img
                              key={`${c.id || 'contributor'}-${i}`}
                              src={c.avatar}
                              alt={c.name}
                              title={c.name}
                              className="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                            />
                          ))}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {(proj.contributors || []).length} {(proj.contributors || []).length === 1 ? 'builder' : 'contributors'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-2">
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">⚡️ {proj.sparksCount} sparks</span>

                  <button
                    onClick={() => setSelectedProjectId(proj.id)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
                  >
                    View Project →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Start Project Modal */}
        {isNewProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="w-full max-w-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl space-y-4">
              <h3 className="font-bold text-base">Start a New Project</h3>
              <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Project Name</label>
                  <input
                    type="text"
                    value={newProjName}
                    onChange={e => setNewProjName(e.target.value)}
                    placeholder="e.g. Tactile DIY Robotics"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">One-line Tagline</label>
                  <input
                    type="text"
                    value={newProjTagline}
                    onChange={e => setNewProjTagline(e.target.value)}
                    placeholder="What does it achieve?"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={newProjDesc}
                    onChange={e => setNewProjDesc(e.target.value)}
                    placeholder="Architecture, roadmap, or goals..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={newProjTech}
                    onChange={e => setNewProjTech(e.target.value)}
                    placeholder="Python, Rust, React, PyTorch..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewProjectModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs"
                  >
                    Launch Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Project Detail Page
  const isAlreadyContributor = currentProject.contributors.some(c => c.id === currentUser.id);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 lg:pb-10">
      <button
        onClick={() => setSelectedProjectId(null)}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Projects</span>
      </button>

      {/* Project Cover & Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="h-56 sm:h-72 w-full overflow-hidden relative">
          <img
            src={currentProject.coverImage}
            alt={currentProject.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="p-6 sm:p-8 relative -mt-16 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-semibold tracking-wider px-3 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                  Status: {currentProject.status}
                </span>
                {currentProject.spaceName && (
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    in Space: {currentProject.spaceName}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">{currentProject.name}</h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
                {currentProject.tagline}
              </p>
            </div>

            {/* Collaborate CTA Button */}
            <div className="flex items-center gap-2">
              {currentProject.liveUrl && (
                <a
                  href={currentProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live App</span>
                </a>
              )}

              {currentProject.githubUrl && (
                <a
                  href={currentProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Code</span>
                </a>
              )}

              <button
                onClick={() => setIsCollabModalOpen(true)}
                className={`px-4 py-2 rounded-xl text-xs font-medium text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                  isAlreadyContributor
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>{isAlreadyContributor ? 'Contributor ✓' : 'Collaborate'}</span>
              </button>
            </div>
          </div>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {(currentProject.technologies || []).map(t => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-lg font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Description + Milestones + Updates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Updates */}
        <div className="md:col-span-2 space-y-6">
          {/* Detailed Documentation */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 tracking-tight">Project Overview & Architecture</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {currentProject.description}
            </p>
          </div>

          {/* Project Updates Log */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Project Updates & Changelog</span>
            </h3>

            {(!currentProject.updates || currentProject.updates.length === 0) ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">No log updates yet.</p>
            ) : (
              <div className="space-y-4">
                {(currentProject.updates || []).map(up => (
                  <div
                    key={up.id}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{up.title}</h4>
                      <span className="text-[11px] text-slate-400">{up.date}</span>
                    </div>
                    <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                      {up.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Milestones & Contributors */}
        <div className="space-y-6">
          {/* Milestones Checklist */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Roadmap Milestones</span>
              </h3>
              <button
                onClick={() => setIsNewMilestoneOpen(true)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-medium"
              >
                + Add
              </button>
            </div>

            <div className="space-y-2.5">
              {(currentProject.milestones || []).map(m => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    m.status === 'completed'
                      ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/30'
                      : m.status === 'in_progress'
                      ? 'border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 dark:bg-indigo-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">{m.title}</span>
                    <span className="text-[11px] text-slate-400">{m.targetDate}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">{m.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contributors & Collaborators */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Users2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Project Team</span>
            </h3>

            <div className="space-y-2">
              {(currentProject.contributors || [])
                .filter((c, idx, arr) => arr.findIndex(x => x?.id === c?.id) === idx)
                .map((c, i) => (
                  <button
                    key={`${c.id || 'contributor'}-${i}`}
                    onClick={() => {
                      setSelectedUserProfileId(c.id);
                      setActiveView('profile');
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs text-slate-900 dark:text-slate-100 truncate">{c.name}</p>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Score: {c.identityScore}</span>
                    </div>
                  </button>
                ))}
            </div>

            {/* Collaborators Needed */}
            {currentProject.collaboratorsNeeded && currentProject.collaboratorsNeeded.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                  Seeking Collaborators
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentProject.collaboratorsNeeded.map(role => (
                    <span
                      key={role}
                      className="text-[11px] px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collaborate Request Dialog */}
      {isCollabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <HeartHandshake className="w-5 h-5" />
              <h3 className="font-bold text-base">Request to Collaborate on {currentProject.name}</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Introduce your skillset, what component you want to build, or submit your proposal.
            </p>

            <form onSubmit={handleSendCollabRequest} className="space-y-3">
              <textarea
                rows={3}
                value={collabNote}
                onChange={e => setCollabNote(e.target.value)}
                placeholder="Hi! I'd love to help build and test this project..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCollabModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs cursor-pointer"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Milestone Dialog */}
      {isNewMilestoneOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl space-y-4">
            <h3 className="font-bold text-base">Add Project Milestone</h3>
            <form onSubmit={handleAddMilestone} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Milestone Title</label>
                <input
                  type="text"
                  value={newMilestoneTitle}
                  onChange={e => setNewMilestoneTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Verification"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Target Date</label>
                <input
                  type="text"
                  value={newMilestoneDate}
                  onChange={e => setNewMilestoneDate(e.target.value)}
                  placeholder="e.g. Q3 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newMilestoneDesc}
                  onChange={e => setNewMilestoneDesc(e.target.value)}
                  placeholder="Deliverable details..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewMilestoneOpen(false)}
                  className="px-3 py-1.5 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
