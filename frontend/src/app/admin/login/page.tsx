'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockSettings } from '@/lib/mock-data';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local');
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setError('');
        alert('Account created! Please check your email to confirm, then log in.');
        setIsSignUp(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push('/admin');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const settings = mockSettings;

  return (
    <div className="min-h-screen bg-ima-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-12">
          {settings.logo_url && (
            <img src={settings.logo_url} alt={settings.site_name} className="h-12 w-auto" />
          )}
          <span className="font-heading font-bold text-2xl text-white">{settings.site_name}</span>
        </Link>

        {/* Form Card */}
        <div className="bg-ima-surface rounded-2xl p-8">
          <h1 className="font-heading font-bold text-2xl text-white text-center mb-2">
            {isSignUp ? 'Create Admin Account' : 'Admin Login'}
          </h1>
          <p className="text-ima-text-secondary text-center mb-8">
            {isSignUp ? 'Set up your admin account' : 'Sign in to manage your site'}
          </p>

          {!isSupabaseConfigured() && (
            <div className="mb-6 p-4 bg-ima-error/10 border border-ima-error/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-ima-error flex-shrink-0 mt-0.5" />
              <div className="text-sm text-ima-error">
                <strong>Supabase not configured.</strong>
                <br />
                Add your Supabase credentials to <code className="bg-ima-background px-1 rounded">.env.local</code> to enable authentication.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="admin-login-form">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none transition-colors duration-200"
                placeholder="admin@example.com"
                data-testid="admin-email-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-12 px-4 pr-12 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none transition-colors duration-200"
                  placeholder="••••••••"
                  data-testid="admin-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ima-text-secondary hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-ima-error text-sm" data-testid="admin-login-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !isSupabaseConfigured()}
              className="w-full h-12 bg-ima-primary text-white rounded-lg font-medium hover:bg-ima-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              data-testid="admin-login-submit"
            >
              {isLoading ? <span className="spinner" /> : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-ima-text-secondary text-sm hover:text-white transition-colors"
              data-testid="admin-toggle-signup"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <p className="text-center text-ima-text-secondary text-sm mt-6">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
