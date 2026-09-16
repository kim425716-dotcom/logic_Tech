import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCircle, FaPaperPlane } from 'react-icons/fa';
import { mockConversations } from '../data/mockData';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { formatRelativeTime } from '../lib/utils';
import type { UserRole, Message } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';

interface MessagingPageProps {
  role: UserRole;
}

interface WsChatPayload {
  type?: string;
  id?: string;
  sender_id?: string;
  sender_name?: string;
  sender_avatar?: string | null;
  recipient_id?: string;
  content?: string;
  timestamp?: string;
  read?: boolean;
  user_id?: string;
  online?: boolean;
  is_typing?: boolean;
}

export default function MessagingPage({ role: _role }: MessagingPageProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(mockConversations);
  const [activeId, setActiveId] = useState(mockConversations[0]?.id ?? '');
  const [draft, setDraft] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<number | undefined>(undefined);

  const active = conversations.find(c => c.id === activeId) ?? conversations[0];

  const otherParticipant = active
    ? active.participantOneId === user?.id
      ? { id: active.participantTwoId, name: active.participantTwoName, avatar: active.participantTwoAvatar }
      : { id: active.participantOneId, name: active.participantOneName, avatar: active.participantOneAvatar }
    : null;

  const handleWsMessage = (raw: unknown) => {
    const payload = raw as WsChatPayload;

    if (payload.type === 'presence' && payload.user_id) {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        if (payload.online) next.add(payload.user_id!);
        else next.delete(payload.user_id!);
        return next;
      });
      return;
    }

    if (payload.type === 'typing' && payload.user_id) {
      setTypingUsers(prev => {
        const next = new Set(prev);
        if (payload.is_typing) next.add(payload.user_id!);
        else next.delete(payload.user_id!);
        return next;
      });
      return;
    }

    if (payload.type !== 'message' || !payload.id || !payload.sender_id || !payload.content) {
      return;
    }

    const msg: Message = {
      id: payload.id,
      conversationId: active?.id ?? 'live',
      senderId: payload.sender_id,
      senderName: payload.sender_name ?? 'Unknown',
      senderAvatar: payload.sender_avatar ?? undefined,
      content: payload.content,
      timestamp: payload.timestamp ?? new Date().toISOString(),
      read: payload.read ?? false,
    };

    const otherId = payload.sender_id === user?.id ? payload.recipient_id : payload.sender_id;
    if (!otherId) return;

    setConversations(prev =>
      prev.map(conv => {
        const matchesConversation =
          (conv.participantOneId === user?.id && conv.participantTwoId === otherId) ||
          (conv.participantTwoId === user?.id && conv.participantOneId === otherId);

        if (!matchesConversation) return conv;

        const alreadyExists = conv.messages.some(existing => existing.id === msg.id);
        if (alreadyExists) return conv;

        return {
          ...conv,
          messages: [...conv.messages, { ...msg, conversationId: conv.id }],
          lastMessage: msg.content,
          lastMessageTime: msg.timestamp,
          unreadCount: msg.senderId !== user?.id ? conv.unreadCount + 1 : conv.unreadCount,
        };
      }),
    );
  };

  const { sendMessage, isConnected } = useWebSocket(
    user ? `/ws/chat/${user.id}` : null,
    { onMessage: handleWsMessage },
  );

  const isOtherOnline = otherParticipant ? onlineUsers.has(otherParticipant.id) : false;
  const isOtherTyping = otherParticipant ? typingUsers.has(otherParticipant.id) : false;

  const sendChatMessage = () => {
    if (!draft.trim() || !active || !user || !otherParticipant) return;

    sendMessage({
      type: 'message',
      recipient_id: otherParticipant.id,
      content: draft.trim(),
    });

    setDraft('');
    sendMessage({ type: 'typing', recipient_id: otherParticipant.id, is_typing: false });
  };

  const handleDraftChange = (value: string) => {
    setDraft(value);
    if (!otherParticipant) return;

    sendMessage({ type: 'typing', recipient_id: otherParticipant.id, is_typing: true });
    window.clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      sendMessage({ type: 'typing', recipient_id: otherParticipant.id, is_typing: false });
    }, 1500);
  };

  useEffect(() => {
    return () => window.clearTimeout(typingTimeoutRef.current);
  }, []);

  const connectionLabel = useMemo(() => {
    if (!user) return 'Offline';
    if (isConnected) return 'Live';
    return 'Reconnecting…';
  }, [user, isConnected]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <span className={`text-xs px-2.5 py-1 rounded-full border ${
          isConnected
            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
            : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
        }`}>
          {connectionLabel}
        </span>
      </div>

      <div className="flex h-[calc(100vh-12rem)] rounded-2xl border border-white/10 overflow-hidden bg-slate-900/50">
        <div className="w-72 flex-shrink-0 border-r border-white/10 overflow-y-auto hidden md:block">
          {conversations.map(conv => {
            const other = conv.participantOneId === user?.id
              ? { id: conv.participantTwoId, name: conv.participantTwoName, avatar: conv.participantTwoAvatar }
              : { id: conv.participantOneId, name: conv.participantOneName, avatar: conv.participantOneAvatar };
            return (
              <button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                  activeId === conv.id ? 'bg-violet-500/10' : 'hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <Avatar src={other.avatar} name={other.name} size="sm" />
                  {onlineUsers.has(other.id) && (
                    <FaCircle className="absolute -bottom-0.5 -right-0.5 text-emerald-400 text-[8px]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{other.name}</p>
                  <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 bg-violet-500 rounded-full text-xs text-white flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 flex flex-col">
          {active && otherParticipant ? (
            <>
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <div className="relative">
                  <Avatar src={otherParticipant.avatar} name={otherParticipant.name} size="sm" />
                  {isOtherOnline && (
                    <FaCircle className="absolute -bottom-0.5 -right-0.5 text-emerald-400 text-[8px]" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-white">{otherParticipant.name}</p>
                  <p className="text-xs text-slate-500">
                    {isOtherTyping ? 'Typing…' : isOtherOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {active.messages.map(msg => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        isMine ? 'bg-violet-600 text-white' : 'bg-white/10 text-slate-200'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMine ? 'text-violet-200' : 'text-slate-500'}`}>
                          {formatRelativeTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-white/10 flex gap-2">
                <input
                  value={draft}
                  onChange={e => handleDraftChange(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-violet-500/50"
                />
                <Button onClick={sendChatMessage} leftIcon={<FaPaperPlane size={12} />}>Send</Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">Select a conversation</div>
          )}
        </div>
      </div>
    </div>
  );
}
