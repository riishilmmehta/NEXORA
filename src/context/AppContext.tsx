import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Post,
  Space,
  Project,
  Opportunity,
  Collection,
  Moment,
  Notification,
  Conversation,
  ChannelMessage,
  PostType,
  EvolutionStage,
} from '../types';
import {
  CURRENT_USER,
  DEMO_USERS,
  DEMO_POSTS,
  DEMO_SPACES,
  DEMO_PROJECTS,
  DEMO_OPPORTUNITIES,
  DEMO_COLLECTIONS,
  DEMO_MOMENTS,
  DEMO_NOTIFICATIONS,
  DEMO_CONVERSATIONS,
  DEMO_CHANNEL_MESSAGES,
} from '../data/seedData';
import {
  auth,
  onAuthStateChanged,
  FirebaseUser,
} from '../lib/firebase';
import {
  ensureFirestoreSeeded,
  subscribeToPosts,
  subscribeToSpaces,
  subscribeToProjects,
  subscribeToOpportunities,
  subscribeToMoments,
  subscribeToCollections,
  subscribeToChannelMessages,
  savePostToCloud,
  updatePostInCloud,
  saveSpaceToCloud,
  updateSpaceInCloud,
  saveProjectToCloud,
  updateProjectInCloud,
  saveOpportunityToCloud,
  saveMomentToCloud,
  saveChannelMessageToCloud,
  loginWithGoogle as fbLoginWithGoogle,
  loginAnonymously as fbLoginAnonymously,
  logoutUser as fbLogoutUser,
  fetchOrCreateUserProfile,
  updateUserProfile,
} from '../lib/firestoreService';

interface AppContextType {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  currentUser: User;
  setCurrentUser: (u: User) => void;
  users: User[];
  posts: Post[];
  spaces: Space[];
  projects: Project[];
  opportunities: Opportunity[];
  collections: Collection[];
  moments: Moment[];
  notifications: Notification[];
  conversations: Conversation[];
  channelMessages: Record<string, ChannelMessage[]>;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedSpaceId: string | null;
  setSelectedSpaceId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedUserProfileId: string | null;
  setSelectedUserProfileId: (id: string | null) => void;
  expandedPostId: string | null;
  setExpandedPostId: (id: string | null) => void;
  isComposerOpen: boolean;
  setIsComposerOpen: (open: boolean) => void;
  defaultComposerType: PostType;
  setDefaultComposerType: (t: PostType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeMomentIndex: number | null;
  setActiveMomentIndex: (idx: number | null) => void;

  // Real Firebase / Firestore State
  firebaseUser: FirebaseUser | null;
  isFirestoreConnected: boolean;
  isAuthLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  loginAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (updates: Partial<User>) => Promise<void>;

  // Real Actions
  createPost: (newPost: Partial<Post>) => void;
  toggleUpvote: (postId: string) => void;
  toggleSpark: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  votePoll: (postId: string, optionId: string) => void;
  addComment: (postId: string, content: string, parentId?: string) => void;
  markBestAnswer: (postId: string, commentId: string) => void;
  evolveIdea: (postId: string, targetStage: EvolutionStage, spaceName?: string, projectName?: string) => void;

  toggleJoinSpace: (spaceId: string) => void;
  createSpace: (spaceData: Partial<Space>) => Space;
  sendChannelMessage: (channelId: string, content: string) => void;

  createProject: (projectData: Partial<Project>) => Project;
  requestCollaboration: (projectId: string, note?: string) => void;
  addProjectMilestone: (projectId: string, title: string, desc: string, date: string) => void;

  applyOpportunity: (oppId: string, note?: string) => void;
  createOpportunity: (oppData: Partial<Opportunity>) => void;

  createCollection: (title: string, desc: string, cover: string) => void;
  saveToCollection: (collectionId: string, item: any) => void;

  createMoment: (media: string, caption: string, type: any, projectRef?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  sendMessage: (recipientId: string, content: string) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [users, setUsers] = useState<User[]>(() => {
    const seen = new Set<string>();
    return DEMO_USERS.filter(u => {
      if (seen.has(u.id)) return false;
      seen.add(u.id);
      return true;
    });
  });
  const [posts, setPosts] = useState<Post[]>(DEMO_POSTS);
  const [spaces, setSpaces] = useState<Space[]>(DEMO_SPACES);
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(DEMO_OPPORTUNITIES);
  const [collections, setCollections] = useState<Collection[]>(DEMO_COLLECTIONS);
  const [moments, setMoments] = useState<Moment[]>(DEMO_MOMENTS);
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const [conversations, setConversations] = useState<Conversation[]>(DEMO_CONVERSATIONS);
  const [channelMessages, setChannelMessages] = useState<Record<string, ChannelMessage[]>>(DEMO_CHANNEL_MESSAGES);

  const [activeView, setActiveView] = useState<string>('home');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedUserProfileId, setSelectedUserProfileId] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [defaultComposerType, setDefaultComposerType] = useState<PostType>('thought');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMomentIndex, setActiveMomentIndex] = useState<number | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-elena');

