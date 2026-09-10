import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bookmark,
  Plus,
  Layers,
  Sparkles,
  ExternalLink,
  Eye,
  Share2,
} from 'lucide-react';

export const CollectionsView: React.FC = () => {
  const {
    collections,
    posts,
    theme,
    setExpandedPostId,
  } = useApp();

  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(collections[0]?.id || '');

  const activeCollection = collections.find(c => c.id === selectedCollectionId) || collections[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 lg:pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Bookmark className="w-5 h-5" />
            <span className="text-xs uppercase font-semibold tracking-wider">Visual Collections</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">Collections & Moodboards</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Curate visual research, architectural schematics, design patterns, and interface studies.
          </p>
        </div>
      </div>

      {/* Collections Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
        {collections.map(c => {
          const isSelected = c.id === activeCollection?.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCollectionId(c.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{c.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {c.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Collection Showcase */}
      {activeCollection && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">{activeCollection.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {activeCollection.description}
              </p>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Curated by <span className="text-slate-900 dark:text-slate-100 font-semibold">{activeCollection.curator.name}</span>
            </div>
          </div>

          {/* Visual Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(activeCollection.items || []).map(item => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-xs"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                  <div className="flex justify-end">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                      Visual Note
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    {item.notes && <p className="text-xs text-slate-200 mt-0.5 line-clamp-2">{item.notes}</p>}
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-indigo-300 hover:underline flex items-center gap-1 mt-2 font-medium"
                      >
                        Inspect Resource <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
