import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Image, DollarSign, ArrowLeft, MoreVertical, Phone, CheckCheck } from 'lucide-react';
import { users } from '../data/users';
import { listings } from '../data/listings';

const conversations = [
  {
    id: 'c1',
    userId: 'u3',
    listingId: 'l2',
    lastMessage: 'Is the iPhone still available?',
    lastTime: '2026-03-27T15:30:00Z',
    unread: 2,
    messages: [
      { id: 'm1', senderId: 'u1', text: 'Hi! Is the iPhone 15 Pro Max still available?', time: '2026-03-27T14:00:00Z' },
      { id: 'm2', senderId: 'u3', text: 'Yes it is! Are you interested?', time: '2026-03-27T14:15:00Z' },
      { id: 'm3', senderId: 'u1', text: 'Definitely. Would you take $850?', time: '2026-03-27T14:30:00Z' },
      { id: 'm4', senderId: 'u3', text: 'I can do $875 since it comes with the original case and box.', time: '2026-03-27T15:00:00Z' },
      { id: 'm5', senderId: 'u1', text: 'Deal! When can we meet?', time: '2026-03-27T15:15:00Z' },
      { id: 'm6', senderId: 'u3', text: 'How about tomorrow at Bellevue Square? I can meet at the food court around noon.', time: '2026-03-27T15:30:00Z' },
    ],
  },
  {
    id: 'c2',
    userId: 'u14',
    listingId: 'l13',
    lastMessage: 'Can I come see it this weekend?',
    lastTime: '2026-03-27T12:00:00Z',
    unread: 0,
    messages: [
      { id: 'm7', senderId: 'u1', text: 'Hi Tom, interested in the F-150. Is the price firm?', time: '2026-03-26T10:00:00Z' },
      { id: 'm8', senderId: 'u14', text: 'Hey! I have a little room to negotiate. What were you thinking?', time: '2026-03-26T10:30:00Z' },
      { id: 'm9', senderId: 'u1', text: 'Would $29,500 work? I can pay cash.', time: '2026-03-26T11:00:00Z' },
      { id: 'm10', senderId: 'u14', text: 'Cash is great. I could do $30,500 - just had the tires replaced.', time: '2026-03-26T12:00:00Z' },
      { id: 'm11', senderId: 'u1', text: 'Can I come see it this weekend?', time: '2026-03-27T12:00:00Z' },
    ],
  },
  {
    id: 'c3',
    userId: 'u7',
    listingId: 'l6',
    lastMessage: 'Sounds good, see you then!',
    lastTime: '2026-03-26T18:00:00Z',
    unread: 0,
    messages: [
      { id: 'm12', senderId: 'u1', text: 'Hi Emily! Is the MacBook Pro still available?', time: '2026-03-26T16:00:00Z' },
      { id: 'm13', senderId: 'u7', text: 'Hi! Yes, it is. Would you like to see it?', time: '2026-03-26T16:15:00Z' },
      { id: 'm14', senderId: 'u1', text: 'Yes please. I can come to Kirkland tomorrow.', time: '2026-03-26T17:00:00Z' },
      { id: 'm15', senderId: 'u7', text: 'Perfect! Let\'s meet at the Kirkland library at 2pm?', time: '2026-03-26T17:30:00Z' },
      { id: 'm16', senderId: 'u1', text: 'Sounds good, see you then!', time: '2026-03-26T18:00:00Z' },
    ],
  },
  {
    id: 'c4',
    userId: 'u15',
    listingId: 'l14',
    lastMessage: 'We can come this Thursday at 10am',
    lastTime: '2026-03-25T09:00:00Z',
    unread: 1,
    messages: [
      { id: 'm17', senderId: 'u1', text: 'Hi, I\'d like to book a deep cleaning for my 2BR apartment.', time: '2026-03-24T14:00:00Z' },
      { id: 'm18', senderId: 'u15', text: 'We\'d love to help! What\'s the approximate square footage?', time: '2026-03-24T14:30:00Z' },
      { id: 'm19', senderId: 'u1', text: 'About 900 sqft. It\'s in Capitol Hill.', time: '2026-03-24T15:00:00Z' },
      { id: 'm20', senderId: 'u15', text: 'For a 2BR deep clean at that size, it would be $250. Takes about 3-4 hours.', time: '2026-03-24T15:30:00Z' },
      { id: 'm21', senderId: 'u1', text: 'That works. When\'s the earliest you can come?', time: '2026-03-25T08:00:00Z' },
      { id: 'm22', senderId: 'u15', text: 'We can come this Thursday at 10am. Does that work?', time: '2026-03-25T09:00:00Z' },
    ],
  },
  {
    id: 'c5',
    userId: 'u4',
    listingId: 'l3',
    lastMessage: 'I\'ll think about it, thanks!',
    lastTime: '2026-03-23T16:00:00Z',
    unread: 0,
    messages: [
      { id: 'm23', senderId: 'u1', text: 'Love the mid-century sofa. Would you take $400?', time: '2026-03-23T14:00:00Z' },
      { id: 'm24', senderId: 'u4', text: 'I could do $425. It\'s in really nice shape.', time: '2026-03-23T15:00:00Z' },
      { id: 'm25', senderId: 'u1', text: 'I\'ll think about it, thanks!', time: '2026-03-23T16:00:00Z' },
    ],
  },
];

function formatMessageTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return d.toLocaleDateString([], { weekday: 'short' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function MessagesPage() {
  const [activeConvoId, setActiveConvoId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [localConvos, setLocalConvos] = useState(conversations);

  const activeConvo = localConvos.find((c) => c.id === activeConvoId);
  const activeUser = activeConvo ? users.find((u) => u.id === activeConvo.userId) : null;
  const activeListing = activeConvo ? listings.find((l) => l.id === activeConvo.listingId) : null;

  const handleSend = () => {
    if (!messageInput.trim() || !activeConvoId) return;
    setLocalConvos((prev) =>
      prev.map((c) =>
        c.id === activeConvoId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: `m-new-${Date.now()}`, senderId: 'u1', text: messageInput, time: new Date().toISOString() },
              ],
              lastMessage: messageInput,
              lastTime: new Date().toISOString(),
            }
          : c
      )
    );
    setMessageInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-0 md:px-6 py-0 md:py-6">
      <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-180px)] bg-white dark:bg-surface-900 md:rounded-2xl md:border border-surface-200 dark:border-surface-700 overflow-hidden">
        {/* Conversation List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-surface-200 dark:border-surface-700 flex flex-col
            ${activeConvoId ? 'hidden md:flex' : 'flex'}`}
        >
          <div className="p-4 border-b border-surface-200 dark:border-surface-700">
            <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">Messages</h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            {localConvos.map((convo) => {
              const user = users.find((u) => u.id === convo.userId);
              const listing = listings.find((l) => l.id === convo.listingId);
              const isActive = convo.id === activeConvoId;
              return (
                <button
                  key={convo.id}
                  onClick={() => setActiveConvoId(convo.id)}
                  className={`w-full flex items-start gap-3 p-4 text-left transition-colors
                    ${isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-primary-500'
                      : 'hover:bg-surface-50 dark:hover:bg-surface-800 border-l-2 border-transparent'
                    }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={user?.avatar || `https://i.pravatar.cc/40?u=${convo.userId}`}
                      alt={user?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {convo.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {convo.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold text-sm truncate ${convo.unread ? 'text-surface-900 dark:text-white' : 'text-surface-700 dark:text-surface-300'}`}>
                        {user?.name || 'Unknown'}
                      </span>
                      <span className="text-xs text-surface-400 flex-shrink-0 ml-2">
                        {formatMessageTime(convo.lastTime)}
                      </span>
                    </div>
                    {listing && (
                      <p className="text-xs text-primary-500 truncate">{listing.title}</p>
                    )}
                    <p className={`text-sm truncate mt-0.5 ${convo.unread ? 'text-surface-900 dark:text-surface-100 font-medium' : 'text-surface-500'}`}>
                      {convo.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Panel */}
        <div
          className={`flex-1 flex flex-col ${activeConvoId ? 'flex' : 'hidden md:flex'}`}
        >
          {activeConvo ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b border-surface-200 dark:border-surface-700">
                <button
                  onClick={() => setActiveConvoId(null)}
                  className="md:hidden p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={activeUser?.avatar || `https://i.pravatar.cc/40?u=${activeConvo.userId}`}
                  alt={activeUser?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">
                    {activeUser?.name}
                  </h3>
                  {activeListing && (
                    <Link
                      to={`/listing/${activeListing.id}`}
                      className="text-xs text-primary-500 hover:text-primary-600 truncate block"
                    >
                      Re: {activeListing.title}
                    </Link>
                  )}
                </div>
                <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg">
                  <Phone className="w-4 h-4 text-surface-500" />
                </button>
                <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg">
                  <MoreVertical className="w-4 h-4 text-surface-500" />
                </button>
              </div>

              {/* Listing Preview */}
              {activeListing && (
                <Link
                  to={`/listing/${activeListing.id}`}
                  className="flex items-center gap-3 px-4 py-2 bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <img
                    src={activeListing.images?.[0]}
                    alt={activeListing.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-surface-900 dark:text-surface-100 truncate">{activeListing.title}</p>
                    <p className="text-xs font-bold text-primary-600 dark:text-primary-400">${activeListing.price?.toLocaleString()}</p>
                  </div>
                </Link>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConvo.messages.map((msg) => {
                  const isOwn = msg.senderId === 'u1';
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                          isOwn
                            ? 'bg-primary-600 text-white rounded-br-md'
                            : 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                          <span className={`text-[10px] ${isOwn ? 'text-white/60' : 'text-surface-400'}`}>
                            {new Date(msg.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </span>
                          {isOwn && <CheckCheck className="w-3 h-3 text-white/60" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Bar */}
              <div className="p-3 border-t border-surface-200 dark:border-surface-700">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors">
                    <Image className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-surface-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                    <DollarSign className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 input-field py-2.5 text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-surface-400" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Your Messages</h3>
                <p className="text-sm text-surface-500 mt-1 max-w-xs">
                  Select a conversation to start chatting, or message a seller from any listing.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
