'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    subscribe_newsletter: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isSupabaseConfigured()) {
        const { error: dbError } = await supabase
          .from('messages')
          .insert([{
            name: formData.name,
            email: formData.email,
            subject: formData.subject || null,
            message: formData.message,
            subscribe_newsletter: formData.subscribe_newsletter,
            is_read: false,
          }]);

        if (dbError) throw dbError;

        // Add to leads if subscribed
        if (formData.subscribe_newsletter) {
          await supabase
            .from('leads')
            .upsert([{
              email: formData.email,
              name: formData.name,
              source: 'contact_form',
            }], { onConflict: 'email' });
        }
      } else {
        // Mock submission when Supabase not configured
        console.log('Form submitted (mock):', formData);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', subscribe_newsletter: false });
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-ima-success/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-ima-success" />
        </div>
        <h3 className="font-heading font-bold text-2xl text-white mb-2">Message Sent!</h3>
        <p className="text-ima-text-secondary mb-6">
          Thank you for reaching out. We&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-ima-primary hover:underline"
          data-testid="send-another-message"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none transition-colors duration-200"
            placeholder="Your name"
            data-testid="contact-name-input"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none transition-colors duration-200"
            placeholder="your@email.com"
            data-testid="contact-email-input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none transition-colors duration-200"
          placeholder="What's this about?"
          data-testid="contact-subject-input"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
          Message *
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none transition-colors duration-200 resize-none"
          placeholder="Tell us about your project..."
          data-testid="contact-message-input"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="subscribe"
          checked={formData.subscribe_newsletter}
          onChange={(e) => setFormData({ ...formData, subscribe_newsletter: e.target.checked })}
          className="w-5 h-5 rounded border-ima-border bg-ima-background text-ima-primary focus:ring-ima-primary"
          data-testid="contact-subscribe-checkbox"
        />
        <label htmlFor="subscribe" className="text-sm text-ima-text-secondary">
          Keep me updated with news and offers
        </label>
      </div>

      {error && (
        <p className="text-ima-error text-sm" data-testid="contact-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto px-8 py-3 bg-ima-primary text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-ima-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        data-testid="contact-submit-button"
      >
        {isSubmitting ? (
          <span className="spinner" />
        ) : (
          <>
            Send Message
            <Send size={18} />
          </>
        )}
      </button>
    </form>
  );
}
