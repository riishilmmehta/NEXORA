import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navigation/Navbar';
import { Sidebar } from './components/Navigation/Sidebar';
import { MobileNav } from './components/Navigation/MobileNav';
import { UniversalComposer } from './components/Composer/UniversalComposer';
import { ExpandedPostModal } from './components/Feed/ExpandedPostModal';
import { AuthModal } from './components/Auth/AuthModal';

// Views
import { FeedView } from './components/Feed/FeedView';
import { DiscoveryView } from './components/Discovery/DiscoveryView';
import { SpacesView } from './components/Spaces/SpacesView';
import { ProjectsView } from './components/Projects/ProjectsView';
import { ProfileView } from './components/Profile/ProfileView';
import { MessagesView } from './components/Messages/MessagesView';
import { CollectionsView } from './components/Collections/CollectionsView';
import { OpportunitiesView } from './components/Opportunities/OpportunitiesView';
import { GraphView } from './components/Graph/GraphView';

const MainContent: React.FC = () => {
  const { activeView, theme } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <FeedView />;
      case 'discover':
        return <DiscoveryView />;
      case 'spaces':
        return <SpacesView />;
      case 'projects':
        return <ProjectsView />;
      case 'profile':
        return <ProfileView />;
      case 'messages':
        return <MessagesView />;
      case 'collections':
        return <CollectionsView />;
      case 'opportunities':
        return <OpportunitiesView />;
      case 'graph':
        return <GraphView />;
      default:
        return <FeedView />;
    }
  };

  return (
    <div
      id="nexora-app-root"
      className={`min-h-screen transition-colors duration-150 flex flex-col font-sans ${
        theme === 'dark'
          ? 'dark bg-slate-950 text-slate-100'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Universal Navbar */}
      <Navbar />

      {/* Primary Workspace Frame */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Sticky Desktop Navigation Rail */}
        <Sidebar />

        {/* Dynamic Center Stage View */}
        <main
          id="nexora-main-stage"
          className="flex-1 min-w-0 p-3 sm:p-5 lg:p-6 overflow-x-hidden"
        >
          {renderActiveView()}
        </main>
      </div>

      {/* Thumb-Optimized Mobile Bottom Bar */}
      <MobileNav />

      {/* Universal 9-Archetype Composer Overlay */}
      <UniversalComposer />

      {/* Immersive Post Expansion & Idea Evolution Modal */}
      <ExpandedPostModal />

      {/* Real Firebase Authentication & Profile Cloud Sync Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
