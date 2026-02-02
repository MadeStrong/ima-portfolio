'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import type { Message } from '@/lib/types';
import { Mail, MailOpen, Trash2, X, Calendar, User } from 'lucide-react';

// Mock messages data
const mockMessages: Message[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Project Inquiry',
    message: 'Hi, I am interested in your graphic design services for my startup. We need a complete brand identity package including logo, business cards, and social media templates. Could you share your rates?',
    subscribe_newsletter: true,
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Collaboration Request',
    message: 'Hello! I run a creative agency and we are looking for video editors for ongoing projects. Would you be interested in discussing a partnership?',
    subscribe_newsletter: false,
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    subject: 'Quote Request',
    message: 'I need help with social media management for my e-commerce store. Can you provide a quote for monthly management services?',
    subscribe_newsletter: true,
    is_read: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredMessages = filter === 'unread' 
    ? messages.filter(m => !m.is_read) 
    : messages;

  const unreadCount = messages.filter(m => !m.is_read).length;

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, is_read: true } : m
      ));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout title="Messages">
      {/* Filter Tabs */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-ima-primary text-white' 
              : 'bg-ima-surface text-ima-text-secondary hover:text-white'
          }`}
          data-testid="filter-all-messages"
        >
          All Messages ({messages.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'unread' 
              ? 'bg-ima-primary text-white' 
              : 'bg-ima-surface text-ima-text-secondary hover:text-white'
          }`}
          data-testid="filter-unread-messages"
        >
          Unread ({unreadCount})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-ima-surface rounded-xl overflow-hidden">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-ima-text-secondary">No messages to display</p>
            </div>
          ) : (
            <div className="divide-y divide-ima-border max-h-[600px] overflow-y-auto">
              {filteredMessages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => handleSelectMessage(message)}
                  className={`w-full text-left p-4 hover:bg-ima-surface-hover transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-ima-surface-hover' : ''
                  }`}
                  data-testid={`message-item-${message.id}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-2 h-2 rounded-full ${message.is_read ? 'bg-transparent' : 'bg-ima-primary'}`} />
                    <span className="font-medium text-white text-sm truncate flex-1">
                      {message.name}
                    </span>
                    <span className="text-xs text-ima-text-secondary">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-ima-text-secondary truncate pl-5">
                    {message.subject || 'No subject'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-ima-surface rounded-xl">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-ima-border flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-bold text-lg text-white mb-1">
                    {selectedMessage.subject || 'No subject'}
                  </h2>
                  <p className="text-sm text-ima-text-secondary">
                    From: {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 text-ima-text-secondary hover:text-ima-error transition-colors"
                    data-testid="delete-selected-message"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 text-ima-text-secondary hover:text-white transition-colors lg:hidden"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center gap-4 text-sm text-ima-text-secondary mb-6">
                  <span className="flex items-center gap-2">
                    <Calendar size={14} />
                    {formatDate(selectedMessage.created_at)}
                  </span>
                  <span className="flex items-center gap-2">
                    <User size={14} />
                    {selectedMessage.email}
                  </span>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {selectedMessage.subscribe_newsletter && (
                  <div className="mt-6 p-3 bg-ima-background rounded-lg">
                    <p className="text-sm text-ima-text-secondary">
                      ✓ Subscribed to newsletter
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-ima-border">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-ima-primary text-white rounded-lg font-medium hover:bg-ima-primary-hover transition-colors"
                  data-testid="reply-to-message"
                >
                  <Mail size={18} />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <MailOpen size={48} className="text-ima-border mx-auto mb-4" />
                <p className="text-ima-text-secondary">Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
