import React from 'react';
import { useApp } from '../../context/AppContext';
import { Post } from '../../types';
import {
  ArrowBigUp,
  Sparkles,
  MessageSquare,
  Bookmark,
  Share2,
  FolderGit2,
  CheckCircle2,
  Users2,
  Layers,
  ArrowUpRight,
  BarChart2,
  Check,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onExpand: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onExpand }) => {
  const {
    toggleUpvote,
    toggleSpark,
    toggleBookmark,
    votePoll,
    setSelectedUserProfileId,
    setActiveView,
    setSelectedSpaceId,
    setSelectedProjectId,
  } = useApp();

  const author = post.author;
  const evolution = post.evolution;

  // Normal, friendly badge labels & styling
  const getTypeBadge = () => {
    switch (post.type) {
      case 'thought':
        return { label: 'Idea', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60' };
      case 'question':
        return { label: 'Question', color: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60' };
      case 'project':
        return { label: 'Project', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/60' };
      case 'showcase':
        return { label: 'Showcase', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/60' };
      case 'article':
        return { label: 'Article', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' };
      case 'poll':
        return { label: 'Poll', color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800/60' };
      case 'collaboration':
        return { label: 'Collab Call', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/60' };
      case 'announcement':
        return { label: 'Announcement', color: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/60' };
      default:
        return { label: 'Post', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  const typeBadge = getTypeBadge();

  return (
    <article
      id={`post-card-${post.id}`}
      className="p-4 sm:p-5 rounded-2xl border transition-all duration-150 bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
    >
      {/* Header: Author Identity & Context */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedUserProfileId(author.id);
              setActiveView('profile');
            }}
            className="cursor-pointer focus:outline-none shrink-0"
          >
            <img
              src={author.avatar}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
          </button>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => {
                  setSelectedUserProfileId(author.id);
                  setActiveView('profile');
                }}
                className="font-semibold text-sm hover:underline cursor-pointer text-slate-900 dark:text-slate-100 text-left"
              >
                {author.name}
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                @{author.username}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">• {post.createdAt}</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {author.tagline}
            </p>
          </div>
        </div>

        {/* Space or Archetype Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {post.spaceName && (
            <button
              onClick={() => {
                if (post.spaceId) {
                  setSelectedSpaceId(post.spaceId);
                  setActiveView('spaces');
                }
              }}
              className="hidden sm:flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Layers className="w-3 h-3 text-indigo-500" />
              <span>{post.spaceName}</span>
            </button>
          )}

          <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${typeBadge.color}`}>
            {typeBadge.label}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div
        onClick={() => onExpand(post.id)}
        className="mt-3.5 space-y-2 cursor-pointer group"
      >
        {post.title && (
          <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
            {post.title}
          </h3>
        )}

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line line-clamp-4">
          {post.content}
        </p>

        {/* Media preview (if attached) */}
        {post.media && post.media.length > 0 && (
          <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-80 bg-slate-100 dark:bg-slate-800">
            <img
              src={post.media[0]}
              alt={post.title || 'Post visual'}
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
            />
          </div>
        )}

        {/* Poll Renderer */}
        {post.poll && (
          <div
            onClick={e => e.stopPropagation()}
            className="mt-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
                {post.poll.question}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{post.poll.totalVotes} votes</span>
            </div>

            <div className="space-y-2">
              {(post.poll.options || []).map(opt => {
                const pct = (post.poll?.totalVotes || 0) > 0 ? Math.round((opt.votes / post.poll!.totalVotes) * 100) : 0;
                const isSelected = post.poll?.userVotedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => votePoll(post.id, opt.id)}
                    className={`w-full relative overflow-hidden rounded-lg border p-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-indigo-100 dark:bg-indigo-950/70 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative flex items-center justify-between text-xs text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1.5 font-medium">
                        {isSelected && <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                        <span>{opt.text}</span>
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{pct}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {(post.tags || []).map(tag => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Idea Evolution Stepper */}
      {evolution && (
        <div
          onClick={() => onExpand(post.id)}
          className="mt-3.5 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/30 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1.5 font-medium text-indigo-700 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              Idea Evolution
            </span>
            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 capitalize">
              Stage: {evolution.currentStage}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            {['idea', 'discussion', 'community', 'project', 'showcase'].map((stg, i) => {
              const stages = ['idea', 'discussion', 'community', 'project', 'showcase'];
              const currentIdx = stages.indexOf(evolution.currentStage);
              const isPast = i <= currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div key={stg} className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isCurrent
                        ? 'bg-indigo-600 ring-2 ring-indigo-400/50'
                        : isPast
                        ? 'bg-indigo-500'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                  <span className={`capitalize hidden sm:inline ${isCurrent ? 'text-indigo-700 dark:text-indigo-300 font-semibold' : ''}`}>
                    {stg}
                  </span>
                  {i < 4 && <span className="text-slate-300 dark:text-slate-600 ml-1">→</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Linked Project CTA */}
      {post.projectName && (
        <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs">
            <FolderGit2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-slate-800 dark:text-slate-200">Project: {post.projectName}</span>
          </div>
          <button
            onClick={() => {
              if (post.projectId) {
                setSelectedProjectId(post.projectId);
                setActiveView('projects');
              }
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
          >
            View Project
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Footer Metrics & Actions */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Upvote */}
          <button
            onClick={() => toggleUpvote(post.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              post.hasUpvoted
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
            title="Upvote post"
          >
            <ArrowBigUp className={`w-4 h-4 ${post.hasUpvoted ? 'fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400' : ''}`} />
            <span>{post.upvotes}</span>
          </button>

          {/* Spark (Idea Endorsement) */}
          <button
            onClick={() => toggleSpark(post.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              post.hasSparked
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
            title="Endorse this idea"
          >
            <Sparkles className={`w-3.5 h-3.5 ${post.hasSparked ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{post.sparks}</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => onExpand(post.id)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Comments"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.commentsCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Bookmark */}
          <button
            onClick={() => toggleBookmark(post.id)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              post.hasBookmarked
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
            title="Bookmark"
          >
            <Bookmark className={`w-3.5 h-3.5 ${post.hasBookmarked ? 'fill-indigo-600 text-indigo-600' : ''}`} />
          </button>

          {/* Expand Details button */}
          <button
            onClick={() => onExpand(post.id)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            View details →
          </button>
        </div>
      </div>
    </article>
  );
};
