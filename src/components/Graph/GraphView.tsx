import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Share2,
  Sparkles,
  Layers,
  FolderGit2,
  Users2,
  Filter,
  Info,
  ArrowUpRight,
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'user' | 'project' | 'space' | 'idea';
  x: number;
  y: number;
  r: number;
  color: string;
  subtitle: string;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
}

export const GraphView: React.FC = () => {
  const {
    users,
    projects,
    spaces,
    posts,
    theme,
    setSelectedUserProfileId,
    setSelectedProjectId,
    setSelectedSpaceId,
    setExpandedPostId,
    setActiveView,
  } = useApp();

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Galaxy Coordinates Mapping
  const nodes: GraphNode[] = [
    // Center: Current User
    {
      id: 'u-riishil',
      label: 'Riishil (You)',
      type: 'user',
      x: 350,
      y: 250,
      r: 22,
      color: '#6366F1', // Indigo
      subtitle: 'Spatial Systems & Applied AI',
    },
    // Collaborator: Elena
    {
      id: 'u-elena',
      label: 'Dr. Elena Vance',
      type: 'user',
      x: 180,
      y: 160,
      r: 18,
      color: '#818CF8',
      subtitle: 'Neural Interface Researcher',
    },
    // Collaborator: Marcus
    {
      id: 'u-marcus',
      label: 'Marcus Chen',
      type: 'user',
      x: 520,
      y: 180,
      r: 18,
      color: '#818CF8',
      subtitle: 'Hardware Architect',
    },
    // Collaborator: Aiko
    {
      id: 'u-aiko',
      label: 'Aiko Tanaka',
      type: 'user',
      x: 480,
      y: 380,
      r: 16,
      color: '#818CF8',
      subtitle: 'Creative Technologist',
    },
    // Project: Yama AI
    {
      id: 'proj-1',
      label: 'Yama AI Engine',
      type: 'project',
      x: 230,
      y: 340,
      r: 20,
      color: '#06B6D4', // Cyan
      subtitle: 'Semantic Graph Search in Rust',
    },
    // Project: Chrono
    {
      id: 'proj-2',
      label: 'Chrono OS',
      type: 'project',
      x: 370,
      y: 100,
      r: 18,
      color: '#06B6D4',
      subtitle: 'Spatial Computing Microkernel',
    },
    // Space: Neuro-Symbolic Space
    {
      id: 'space-ai',
      label: 'Neuro-Symbolic Hub',
      type: 'space',
      x: 110,
      y: 270,
      r: 20,
      color: '#A855F7', // Purple
      subtitle: '1,420 Member Space',
    },
    // Space: Spatial Computing Space
    {
      id: 'space-spatial',
      label: 'Spatial UX Collective',
      type: 'space',
      x: 590,
      y: 290,
      r: 18,
      color: '#A855F7',
      subtitle: '890 Member Space',
    },
    // Idea Spark
    {
      id: 'idea-1',
      label: 'Graph Neural Memory',
      type: 'idea',
      x: 350,
      y: 430,
      r: 16,
      color: '#F59E0B', // Amber
      subtitle: 'Evolved Idea • Stage 4',
    },
  ];

  const links: GraphLink[] = [
    { source: 'u-riishil', target: 'u-elena', label: 'Co-Authorship' },
    { source: 'u-riishil', target: 'u-marcus', label: 'Hardware Collaboration' },
    { source: 'u-riishil', target: 'u-aiko', label: 'Design Mentorship' },
    { source: 'u-riishil', target: 'proj-1', label: 'Core Maintainer' },
    { source: 'u-riishil', target: 'proj-2', label: 'Architecture Contributor' },
    { source: 'u-riishil', target: 'space-ai', label: 'Space Founder' },
    { source: 'u-riishil', target: 'space-spatial', label: 'Active Member' },
    { source: 'u-riishil', target: 'idea-1', label: 'Idea Creator' },
    { source: 'u-elena', target: 'space-ai', label: 'Research Lead' },
    { source: 'u-marcus', target: 'proj-2', label: 'Hardware Driver Spec' },
    { source: 'proj-1', target: 'space-ai', label: 'Incubated Space' },
    { source: 'idea-1', target: 'proj-1', label: 'Evolution Predecessor' },
  ];

  const filteredNodes = nodes.filter(n => filterType === 'all' || n.type === filterType);
  const filteredLinks = links.filter(l => {
    return filteredNodes.some(n => n.id === l.source) && filteredNodes.some(n => n.id === l.target);
  });

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const handleOpenEntity = (node: GraphNode) => {
    if (node.type === 'user') {
      setSelectedUserProfileId(node.id);
      setActiveView('profile');
    } else if (node.type === 'project') {
      setSelectedProjectId(node.id);
      setActiveView('projects');
    } else if (node.type === 'space') {
      setSelectedSpaceId(node.id);
      setActiveView('spaces');
    } else if (node.type === 'idea') {
      setExpandedPostId(posts[0]?.id || 'post-1');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 lg:pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Share2 className="w-5 h-5" />
            <span className="text-xs uppercase font-semibold tracking-wider">Contribution Graph</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">Network & Connection Graph</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Visualizing relationships forged through code commits, technical discussions, shared spaces, and collaborations.
          </p>
        </div>

        {/* Node Type Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['all', 'user', 'project', 'space', 'idea'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap cursor-pointer transition-colors ${
                filterType === f
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? 'All Entities' : `${f}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Visual Canvas */}
      <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden shadow-xs h-[520px] flex items-center justify-center">
        {/* Subtle Background Radial Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-25 dark:opacity-15" />

        <svg className="w-full h-full" viewBox="0 0 700 500">
          {/* Connection Lines */}
          {filteredLinks.map((link, i) => {
            const src = nodes.find(n => n.id === link.source);
            const tgt = nodes.find(n => n.id === link.target);
            if (!src || !tgt) return null;

            return (
              <g key={i}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={theme === 'dark' ? 'rgba(148,163,184,0.25)' : 'rgba(100,116,139,0.25)'}
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                />
              </g>
            );
          })}

          {/* Interactive Nodes */}
          {filteredNodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <g
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className="cursor-pointer group"
                transform={`translate(${node.x}, ${node.y})`}
              >
                {/* Glow ring */}
                <circle
                  r={node.r + (isSelected ? 8 : 4)}
                  fill={node.color}
                  fillOpacity={isSelected ? 0.35 : 0.15}
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* Node Core */}
                <circle
                  r={node.r}
                  fill={node.color}
                  stroke={isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.7)'}
                  strokeWidth={isSelected ? 3 : 1.5}
                />

                {/* Node Label Text */}
                <text
                  y={node.r + 14}
                  textAnchor="middle"
                  fill={theme === 'dark' ? '#f1f5f9' : '#0f172a'}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="system-ui"
                  className="pointer-events-none select-none drop-shadow-xs"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Floating Overlay */}
        {selectedNode && (
          <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:w-80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-lg animate-in slide-in-from-bottom-3 duration-150">
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-md"
                style={{ backgroundColor: `${selectedNode.color}15`, color: selectedNode.color }}
              >
                {selectedNode.type}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-2">{selectedNode.label}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedNode.subtitle}</p>

            <button
              onClick={() => handleOpenEntity(selectedNode)}
              className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1 cursor-pointer shadow-xs transition-colors"
            >
              <span>Explore Entity</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Graph Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#6366F1]" />
          <span>Members</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#06B6D4]" />
          <span>Projects</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#A855F7]" />
          <span>Spaces</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <span>Ideas</span>
        </div>
      </div>
    </div>
  );
};
