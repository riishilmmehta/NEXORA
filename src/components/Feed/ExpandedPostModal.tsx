import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ArrowBigUp,
  Sparkles,
  MessageSquare,
  Bookmark,
  Share2,
  CheckCircle2,
  FolderGit2,
  Layers,
  Send,
  ArrowRight,
  ShieldCheck,
  Check,
  Plus,
  Users2,
} from 'lucide-react';
import { EvolutionStage } from '../../types';

export const ExpandedPostModal: React.FC = () => {
  const {
    expandedPostId,
    setExpandedPostId,
    posts,
    theme,
    currentUser,
    toggleUpvote,
    toggleSpark,
    toggleBookmark,
    addComment,
    markBestAnswer,
    evolveIdea,
    setSelectedUserProfileId,
    setActiveView,
    setSelectedSpaceId,
    setSelectedProjectId,
  } = useApp();

  const [commentInput, setCommentInput] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [isEvolvingModalOpen, setIsEvolvingModalOpen] = useState(false);
  const [customEntityName, setCustomEntityName] = useState('');
  const [targetEvolutionStage, setTargetEvolutionStage] = useState<EvolutionStage>('space');

  if (!expandedPostId) return null;

  const post = posts.find(p => p.id === expandedPostId);
  if (!post) return null;

  const author = post.author;
  const evolution = post.evolution;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const handlePostReply = (parentId: string) => {
    if (!replyInput.trim()) return;
    addComment(post.id, replyInput.trim(), parentId);
    setReplyInput('');
    setReplyToId(null);
  };

  const handleTriggerEvolution = (stage: EvolutionStage) => {
    setTargetEvolutionStage(stage);
    setCustomEntityName(
      stage === 'space'
        ? `${post.title || 'Collective'} Space`
        : `${post.title || 'Initiative'} Project`
    );
    setIsEvolvingModalOpen(true);
  };

  const handleConfirmEvolution = () => {
    evolveIdea(
      post.id,
      targetEvolutionStage,
      targetEvolutionStage === 'space' ? customEntityName : undefined,
      targetEvolutionStage === 'project' ? customEntityName : undefined
    );
    setIsEvolvingModalOpen(false);
  };

  return (
    <div
      id="expanded-post-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        id="expanded-post-container"
        className="w-full max-w-3xl max-h-[92vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col shadow-xl overflow-hidden my-auto"
      >
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedUserProfileId(author.id);
                setActiveView('profile');
                setExpandedPostId(null);
              }}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <img
                src={author.avatar}
                alt={author.name}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div>
                <span className="font-semibold text-sm hover:underline">{author.name}</span>
                <span className="text-xs ml-2 text-slate-500 dark:text-slate-400">
                  @{author.username}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{author.tagline}</p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {post.spaceName && (
              <button
                onClick={() => {
                  if (post.spaceId) {
                    setSelectedSpaceId(post.spaceId);
                    setActiveView('spaces');
                    setExpandedPostId(null);
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>{post.spaceName}</span>
              </button>
            )}

            <button
              onClick={() => setExpandedPostId(null)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Post Title & Text */}
          {post.title && (
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {post.title}
            </h2>
          )}

          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200">
            {post.content}
          </div>

          {/* Full Media view */}
          {post.media && post.media.length > 0 && (
            <div className="space-y-3 pt-2">
              {post.media.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[500px]">
                  <img src={img} alt="Media attachment" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {(post.tags || []).map(t => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* IDEA EVOLUTION CONTROLLER PANEL */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-700/80">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Idea Evolution Tracker</h4>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium capitalize">
                    {evolution?.currentStage || 'Idea'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Track discussions that evolve from early ideas into active projects and showcase portfolios.
                </p>
              </div>

              {/* Evolution Actions */}
              <div className="flex items-center gap-2">
                {(!evolution || evolution.currentStage === 'idea' || evolution.currentStage === 'discussion') && (
                  <button
                    onClick={() => handleTriggerEvolution('space')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Create Community</span>
                  </button>
                )}

                {evolution?.currentStage !== 'project' && evolution?.currentStage !== 'showcase' && (
                  <button
                    onClick={() => handleTriggerEvolution('project')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Start Project</span>
                  </button>
                )}
              </div>
            </div>

            {/* Stages Pipeline Visualization */}
            <div className="grid grid-cols-5 gap-2 mt-4 text-center text-xs">
              {[
                { stage: 'idea', label: '1. Idea' },
                { stage: 'discussion', label: '2. Discussion' },
                { stage: 'space', label: '3. Community' },
                { stage: 'project', label: '4. Project' },
                { stage: 'showcase', label: '5. Showcase' },
              ].map((step, idx) => {
                const stages = ['idea', 'discussion', 'space', 'project', 'showcase'];
                const currentIdx = stages.indexOf(evolution?.currentStage || 'idea');
                const isCurrent = idx === currentIdx;
                const isDone = idx < currentIdx;

                return (
                  <div
                    key={step.stage}
                    className={`p-2 rounded-lg border text-[11px] font-medium transition-all ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : isDone
                        ? 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                    }`}
                  >
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Metrics Row */}
          <div className="flex items-center justify-between py-2.5 border-y border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleUpvote(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  post.hasUpvoted
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <ArrowBigUp className={`w-4 h-4 ${post.hasUpvoted ? 'fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400' : ''}`} />
                <span>{post.upvotes} Upvotes</span>
              </button>

              <button
                onClick={() => toggleSpark(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  post.hasSparked
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${post.hasSparked ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{post.sparks} Sparks</span>
              </button>
            </div>

            <button
              onClick={() => toggleBookmark(post.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                post.hasBookmarked
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${post.hasBookmarked ? 'fill-indigo-600' : ''}`} />
              <span>{post.hasBookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          {/* Discussion / Comments Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <span>Discussion ({post.commentsCount})</span>
              </h3>
            </div>

            {/* Comment Composer */}
            <form onSubmit={handlePostComment} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                placeholder="Add to the discussion..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <span>Post</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              {(!post.comments || post.comments.length === 0) ? (
                <p className="text-center py-6 text-xs text-slate-400 dark:text-slate-500">
                  No comments yet. Be the first to share your thoughts.
                </p>
              ) : (
                post.comments.map(c => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                      c.isBestAnswer
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
                    }`}
                  >
                    {/* Author line */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.author.avatar}
                          alt={c.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">{c.author.name}</span>
                        <span className="text-[11px] text-slate-400">• {c.createdAt}</span>
                      </div>

                      {c.isBestAnswer ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Best Answer
                        </span>
                      ) : (
                        post.type === 'question' && (
                          <button
                            onClick={() => markBestAnswer(post.id, c.id)}
                            className="text-[11px] text-slate-400 hover:text-emerald-600 flex items-center gap-0.5 cursor-pointer"
                          >
                            Mark best answer
                          </button>
                        )
                      )}
                    </div>

                    <p className="leading-relaxed text-slate-800 dark:text-slate-200">
                      {c.content}
                    </p>

                    {/* Nested Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-2 mt-2 pt-1">
                        {c.replies.map(r => (
                          <div key={r.id} className="text-xs space-y-1">
                            <div className="flex items-center gap-1.5">
                              <img src={r.author.avatar} alt={r.author.name} className="w-5 h-5 rounded-full object-cover" />
                              <span className="font-medium text-slate-900 dark:text-slate-100">{r.author.name}</span>
                              <span className="text-[10px] text-slate-400">• {r.createdAt}</span>
                            </div>
                            <p className="pl-6 text-slate-600 dark:text-slate-400">{r.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Trigger */}
                    {replyToId === c.id ? (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={replyInput}
                          onChange={e => setReplyInput(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                        />
                        <button
                          onClick={() => handlePostReply(c.id)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium cursor-pointer"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => setReplyToId(null)}
                          className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyToId(c.id)}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline pt-1 block cursor-pointer"
                      >
                        Reply to {c.author.name.split(' ')[0]}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EVOLVE IDEA MODAL DIALOG */}
      {isEvolvingModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4 text-slate-900 dark:text-slate-100"
          >
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-semibold text-base">Evolve Idea to {targetEvolutionStage.toUpperCase()}</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This will officially advance this discussion into an active, permanent {targetEvolutionStage}.
            </p>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                {targetEvolutionStage === 'space' ? 'Community Name' : 'Project Name'}
              </label>
              <input
                type="text"
                value={customEntityName}
                onChange={e => setCustomEntityName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEvolvingModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEvolution}
                className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
