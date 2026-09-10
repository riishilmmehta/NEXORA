export type PostType =
  | 'thought'
  | 'question'
  | 'project'
  | 'showcase'
  | 'article'
  | 'poll'
  | 'resource'
  | 'collaboration'
  | 'announcement';

export type EvolutionStage =
  | 'idea'
  | 'discussion'
  | 'space'
  | 'collaboration'
  | 'project'
  | 'showcase'
  | 'reputation';

export type ProjectStatus =
  | 'idea'
  | 'planning'
  | 'building'
  | 'beta'
  | 'active'
  | 'completed'
  | 'archived';

export type OpportunityType =
  | 'collaboration'
  | 'internship'
  | 'hackathon'
  | 'project_team'
  | 'mentorship'
  | 'freelance'
  | 'event'
  | 'hiring';

export type SpaceRole = 'owner' | 'admin' | 'moderator' | 'contributor' | 'member';
export type SpaceVisibility = 'public' | 'private' | 'invite-only';

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  category: 'builder' | 'creator' | 'researcher' | 'contributor' | 'mentor' | 'designer' | 'developer' | 'leader';
  description: string;
}

export interface ContributionBreakdown {
  projects: number;
  helpfulAnswers: number;
  discussions: number;
  collaborations: number;
  consistencyScore: number;
  verifiedSkills: number;
}

export interface User {
  id: string;
  username: string;
  name: string;
  tagline: string;
  bio: string;
  avatar: string;
  coverImage: string;
  location: string;
  website?: string;
  skills: string[];
  interests: string[];
  identityScore: number; // Meaningful contribution score (0-100)
  contributions: ContributionBreakdown;
  badges: UserBadge[];
  collaborationStatus: 'open_for_collab' | 'building_team' | 'mentoring' | 'focused';
  joinedDate: string;
  activeProjectsCount: number;
  spacesCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
  isBestAnswer?: boolean;
  parentId?: string; // For nested replies
  replies?: Comment[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Post {
  id: string;
  author: User;
  type: PostType;
  title?: string;
  content: string;
  tags: string[];
  createdAt: string;
  media?: string[];
  externalLink?: {
    url: string;
    title: string;
    domain: string;
  };
  spaceId?: string;
  spaceName?: string;
  projectId?: string;
  projectName?: string;
  // Idea Evolution tracking
  evolution?: {
    currentStage: EvolutionStage;
    sparkCount: number;
    collaboratorIds: string[];
    derivedProjectId?: string;
    derivedSpaceId?: string;
  };
  // Poll data
  poll?: {
    question: string;
    options: PollOption[];
    totalVotes: number;
    userVotedOptionId?: string;
  };
  // Metrics
  upvotes: number;
  hasUpvoted?: boolean;
  sparks: number; // NEXORA's endorsement metric for ideas
  hasSparked?: boolean;
  bookmarks: number;
  hasBookmarked?: boolean;
  commentsCount: number;
  comments?: Comment[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'planned';
  targetDate: string;
}

export interface ProjectUpdate {
  id: string;
  author: User;
  title: string;
  content: string;
  date: string;
  media?: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  coverImage: string;
  gallery: string[];
  technologies: string[];
  status: ProjectStatus;
  owner: User;
  contributors: User[];
  milestones: ProjectMilestone[];
  updates: ProjectUpdate[];
  spaceId?: string;
  spaceName?: string;
  originIdeaPostId?: string;
  githubUrl?: string;
  liveUrl?: string;
  collaboratorsNeeded: string[];
  createdAt: string;
  viewsCount: number;
  sparksCount: number;
}

export interface SpaceChannel {
  id: string;
  name: string;
  description: string;
  type: 'chat' | 'discussion' | 'announcements' | 'resources';
  unreadCount?: number;
}

export interface ChannelMessage {
  id: string;
  channelId: string;
  author: User;
  content: string;
  createdAt: string;
  reactions?: { emoji: string; count: number; userReacted?: boolean }[];
  replyTo?: {
    id: string;
    authorName: string;
    text: string;
  };
}

export interface SpaceEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  host: User;
  type: 'workshop' | 'demo_day' | 'ama' | 'hacknight';
  attendeesCount: number;
}

export interface Space {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  avatar: string;
  coverImage: string;
  category: string;
  visibility: SpaceVisibility;
  membersCount: number;
  isMember?: boolean;
  userRole?: SpaceRole;
  channels: SpaceChannel[];
  featuredProjectIds: string[];
  tags: string[];
  events: SpaceEvent[];
  resources: { title: string; url: string; category: string }[];
}

export interface CollectionItem {
  id: string;
  type: 'post' | 'project' | 'image' | 'resource';
  title: string;
  subtitle?: string;
  image?: string;
  sourceId: string;
  author: User;
  savedAt: string;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  owner: User;
  items: CollectionItem[];
  isPrivate: boolean;
  tags: string[];
  likesCount: number;
}

export interface Moment {
  id: string;
  author: User;
  media: string;
  caption: string;
  createdAt: string;
  expiresInHours: number;
  type: 'progress' | 'prototype' | 'behind_the_scenes' | 'milestone';
  projectRef?: string;
  seen?: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  organizationOrProject: string;
  type: OpportunityType;
  creator: User;
  description: string;
  requiredSkills: string[];
  location: string; // "Remote" or specific
  compensation?: string;
  createdAt: string;
  deadline?: string;
  applicantCount: number;
  hasApplied?: boolean;
  projectSlug?: string;
}

export interface Notification {
  id: string;
  category: 'social' | 'projects' | 'spaces' | 'messages' | 'opportunities' | 'mentions';
  title: string;
  message: string;
  actor: User;
  actionUrl?: string;
  createdAt: string;
  isRead: boolean;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

export interface ConnectionNode {
  id: string;
  name: string;
  avatar: string;
  role: string;
  type: 'user' | 'project' | 'space';
}

export interface ConnectionEdge {
  source: string;
  target: string;
  relation: 'Created with' | 'Collaborated with' | 'Learned from' | 'Member of' | 'Works on' | 'Inspired by';
}
