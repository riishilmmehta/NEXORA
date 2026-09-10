import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PostType } from '../../types';
import {
  X,
  Sparkles,
  MessageSquare,
  HelpCircle,
  FolderGit2,
  Image,
  BookOpen,
  BarChart2,
  Paperclip,
  Users2,
  Megaphone,
  Plus,
  Trash2,
  ArrowRight,
  Send,
} from 'lucide-react';

interface ComposerTab {
  id: PostType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  accent: string;
}

const COMPOSER_TABS: ComposerTab[] = [
  { id: 'thought', label: 'Thought', icon: MessageSquare, description: 'Quick spark, hypothesis, or idea', accent: 'from-indigo-500 to-cyan-500' },
  { id: 'question', label: 'Question', icon: HelpCircle, description: 'Technical inquiry with Best Answer capability', accent: 'from-amber-500 to-orange-500' },
  { id: 'project', label: 'Project', icon: FolderGit2, description: 'Launch a project with milestones & repo', accent: 'from-blue-500 to-indigo-600' },
  { id: 'showcase', label: 'Showcase', icon: Image, description: 'Visual design, render, or live prototype', accent: 'from-purple-500 to-pink-500' },
  { id: 'article', label: 'Article', icon: BookOpen, description: 'Long-form deep dive or architectural spec', accent: 'from-emerald-500 to-teal-500' },
  { id: 'poll', label: 'Poll', icon: BarChart2, description: 'Consensus query with real-time voting', accent: 'from-cyan-500 to-blue-500' },
  { id: 'resource', label: 'Resource', icon: Paperclip, description: 'Tool, library, dataset, or research paper', accent: 'from-violet-500 to-purple-600' },
  { id: 'collaboration', label: 'Collaboration', icon: Users2, description: 'Recruit teammates, contributors, or mentors', accent: 'from-rose-500 to-red-500' },
  { id: 'announcement', label: 'Announcement', icon: Megaphone, description: 'Milestone update or community release', accent: 'from-yellow-500 to-amber-600' },
];

export const UniversalComposer: React.FC = () => {
  const {
    isComposerOpen,
    setIsComposerOpen,
    defaultComposerType,
    createPost,
    spaces,
    theme,
  } = useApp();

  const [selectedType, setSelectedType] = useState<PostType>(defaultComposerType || 'thought');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaList, setMediaList] = useState<string[]>([]);
  
  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  // Project state
  const [githubUrl, setGithubUrl] = useState('');
  const [technologies, setTechnologies] = useState('');

  if (!isComposerOpen) return null;

  const handleAddMedia = () => {
    if (mediaUrl.trim()) {
      setMediaList([...mediaList, mediaUrl.trim()]);
      setMediaUrl('');
    }
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !title.trim()) return;

    const tags = tagsInput
      ? tagsInput.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean)
      : ['Idea'];

    const targetSpace = spaces.find(s => s.id === selectedSpaceId);

    let pollData;
    if (selectedType === 'poll') {
      const validOptions = pollOptions.filter(o => o.trim().length > 0);
      if (validOptions.length >= 2) {
        pollData = {
          question: pollQuestion || title || 'Community Poll',
          options: validOptions.map((opt, i) => ({ id: `opt-${Date.now()}-${i}`, text: opt, votes: 0 })),
          totalVotes: 0,
        };
      }
    }

    createPost({
      type: selectedType,
      title: title.trim() || undefined,
      content: content.trim(),
      tags,
      media: mediaList.length > 0 ? mediaList : undefined,
      spaceId: targetSpace?.id,
      spaceName: targetSpace?.name,
      poll: pollData,
    });

    // Reset and close
    setTitle('');
    setContent('');
    setTagsInput('');
    setMediaList([]);
    setSelectedSpaceId('');
    setIsComposerOpen(false);
  };

  const activeTabInfo = COMPOSER_TABS.find(t => t.id === selectedType) || COMPOSER_TABS[0];

  return (
    <div
      id="universal-composer-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="universal-composer-modal"
        className="w-full max-w-2xl max-h-[90vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <activeTabInfo.icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Create Post</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeTabInfo.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsComposerOpen(false)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Type Picker Carousel */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {COMPOSER_TABS.map(tab => {
              const Icon = tab.icon;
              const isSelected = selectedType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedType(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Composer Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Target Space Selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Post to Community:
            </span>
            <select
              value={selectedSpaceId}
              onChange={e => setSelectedSpaceId(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="">Public Community (Global Feed)</option>
              {spaces.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title Input */}
          {(['project', 'question', 'showcase', 'article', 'collaboration', 'announcement', 'poll'].includes(selectedType) || title) && (
            <div>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={
                  selectedType === 'question'
                    ? 'What challenge or question are you exploring?'
                    : selectedType === 'project'
                    ? 'Project Name'
                    : selectedType === 'collaboration'
                    ? 'Role or Collaboration Title'
                    : 'Title'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

          {/* Main Content Area */}
          <div>
            <textarea
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={
                selectedType === 'thought'
                  ? 'Share an idea, concept, or quick insight...'
                  : selectedType === 'question'
                  ? 'Describe your question with details and context...'
                  : selectedType === 'project'
                  ? 'Describe the vision, goal, tech stack, and roadmap...'
                  : selectedType === 'showcase'
                  ? 'Share what you built, how you designed it, and key takeaways...'
                  : selectedType === 'collaboration'
                  ? 'What roles are you looking for and what will you build together?'
                  : 'Write your post here...'
              }
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Poll Options */}
          {selectedType === 'poll' && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2.5">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Poll Options</span>
              {pollOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={e => {
                      const newOpts = [...pollOptions];
                      newOpts[idx] = e.target.value;
                      setPollOptions(newOpts);
                    }}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePollOption(idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Option
                </button>
              )}
            </div>
          )}

          {/* Media Links Attachment */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={mediaUrl}
                onChange={e => setMediaUrl(e.target.value)}
                placeholder="Attach image or preview URL (https://...)"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddMedia}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Attach
              </button>
            </div>

            {/* Media previews */}
            {mediaList.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {mediaList.map((url, i) => (
                  <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={url} alt="Attached" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setMediaList(mediaList.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="Add tags separated by comma (e.g. Design, WebDev, AI, OpenSource)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer with Submit */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Visible to community members</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center gap-1.5 active:scale-98 transition-all cursor-pointer"
              >
                <span>Publish</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
