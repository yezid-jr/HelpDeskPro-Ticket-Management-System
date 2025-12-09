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
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
              Contraseña
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
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <p>Usuarios de prueba:</p>
          <p>Cliente: client@test.com / password123</p>
          <p>Agente: agent@test.com / password123</p>
        </div>
      </div>
    </div>
  );
}