  // Firebase Real States
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Sync theme with HTML root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#08090B';
      document.body.style.color = '#EDEFF2';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F7F7F4';
      document.body.style.color = '#15171A';
    }
  }, [theme]);

  // Firebase Auth Listener & Firestore Live Subscriptions
  useEffect(() => {
    let unsubscribeAuth: (() => void) | undefined;
    let unsubPosts: (() => void) | undefined;
    let unsubSpaces: (() => void) | undefined;
    let unsubProjects: (() => void) | undefined;
    let unsubOpps: (() => void) | undefined;
    let unsubMoments: (() => void) | undefined;
    let unsubCollections: (() => void) | undefined;
    let unsubMsgs: (() => void) | undefined;

    const initFirebaseApp = async () => {
      try {
        // 1. Initial Cloud Seeding (if Firestore is freshly created)
        await ensureFirestoreSeeded();
        setIsFirestoreConnected(true);

        // 2. Real-time Subscriptions
        unsubPosts = subscribeToPosts(updatedPosts => {
          if (updatedPosts.length > 0) {
            setPosts(updatedPosts);
          }
        });

        unsubSpaces = subscribeToSpaces(updatedSpaces => {
          if (updatedSpaces.length > 0) {
            setSpaces(updatedSpaces);
          }
        });

        unsubProjects = subscribeToProjects(updatedProjects => {
          if (updatedProjects.length > 0) {
            setProjects(updatedProjects);
          }
        });

        unsubOpps = subscribeToOpportunities(updatedOpps => {
          if (updatedOpps.length > 0) {
            setOpportunities(updatedOpps);
          }
        });

        unsubMoments = subscribeToMoments(updatedMoments => {
          if (updatedMoments.length > 0) {
            setMoments(updatedMoments);
          }
        });

        unsubCollections = subscribeToCollections(updatedCols => {
          if (updatedCols.length > 0) {
            setCollections(updatedCols);
          }
        });

        unsubMsgs = subscribeToChannelMessages(updatedDict => {
          if (Object.keys(updatedDict).length > 0) {
            setChannelMessages(prev => ({ ...prev, ...updatedDict }));
          }
        });

        // 3. Auth Listener
        unsubscribeAuth = onAuthStateChanged(auth, async fbUser => {
          setFirebaseUser(fbUser);
          setIsAuthLoading(false);

          if (fbUser) {
            try {
              const profile = await fetchOrCreateUserProfile(fbUser);
              setCurrentUser(profile);
              setUsers(prev => {
                const filtered = prev.filter(u => u.id !== profile.id);
                return [profile, ...filtered];
              });
            } catch (e) {
              console.warn('Could not load user profile from Firestore:', e);
            }
          }
        });
      } catch (err) {
        console.warn('Firebase initialization error (using fallback local cache):', err);
        setIsAuthLoading(false);
      }
    };

    initFirebaseApp();

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubPosts) unsubPosts();
      if (unsubSpaces) unsubSpaces();
      if (unsubProjects) unsubProjects();
      if (unsubOpps) unsubOpps();
      if (unsubMoments) unsubMoments();
      if (unsubCollections) unsubCollections();
      if (unsubMsgs) unsubMsgs();
    };
  }, []);

  // Auth Methods
  const loginWithGoogle = async () => {
    const user = await fbLoginWithGoogle();
    if (user) {
      const profile = await fetchOrCreateUserProfile(user);
      setCurrentUser(profile);
      setIsAuthModalOpen(false);
    }
  };

  const loginAnonymously = async () => {
    const user = await fbLoginAnonymously();
    if (user) {
      const profile = await fetchOrCreateUserProfile(user);
      setCurrentUser(profile);
      setIsAuthModalOpen(false);
    }
  };

  const logout = async () => {
    await fbLogoutUser();
    setCurrentUser(CURRENT_USER);
  };

  const updateProfileData = async (updates: Partial<User>) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));

    // Save to Firestore
    try {
      await updateUserProfile(currentUser.id, updates);
    } catch (err) {
      console.warn('Failed to update profile in Firestore:', err);
    }
  };

  // Create post via Universal Composer
  const createPost = async (newPostData: Partial<Post>) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: currentUser,
      type: newPostData.type || 'thought',
      title: newPostData.title || undefined,
      content: newPostData.content || '',
      tags: newPostData.tags || ['NEXORA'],
      createdAt: 'Just now',
      media: newPostData.media || undefined,
      externalLink: newPostData.externalLink || undefined,
      spaceId: newPostData.spaceId,
      spaceName: newPostData.spaceName,
      projectId: newPostData.projectId,
      projectName: newPostData.projectName,
      poll: newPostData.poll,
      evolution:
        newPostData.type === 'thought' || newPostData.title?.toLowerCase().includes('idea')
          ? {
              currentStage: 'idea',
              sparkCount: 1,
              collaboratorIds: [currentUser.id],
            }
          : undefined,
      upvotes: 1,
      hasUpvoted: true,
      sparks: 1,
      hasSparked: true,
      bookmarks: 0,
      hasBookmarked: false,
      commentsCount: 0,
      comments: [],
    };

    // Optimistic UI update
    setPosts(prev => [newPost, ...prev]);

    // Boost user contribution score
    const updatedProfile = {
      ...currentUser,
      identityScore: Math.min(100, currentUser.identityScore + 1),
      contributions: {
        ...currentUser.contributions,
        discussions: currentUser.contributions.discussions + 1,
      },
    };
    setCurrentUser(updatedProfile);

    // Persist real post to Firestore
    try {
      await savePostToCloud(newPost);
      await updateUserProfile(currentUser.id, {
        identityScore: updatedProfile.identityScore,
        contributions: updatedProfile.contributions,
      });
    } catch (err) {
      console.warn('Failed to save post to Firestore:', err);
    }

    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.85 } });
    } catch {
      // ignore
    }
  };

  const toggleUpvote = async (postId: string) => {
    let targetPost: Post | undefined;

    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const hasUpvoted = !p.hasUpvoted;
        const updated = {
          ...p,
          hasUpvoted,
          upvotes: hasUpvoted ? p.upvotes + 1 : Math.max(0, p.upvotes - 1),
        };
        targetPost = updated;
        return updated;
      })
    );

    if (targetPost) {
      try {
        await updatePostInCloud(postId, {
          upvotes: (targetPost as Post).upvotes,
          hasUpvoted: (targetPost as Post).hasUpvoted,
        });
      } catch (err) {
        console.warn('Failed to persist upvote:', err);
      }
    }
  };

  const toggleSpark = async (postId: string) => {
    let targetPost: Post | undefined;

    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const hasSparked = !p.hasSparked;
        const newSparks = hasSparked ? p.sparks + 1 : Math.max(0, p.sparks - 1);

        const evolution = p.evolution
          ? {
              ...p.evolution,
              sparkCount: hasSparked ? p.evolution.sparkCount + 1 : Math.max(0, p.evolution.sparkCount - 1),
            }
          : undefined;

        const updated = {
          ...p,
          hasSparked,
          sparks: newSparks,
          evolution,
        };
        targetPost = updated;
        return updated;
      })
    );

    if (targetPost) {
      try {
        await updatePostInCloud(postId, {
          sparks: (targetPost as Post).sparks,
          hasSparked: (targetPost as Post).hasSparked,
          evolution: (targetPost as Post).evolution,
        });
      } catch (err) {
        console.warn('Failed to persist spark:', err);
      }
    }
  };

  const toggleBookmark = async (postId: string) => {
    let targetPost: Post | undefined;

    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const hasBookmarked = !p.hasBookmarked;
        const updated = {
          ...p,
          hasBookmarked,
          bookmarks: hasBookmarked ? p.bookmarks + 1 : Math.max(0, p.bookmarks - 1),
        };
        targetPost = updated;
        return updated;
      })
    );

    if (targetPost) {
      try {
        await updatePostInCloud(postId, {
          bookmarks: (targetPost as Post).bookmarks,
          hasBookmarked: (targetPost as Post).hasBookmarked,
        });
      } catch (err) {
        console.warn('Failed to persist bookmark:', err);
      }
    }
  };

  const votePoll = async (postId: string, optionId: string) => {
    let targetPoll: any = null;

    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId || !p.poll || p.poll.userVotedOptionId) return p;
        const options = p.poll.options.map(opt =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );
        const poll = {
          ...p.poll,
          options,
          totalVotes: p.poll.totalVotes + 1,
          userVotedOptionId: optionId,
        };
        targetPoll = poll;
        return {
          ...p,
          poll,
        };
      })
    );

    if (targetPoll) {
      try {
        await updatePostInCloud(postId, { poll: targetPoll });
      } catch (err) {
        console.warn('Failed to persist poll vote:', err);
      }
    }
  };

  const addComment = async (postId: string, content: string, parentId?: string) => {
    if (!content.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      postId,
      author: currentUser,
      content,
      createdAt: 'Just now',
      upvotes: 0,
      parentId,
    };

    let updatedCommentsList: any[] = [];
    let updatedCommentsCount = 0;

    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const existingComments = p.comments || [];
        let updatedComments;
        if (parentId) {
          updatedComments = existingComments.map(c => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newComment],
              };
            }
            return c;
          });
        } else {
          updatedComments = [...existingComments, newComment];
        }

        updatedCommentsList = updatedComments;
        updatedCommentsCount = p.commentsCount + 1;

        return {
          ...p,
          commentsCount: updatedCommentsCount,
          comments: updatedComments,
        };
      })
    );

    // Increase user contribution
    setCurrentUser(prev => ({
      ...prev,
      contributions: {
        ...prev.contributions,
        helpfulAnswers: prev.contributions.helpfulAnswers + 1,
      },
      identityScore: Math.min(100, prev.identityScore + 1),
    }));

    try {
      await updatePostInCloud(postId, {
        comments: updatedCommentsList,
        commentsCount: updatedCommentsCount,
      });
      await updateUserProfile(currentUser.id, {
        identityScore: Math.min(100, currentUser.identityScore + 1),
      });
    } catch (err) {
      console.warn('Failed to persist comment:', err);
    }
  };

  const markBestAnswer = async (postId: string, commentId: string) => {
    let updatedCommentsList: any[] = [];

    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId || !p.comments) return p;
        const updated = p.comments.map(c => ({
          ...c,
          isBestAnswer: c.id === commentId ? !c.isBestAnswer : false,
        }));
        updatedCommentsList = updated;
        return {
          ...p,
          comments: updated,
        };
      })
    );

    if (updatedCommentsList.length > 0) {
      try {
        await updatePostInCloud(postId, { comments: updatedCommentsList });
      } catch (err) {
        console.warn('Failed to persist best answer:', err);
      }
    }
  };

  // THE KILLER CONCEPT: IDEA EVOLUTION ENGINE
  const evolveIdea = async (
    postId: string,
    targetStage: EvolutionStage,
    spaceName?: string,
    projectName?: string
  ) => {
    let createdSpace: Space | undefined;
    let createdProject: Project | undefined;
    let updatedEvolution: any = null;

    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const currentEvolution = p.evolution || {
          currentStage: 'idea',
          sparkCount: p.sparks,
          collaboratorIds: [currentUser.id],
        };

        if (targetStage === 'space') {
          const spaceTitle = spaceName || `${p.title || 'Idea'} Space`;
          const sSlug = spaceTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          createdSpace = {
            id: `space-${Date.now()}`,
            name: spaceTitle,
            slug: sSlug,
            tagline: `Evolved from Idea: ${p.title || 'Community Spark'}`,
            description: p.content.slice(0, 240),
            avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
            coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
            category: 'Evolved Idea',
            visibility: 'public',
            membersCount: 1,
            isMember: true,
            userRole: 'owner',
            channels: [
              { id: `ch-${Date.now()}-announcements`, name: 'announcements', description: 'Space updates', type: 'announcements' },
              { id: `ch-${Date.now()}-general`, name: 'general', description: 'Idea brainstorming', type: 'chat' },
              { id: `ch-${Date.now()}-collab`, name: 'collaboration', description: 'Recruiting contributors', type: 'chat' },
            ],
            featuredProjectIds: [],
            tags: p.tags,
            events: [],
            resources: [],
          };
        }

        if (targetStage === 'project') {
          const projTitle = projectName || p.title || 'New Initiative';
          const pSlug = projTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          createdProject = {
            id: `proj-${Date.now()}`,
            name: projTitle,
            slug: pSlug,
            tagline: p.content.slice(0, 90) + '...',
            description: p.content,
            coverImage: p.media?.[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
            gallery: p.media || ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'],
            technologies: p.tags,
            status: 'building',
            owner: currentUser,
            contributors: [currentUser],
            spaceId: p.spaceId,
            spaceName: p.spaceName,
            originIdeaPostId: p.id,
            collaboratorsNeeded: ['Core Contributor', 'Interface Architect'],
            createdAt: 'Just now',
            viewsCount: 1,
            sparksCount: p.sparks,
            milestones: [
              { id: `m-${Date.now()}-1`, title: 'Core Proof of Concept', description: 'Validating the foundational idea', status: 'in_progress', targetDate: 'Next Month' },
              { id: `m-${Date.now()}-2`, title: 'Public Community Alpha', description: 'Initial test release on NEXORA', status: 'planned', targetDate: 'Q3 2026' },
            ],
            updates: [
              {
                id: `up-${Date.now()}`,
                author: currentUser,
                title: 'Idea officially evolved into a full project!',
                content: 'Thanks to the community feedback and sparks, we have graduated this idea into an active project repository.',
                date: 'Just now',
              },
            ],
          };
        }

        updatedEvolution = {
          ...currentEvolution,
          currentStage: targetStage,
          derivedSpaceId: createdSpace ? createdSpace.id : currentEvolution.derivedSpaceId,
          derivedProjectId: createdProject ? createdProject.id : currentEvolution.derivedProjectId,
        };

        return {
          ...p,
          evolution: updatedEvolution,
        };
      })
    );

    if (createdSpace) {
      setSpaces(prev => [createdSpace!, ...prev]);
      try {
        await saveSpaceToCloud(createdSpace!);
      } catch (err) {
        console.warn('Failed to persist created space to cloud:', err);
      }
    }

    if (createdProject) {
      setProjects(prev => [createdProject!, ...prev]);
      try {
        await saveProjectToCloud(createdProject!);
      } catch (err) {
        console.warn('Failed to persist created project to cloud:', err);
      }
    }

    if (updatedEvolution) {
      try {
        await updatePostInCloud(postId, { evolution: updatedEvolution });
      } catch (err) {
        console.warn('Failed to persist evolved post evolution:', err);
      }
    }

    // Boost identity score and add notification
    setCurrentUser(prev => ({
      ...prev,
      identityScore: Math.min(100, prev.identityScore + 3),
      contributions: {
        ...prev.contributions,
        projects: targetStage === 'project' ? prev.contributions.projects + 1 : prev.contributions.projects,
        collaborations: prev.contributions.collaborations + 1,
      },
    }));

    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981'],
      });
    } catch {
      // ignore
    }

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        category: 'projects',
        title: `Idea Evolved to ${targetStage.toUpperCase()}!`,
        message: `Your idea has successfully graduated into the "${targetStage}" milestone in the NEXORA ecosystem.`,
        actor: currentUser,
        createdAt: 'Just now',
        isRead: false,
      },
      ...prev,
    ]);
  };

  const toggleJoinSpace = async (spaceId: string) => {
    let updatedSpace: Space | undefined;

    setSpaces(prev =>
      prev.map(s => {
        if (s.id !== spaceId) return s;
        const isMember = !s.isMember;
        const updated = {
          ...s,
          isMember,
          membersCount: isMember ? s.membersCount + 1 : Math.max(0, s.membersCount - 1),
        };
        updatedSpace = updated;
        return updated;
      })
    );

    if (updatedSpace) {
      try {
        await updateSpaceInCloud(spaceId, {
          isMember: (updatedSpace as Space).isMember,
          membersCount: (updatedSpace as Space).membersCount,
        });
      } catch (err) {
        console.warn('Failed to update space in cloud:', err);
      }
    }
  };

  const createSpace = (spaceData: Partial<Space>): Space => {
    const newSpace: Space = {
      id: `space-${Date.now()}`,
      name: spaceData.name || 'New Space',
      slug: (spaceData.name || 'new-space').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: spaceData.tagline || 'A collaborative environment for makers.',
      description: spaceData.description || 'Welcome to our space.',
      avatar: spaceData.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      coverImage: spaceData.coverImage || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      category: spaceData.category || 'General',
      visibility: spaceData.visibility || 'public',
      membersCount: 1,
      isMember: true,
      userRole: 'owner',
      channels: [
        { id: `ch-${Date.now()}-general`, name: 'general', description: 'Community chat', type: 'chat' },
        { id: `ch-${Date.now()}-projects`, name: 'projects', description: 'Showcase work', type: 'discussion' },
      ],
      featuredProjectIds: [],
      tags: spaceData.tags || ['Community'],
      events: [],
      resources: [],
    };

    setSpaces(prev => [newSpace, ...prev]);

    // Save to Firestore
    saveSpaceToCloud(newSpace).catch(err => {
      console.warn('Failed to save space to Firestore:', err);
    });

    return newSpace;
  };

  const sendChannelMessage = async (channelId: string, content: string) => {
    if (!content.trim()) return;
    const msg: ChannelMessage = {
      id: `cm-${Date.now()}`,
      channelId,
      author: currentUser,
      content,
      createdAt: 'Just now',
    };

    setChannelMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), msg],
    }));

    // Persist to Firestore
    try {
      await saveChannelMessageToCloud(channelId, msg);
    } catch (err) {
      console.warn('Failed to save channel message:', err);
    }
  };

  const createProject = (projectData: Partial<Project>): Project => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: projectData.name || 'New Project',
      slug: (projectData.name || 'new-project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: projectData.tagline || 'Building something groundbreaking.',
      description: projectData.description || 'Detailed project documentation.',
      coverImage: projectData.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      gallery: projectData.gallery || ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'],
      technologies: projectData.technologies || ['TypeScript', 'Python'],
      status: projectData.status || 'building',
      owner: currentUser,
      contributors: [currentUser],
      collaboratorsNeeded: projectData.collaboratorsNeeded || ['Builder'],
      createdAt: 'Just now',
      viewsCount: 1,
      sparksCount: 1,
      milestones: [
        { id: `pm-${Date.now()}-1`, title: 'Inception & Architecture', description: 'Foundational repository setup', status: 'completed', targetDate: 'Current' },
        { id: `pm-${Date.now()}-2`, title: 'First Working Prototype', description: 'Core functional deliverable', status: 'in_progress', targetDate: 'Next Month' },
      ],
      updates: [
        {
          id: `up-${Date.now()}`,
          author: currentUser,
          title: 'Project officially initialized on NEXORA',
          content: 'We have begun architecture design and are seeking open collaborators.',
          date: 'Just now',
        },
      ],
    };

    setProjects(prev => [newProject, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      activeProjectsCount: prev.activeProjectsCount + 1,
      contributions: {
        ...prev.contributions,
        projects: prev.contributions.projects + 1,
      },
    }));

    // Persist to Firestore
    saveProjectToCloud(newProject).catch(err => {
      console.warn('Failed to save project to Firestore:', err);
    });

    return newProject;
  };

  const requestCollaboration = async (projectId: string, note?: string) => {
    let updatedProj: Project | undefined;

    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        const alreadyIn = p.contributors.some(c => c.id === currentUser.id);
        if (alreadyIn) return p;
        const updated = {
          ...p,
          contributors: [...p.contributors, currentUser],
        };
        updatedProj = updated;
        return updated;
      })
    );

    if (updatedProj) {
      try {
        await updateProjectInCloud(projectId, {
          contributors: (updatedProj as Project).contributors,
        });
      } catch (err) {
        console.warn('Failed to persist collaboration in cloud:', err);
      }
    }

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        category: 'projects',
        title: 'Collaboration Request Submitted',
        message: `Your request to contribute was delivered to the project maintainer.${note ? ` Note: "${note}"` : ''}`,
        actor: currentUser,
        createdAt: 'Just now',
        isRead: false,
      },
      ...prev,
    ]);

    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch {
      // ignore
    }
  };

  const addProjectMilestone = async (projectId: string, title: string, desc: string, date: string) => {
    let updatedMilestones: any[] = [];

    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        const newM = { id: `m-${Date.now()}`, title, description: desc, status: 'planned' as const, targetDate: date };
        updatedMilestones = [...p.milestones, newM];
        return {
          ...p,
          milestones: updatedMilestones,
        };
      })
    );

    if (updatedMilestones.length > 0) {
      try {
        await updateProjectInCloud(projectId, { milestones: updatedMilestones });
      } catch (err) {
        console.warn('Failed to persist milestone in cloud:', err);
      }
    }
  };

  const applyOpportunity = (oppId: string, note?: string) => {
    setOpportunities(prev =>
      prev.map(o => {
        if (o.id !== oppId) return o;
        return {
          ...o,
          hasApplied: true,
          applicantCount: o.applicantCount + 1,
        };
      })
    );

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        category: 'opportunities',
        title: 'Application Dispatched',
        message: `You applied for this opportunity.${note ? ` Attached message: "${note}"` : ''}`,
        actor: currentUser,
        createdAt: 'Just now',
        isRead: false,
      },
      ...prev,
    ]);
  };

  const createOpportunity = (oppData: Partial<Opportunity>) => {
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: oppData.title || 'Collaborative Opportunity',
      organizationOrProject: oppData.organizationOrProject || 'Open Project',
      type: oppData.type || 'collaboration',
      creator: currentUser,
      description: oppData.description || '',
      requiredSkills: oppData.requiredSkills || ['Curiosity'],
      location: oppData.location || 'Remote',
      compensation: oppData.compensation,
      createdAt: 'Just now',
      applicantCount: 0,
    };

    setOpportunities(prev => [newOpp, ...prev]);

    saveOpportunityToCloud(newOpp).catch(err => {
      console.warn('Failed to save opportunity to Firestore:', err);
    });
  };

  const createCollection = (title: string, desc: string, cover: string) => {
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      title,
      description: desc,
      coverImage: cover || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      owner: currentUser,
      items: [],
      isPrivate: false,
      tags: ['Inspiration'],
      likesCount: 1,
    };
    setCollections(prev => [newCol, ...prev]);
  };

  const saveToCollection = (collectionId: string, item: any) => {
    setCollections(prev =>
      prev.map(c => {
        if (c.id !== collectionId) return c;
        return {
          ...c,
          items: [
            ...c.items,
            {
              id: `ci-${Date.now()}`,
              type: item.type || 'post',
              title: item.title || 'Saved Item',
              subtitle: item.subtitle,
              image: item.image || item.coverImage || item.media?.[0],
              sourceId: item.id,
              author: item.author || currentUser,
              savedAt: 'Just now',
            },
          ],
        };
      })
    );
  };

  const createMoment = (media: string, caption: string, type: any, projectRef?: string) => {
    const newMom: Moment = {
      id: `mom-${Date.now()}`,
      author: currentUser,
      media,
      caption,
      createdAt: 'Just now',
      expiresInHours: 24,
      type: type || 'progress',
      projectRef,
    };
    setMoments(prev => [newMom, ...prev]);

    saveMomentToCloud(newMom).catch(err => {
      console.warn('Failed to save moment to Firestore:', err);
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const sendMessage = (recipientId: string, content: string) => {
    if (!content.trim()) return;
    const recipient = users.find(u => u.id === recipientId) || DEMO_USERS[1];

    setConversations(prev => {
      const existing = prev.find(c => c.participant.id === recipientId);
      if (existing) {
        return prev.map(c =>
          c.participant.id === recipientId
            ? { ...c, lastMessage: content, lastMessageTime: 'Just now' }
            : c
        );
      } else {
        return [
          {
            id: `conv-${Date.now()}`,
            participant: recipient,
            lastMessage: content,
            lastMessageTime: 'Just now',
            unreadCount: 0,
            online: true,
          },
          ...prev,
        ];
      }
    });

    // Also persist into channelMessages under direct message channel key
    const dmKey = `dm-${[currentUser.id, recipientId].sort().join('-')}`;
    const dmMessage: ChannelMessage = {
      id: `dm-msg-${Date.now()}`,
      channelId: dmKey,
      author: currentUser,
      content,
      createdAt: 'Just now',
    };
    saveChannelMessageToCloud(dmKey, dmMessage).catch(console.warn);

    setTimeout(() => {
      setConversations(prev =>
        prev.map(c =>
          c.participant.id === recipientId
            ? { ...c, lastMessage: `Got it! Let's build this together.`, lastMessageTime: 'Just now' }
            : c
        )
      );
    }, 2500);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        currentUser,
        setCurrentUser,
        users,
        posts,
        spaces,
        projects,
        opportunities,
        collections,
        moments,
        notifications,
        conversations,
        channelMessages,
        activeView,
        setActiveView,
        selectedSpaceId,
        setSelectedSpaceId,
        selectedProjectId,
        setSelectedProjectId,
        selectedUserProfileId,
        setSelectedUserProfileId,
        expandedPostId,
        setExpandedPostId,
        isComposerOpen,
        setIsComposerOpen,
        defaultComposerType,
        setDefaultComposerType,
        searchQuery,
        setSearchQuery,
        activeMomentIndex,
        setActiveMomentIndex,
        firebaseUser,
        isFirestoreConnected,
        isAuthLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithGoogle,
        loginAnonymously,
        logout,
        updateProfileData,
        createPost,
        toggleUpvote,
        toggleSpark,
        toggleBookmark,
        votePoll,
        addComment,
        markBestAnswer,
        evolveIdea,
        toggleJoinSpace,
        createSpace,
        sendChannelMessage,
        createProject,
        requestCollaboration,
        addProjectMilestone,
        applyOpportunity,
        createOpportunity,
        createCollection,
        saveToCollection,
        createMoment,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendMessage,
        activeConversationId,
        setActiveConversationId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
