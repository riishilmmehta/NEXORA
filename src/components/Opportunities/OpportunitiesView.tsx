import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Opportunity } from '../../types';
import {
  Briefcase,
  DollarSign,
  MapPin,
  Clock,
  Sparkles,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Send,
  X,
} from 'lucide-react';

export const OpportunitiesView: React.FC = () => {
  const {
    opportunities,
    theme,
    currentUser,
    setSelectedUserProfileId,
    setActiveView,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [proposalText, setProposalText] = useState('');
  const [submittedOpps, setSubmittedOpps] = useState<string[]>([]);

  const filteredOpportunities = opportunities.filter(opp => {
    if (filterType === 'all') return true;
    return opp.type === filterType;
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpp) return;
    setSubmittedOpps([...submittedOpps, selectedOpp.id]);
    setProposalText('');
    setSelectedOpp(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 lg:pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Briefcase className="w-5 h-5" />
            <span className="text-xs uppercase font-semibold tracking-wider">Marketplace & Collaborations</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">Opportunities & Roles</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Discover peer-vetted grants, engineering bounties, research fellowships, and core collaborator roles.
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {['all', 'bounty', 'project_collab', 'fellowship', 'fulltime'].map(ft => (
          <button
            key={ft}
            onClick={() => setFilterType(ft)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap cursor-pointer transition-colors ${
              filterType === ft
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {ft.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.map(opp => {
          const hasApplied = submittedOpps.includes(opp.id);
          return (
            <div
              key={opp.id}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs transition-colors"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {opp.type.replace('_', ' ')}
                  </span>
                  {opp.compensation && (
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {opp.compensation}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400">• {opp.location}</span>
                </div>

                <h3 className="font-semibold text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-100">{opp.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {opp.description}
                </p>

                {/* Skills needed */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(opp.requiredSkills || (opp as any).skillsNeeded || []).map((sk: string) => (
                    <span
                      key={sk}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Creator info */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <img src={opp.creator.avatar} alt={opp.creator.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-slate-500 dark:text-slate-400">Posted by <span className="font-medium text-slate-900 dark:text-slate-100">{opp.creator.name}</span></span>
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0 self-start sm:self-auto">
                <button
                  disabled={hasApplied}
                  onClick={() => setSelectedOpp(opp)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs ${
                    hasApplied
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {hasApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Proposal Sent</span>
                    </>
                  ) : (
                    <>
                      <span>Apply / Submit Proposal</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply Proposal Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Submit Proposal for {selectedOpp.title}</h3>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{selectedOpp.compensation}</span>
              </div>
              <button onClick={() => setSelectedOpp(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  How would you approach this? (Portfolio links, experience, or timeline)
                </label>
                <textarea
                  rows={4}
                  value={proposalText}
                  onChange={e => setProposalText(e.target.value)}
                  placeholder="I have experience with this architecture and can build this component..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOpp(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
