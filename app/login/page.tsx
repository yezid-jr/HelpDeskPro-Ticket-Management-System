// login/page
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { user } = response.data;

      login(user);

      if (user.role === 'client') {
        router.push('/client');
      } else {
        router.push('/agent');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* bg */}
      <div className="absolute inset-0 -z-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#facc15" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Figures */}
          <circle cx="20%" cy="30%" r="200" fill="url(#grad1)" />
          <circle cx="70%" cy="70%" r="300" fill="url(#grad2)" />
          <circle cx="80%" cy="30%" r="100" fill="url(#grad3)" />
        </svg>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-center 
               bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent
               tracking-tight drop-shadow-sm">
          HelpDeskPro
        </h1>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 pr-12 rounded-xl border border-gray-200 shadow-sm 
               focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-12 rounded-xl border border-gray-200 shadow-sm 
               focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              required
            />
          </div>

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

      </div>
    </div>
  );
}
