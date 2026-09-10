import {
  db,
  auth,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  limit,
  signInWithPopup,
  signInAnonymously,
  fbSignOut,
  googleProvider,
  FirebaseUser,
} from './firebase';
import {
  User,
  Post,
  Space,
  Project,
  Opportunity,
  Collection,
  Moment,
  ChannelMessage,
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
  DEMO_CHANNEL_MESSAGES,
} from '../data/seedData';

// Utility to remove undefined values because Firestore throws on undefined
export function cleanForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    return value === undefined ? null : value;
  }));
}

// ---------------- AUTHENTICATION & PROFILE ---------------- //

export async function loginWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn('Google sign-in popup error or cancelled:', error);
    // If popup is blocked in iframe/sandboxed preview, fall back gracefully
    throw error;
  }
}

export async function loginAnonymously(): Promise<FirebaseUser | null> {
  const result = await signInAnonymously(auth);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await fbSignOut(auth);
}

export async function fetchOrCreateUserProfile(fbUser: FirebaseUser): Promise<User> {
  const userDocRef = doc(db, 'users', fbUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data() as User;
  }

  // Create new profile for this authenticated user
  const newUserProfile: User = {
    id: fbUser.uid,
    username: fbUser.displayName
      ? fbUser.displayName.toLowerCase().replace(/[^a-z0-9]/g, '')
      : `builder_${fbUser.uid.slice(0, 5)}`,
    name: fbUser.displayName || 'Riishil Mehta',
    tagline: 'AI Developer • Builder • NEXORA Pioneer',
    bio: 'Building systems beyond boundaries. Contributing to open projects, neural research, and spatial interfaces.',
    avatar:
      fbUser.photoURL ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    location: 'San Francisco, CA / Mumbai',
    website: 'https://github.com/riishil',
    skills: ['AI Systems', 'TypeScript', 'Rust', 'Spatial Computing', 'Robotics'],
    interests: ['Neural Networks', 'Distributed Systems', 'Applied AI'],
    identityScore: 82,
    contributions: {
      projects: 3,
      helpfulAnswers: 12,
      discussions: 18,
      collaborations: 5,
      consistencyScore: 90,
      verifiedSkills: 5,
    },
    badges: CURRENT_USER.badges,
    collaborationStatus: 'open_for_collab',
    joinedDate: 'Joined recently',
    activeProjectsCount: 2,
    spacesCount: 3,
  };

  await setDoc(userDocRef, cleanForFirestore(newUserProfile));
  return newUserProfile;
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
  const userDocRef = doc(db, 'users', userId);
  await setDoc(userDocRef, cleanForFirestore(updates), { merge: true });
}

// ---------------- INITIAL CLOUD SEEDING ---------------- //

let seedingPromise: Promise<void> | null = null;

export async function ensureFirestoreSeeded(): Promise<void> {
  if (seedingPromise) return seedingPromise;

  seedingPromise = (async () => {
    try {
      const postsSnapshot = await getDocs(query(collection(db, 'posts'), limit(1)));
      if (!postsSnapshot.empty) {
        // Database already has live data
        return;
      }

      console.log('Seeding initial persistent cloud data to Firestore...');

      // Seed Users
      const usersToSeed = Array.from(new Map([CURRENT_USER, ...DEMO_USERS].map(u => [u.id, u])).values());
      for (const u of usersToSeed) {
        await setDoc(doc(db, 'users', u.id), cleanForFirestore(u));
      }

      // Seed Posts
      for (const p of DEMO_POSTS) {
        await setDoc(doc(db, 'posts', p.id), cleanForFirestore(p));
      }

      // Seed Spaces
      for (const s of DEMO_SPACES) {
        await setDoc(doc(db, 'spaces', s.id), cleanForFirestore(s));
      }

      // Seed Projects
      for (const pr of DEMO_PROJECTS) {
        await setDoc(doc(db, 'projects', pr.id), cleanForFirestore(pr));
      }

      // Seed Opportunities
      for (const opp of DEMO_OPPORTUNITIES) {
        await setDoc(doc(db, 'opportunities', opp.id), cleanForFirestore(opp));
      }

      // Seed Collections
      for (const c of DEMO_COLLECTIONS) {
        await setDoc(doc(db, 'collections', c.id), cleanForFirestore(c));
      }

      // Seed Moments
      for (const m of DEMO_MOMENTS) {
        await setDoc(doc(db, 'moments', m.id), cleanForFirestore(m));
      }

      // Seed Channel Messages
      for (const [channelId, msgs] of Object.entries(DEMO_CHANNEL_MESSAGES)) {
        for (const msg of msgs) {
          await setDoc(doc(db, 'channelMessages', msg.id), cleanForFirestore({ ...msg, channelId }));
        }
      }

      console.log('Firestore cloud database seeding complete.');
    } catch (err) {
      console.warn('Firestore seeding check encountered an issue (will use cached/client data):', err);
    }
  })();

  return seedingPromise;
}

// ---------------- REAL-TIME CLOUD LISTENERS ---------------- //

export function subscribeToPosts(onUpdate: (posts: Post[]) => void) {
  const postsQuery = query(collection(db, 'posts'));
  return onSnapshot(
    postsQuery,
    snapshot => {
      if (snapshot.empty) return;
      const loadedPosts = snapshot.docs.map(d => {
        const data = d.data() as Post;
        return {
          ...data,
          tags: data.tags || [],
          media: data.media || [],
          comments: data.comments || [],
        };
      });
      // Sort newest first
      loadedPosts.sort((a, b) => (b.createdAt < a.createdAt ? -1 : 1));
      onUpdate(loadedPosts);
    },
    error => {
      console.warn('Firestore posts subscription notice:', error);
    }
  );
}

