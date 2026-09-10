import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Mic,
  MicOff,
  Send,
  Code2,
  Paperclip,
  Radio,
  Volume2,
  Users2,
  Sparkles,
  PhoneCall,
  PhoneOff,
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const {
    users,
    currentUser,
    channelMessages,
    sendChannelMessage,
    theme,
  } = useApp();

  const [activeChatUserId, setActiveChatUserId] = useState<string>(users[1].id);
  const [msgInput, setMsgInput] = useState('');
  const [inVoiceRoom, setInVoiceRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Filter contacts (all users except current user, uniquely identified)
  const contacts = users
    .filter(u => u.id !== currentUser.id)
    .filter((u, idx, arr) => arr.findIndex(x => x.id === u.id) === idx);
  const activeChatPartner = users.find(u => u.id === activeChatUserId) || contacts[0] || currentUser;

  // Direct messages channel key
  const dmKey = `dm-${[currentUser.id, activeChatPartner.id].sort().join('-')}`;
  const conversationMessages = channelMessages[dmKey] || [
    {
      id: 'dm-seed-1',
      author: activeChatPartner,
      content: `Hey ${currentUser.name.split(' ')[0]}! Loved your proposal on the neural interface architecture. Let's sync up on the Rust SIMD kernels.`,
      createdAt: '10m ago',
    },
  ];

  const handleSendDm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    sendChannelMessage(dmKey, msgInput.trim());
    setMsgInput('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-20 lg:pb-10">
      {/* Voice Room Live Collaboration Banner */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          inVoiceRoom
            ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800 shadow-xs'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${inVoiceRoom ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
              <Radio className={`w-5 h-5 ${inVoiceRoom ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                  {inVoiceRoom ? 'Active Audio Stage: Distributed Systems Research' : 'Open Voice Room Available'}
                </h3>
                {inVoiceRoom && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {inVoiceRoom
                  ? '3 builders connected. Real-time audio active.'
                  : 'Hop into spontaneous real-time collaboration rooms without leaving the workspace.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {inVoiceRoom && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                  isMuted
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isMuted ? 'Muted' : 'Unmuted'}</span>
              </button>
            )}

            <button
              onClick={() => setInVoiceRoom(!inVoiceRoom)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs ${
                inVoiceRoom
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {inVoiceRoom ? (
                <>
                  <PhoneOff className="w-3.5 h-3.5" />
                  <span>Leave Room</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Join Stage</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Audio Wave visualizer when connected */}
        {inVoiceRoom && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <img src={currentUser.avatar} alt="You" className="w-7 h-7 rounded-full ring-2 ring-indigo-500 object-cover" />
                <img src={users[1].avatar} alt="Colleague" className="w-7 h-7 rounded-full ring-2 ring-slate-300 dark:ring-slate-700 object-cover" />
                <img src={users[2].avatar} alt="Colleague" className="w-7 h-7 rounded-full ring-2 ring-slate-300 dark:ring-slate-700 object-cover" />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Speaking: {currentUser.name}</span>
            </div>

            {/* Audio Wave Simulation */}
            <div className="flex items-center gap-1 h-5">
              {[40, 70, 30, 90, 60, 80, 50, 95, 45, 60].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Messages Layout */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden flex flex-col sm:flex-row h-[600px]">
        {/* Left Contacts Rail */}
        <div className="w-full sm:w-72 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-3 overflow-y-auto">
          <span className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 px-2 mb-2 block">
            Direct Conversations
          </span>

          <div className="space-y-1">
            {contacts.map((contact, contactIdx) => {
              const isSelected = activeChatUserId === contact.id;
              return (
                <button
                  key={`${contact.id}-${contactIdx}`}
                  onClick={() => setActiveChatUserId(contact.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-medium shadow-xs'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={contact.avatar} alt={contact.name} className="w-9 h-9 rounded-xl object-cover" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>{contact.name}</p>
                    <p className={`text-[11px] truncate ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                      {contact.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Chat Conversation View */}
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-5">
          {/* Active Partner Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <img src={activeChatPartner.avatar} alt={activeChatPartner.name} className="w-9 h-9 rounded-xl object-cover" />
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 tracking-tight">{activeChatPartner.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">Score: {activeChatPartner.identityScore}</span>
                  <span>• {activeChatPartner.tagline}</span>
                </div>
              </div>
            </div>

            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              Encrypted
            </span>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {(conversationMessages || []).map(msg => {
              const isMine = msg.author.id === currentUser.id;
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                  {!isMine && (
                    <img src={msg.author.avatar} alt={msg.author.name} className="w-7 h-7 rounded-lg object-cover shrink-0 mt-0.5" />
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-xl text-xs space-y-1 ${
                      isMine
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.content}</p>
                    <span className={`text-[10px] block text-right ${isMine ? 'text-white/70' : 'text-slate-400'}`}>
                      {msg.createdAt}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendDm} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              placeholder={`Message ${activeChatPartner.name.split(' ')[0]}...`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