export function subscribeToSpaces(onUpdate: (spaces: Space[]) => void) {
  const spacesQuery = query(collection(db, 'spaces'));
  return onSnapshot(
    spacesQuery,
    snapshot => {
      if (snapshot.empty) return;
      const loadedSpaces = snapshot.docs.map(d => {
        const data = d.data() as Space;
        return {
          ...data,
          tags: data.tags || [],
          channels: data.channels || [],
          events: data.events || [],
          resources: data.resources || [],
        };
      });
      onUpdate(loadedSpaces);
    },
    error => {
      console.warn('Firestore spaces subscription notice:', error);
    }
  );
}

export function subscribeToProjects(onUpdate: (projects: Project[]) => void) {
  const projectsQuery = query(collection(db, 'projects'));
  return onSnapshot(
    projectsQuery,
    snapshot => {
      if (snapshot.empty) return;
      const loadedProjects = snapshot.docs.map(d => {
        const data = d.data() as Project;
        return {
          ...data,
          technologies: data.technologies || [],
          contributors: data.contributors || [],
          collaboratorsNeeded: data.collaboratorsNeeded || [],
          milestones: data.milestones || [],
          updates: data.updates || [],
        };
      });
      onUpdate(loadedProjects);
    },
    error => {
      console.warn('Firestore projects subscription notice:', error);
    }
  );
}

export function subscribeToOpportunities(onUpdate: (opps: Opportunity[]) => void) {
  const oppQuery = query(collection(db, 'opportunities'));
  return onSnapshot(
    oppQuery,
    snapshot => {
      if (snapshot.empty) return;
      const loadedOpps = snapshot.docs.map(d => {
        const data = d.data() as any;
        return {
          ...data,
          requiredSkills: data.requiredSkills || data.skillsNeeded || [],
        } as Opportunity;
      });
      onUpdate(loadedOpps);
    },
    error => {
      console.warn('Firestore opportunities subscription notice:', error);
    }
  );
}

export function subscribeToMoments(onUpdate: (moments: Moment[]) => void) {
  const momentsQuery = query(collection(db, 'moments'));
  return onSnapshot(
    momentsQuery,
    snapshot => {
      if (snapshot.empty) return;
      const loadedMoments = snapshot.docs.map(d => d.data() as Moment);
      onUpdate(loadedMoments);
    },
    error => {
      console.warn('Firestore moments subscription notice:', error);
    }
  );
}

export function subscribeToCollections(onUpdate: (cols: Collection[]) => void) {
  const colsQuery = query(collection(db, 'collections'));
  return onSnapshot(
    colsQuery,
    snapshot => {
      if (snapshot.empty) return;
      const loadedCols = snapshot.docs.map(d => {
        const data = d.data() as Collection;
        return {
          ...data,
          items: data.items || [],
        };
      });
      onUpdate(loadedCols);
    },
    error => {
      console.warn('Firestore collections subscription notice:', error);
    }
  );
}

export function subscribeToChannelMessages(onUpdate: (dict: Record<string, ChannelMessage[]>) => void) {
  const msgsQuery = query(collection(db, 'channelMessages'));
  return onSnapshot(
    msgsQuery,
    snapshot => {
      if (snapshot.empty) return;
      const dict: Record<string, ChannelMessage[]> = {};
      snapshot.docs.forEach(d => {
        const item = d.data() as ChannelMessage & { channelId?: string };
        const chId = item.channelId || 'general';
        if (!dict[chId]) dict[chId] = [];
        dict[chId].push(item);
      });
      onUpdate(dict);
    },
    error => {
      console.warn('Firestore channelMessages subscription notice:', error);
    }
  );
}

// ---------------- CLOUD MUTATIONS ---------------- //

export async function savePostToCloud(post: Post): Promise<void> {
  await setDoc(doc(db, 'posts', post.id), cleanForFirestore(post));
}

export async function updatePostInCloud(postId: string, updates: Partial<Post>): Promise<void> {
  await updateDoc(doc(db, 'posts', postId), cleanForFirestore(updates));
}

export async function saveSpaceToCloud(space: Space): Promise<void> {
  await setDoc(doc(db, 'spaces', space.id), cleanForFirestore(space));
}

export async function updateSpaceInCloud(spaceId: string, updates: Partial<Space>): Promise<void> {
  await updateDoc(doc(db, 'spaces', spaceId), cleanForFirestore(updates));
}

export async function saveProjectToCloud(project: Project): Promise<void> {
  await setDoc(doc(db, 'projects', project.id), cleanForFirestore(project));
}

export async function updateProjectInCloud(projectId: string, updates: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, 'projects', projectId), cleanForFirestore(updates));
}

export async function saveOpportunityToCloud(opp: Opportunity): Promise<void> {
  await setDoc(doc(db, 'opportunities', opp.id), cleanForFirestore(opp));
}

export async function saveMomentToCloud(moment: Moment): Promise<void> {
  await setDoc(doc(db, 'moments', moment.id), cleanForFirestore(moment));
}

export async function saveChannelMessageToCloud(channelId: string, message: ChannelMessage): Promise<void> {
  await setDoc(doc(db, 'channelMessages', message.id), cleanForFirestore({ ...message, channelId }));
}
