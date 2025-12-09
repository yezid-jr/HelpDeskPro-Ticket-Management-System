'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import axios from 'axios';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export default function ClientPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'client') {
      router.push('/login');
    } else {
      fetchTickets();
    }
  }, [user, router]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`/api/tickets?userId=${user?.id}&role=client`);
      setTickets(response.data.tickets);
    } catch (error) {
      console.error('Error cargando tickets:', error);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('/api/tickets', {
        title,
        description,
        priority,
        createdBy: user?.id
      });

      setMessage('Ticket creado correctamente');
      setTitle('');
      setDescription('');
      setPriority('medium');
      setShowForm(false);
      fetchTickets();
    } catch (error) {
      setMessage('Error al crear ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (ticketId: string) => {
    router.push(`/ticket/${ticketId}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Panel de Cliente</h1>
            <p className="text-gray-600">Bienvenido, {user.name}</p>
          </div>
          <Button onClick={logout} variant="secondary">
            Cerrar Sesión
          </Button>
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        <div className="mb-6">
          <Button onClick={() => setShowForm(!showForm)} variant="primary">
            {showForm ? 'Cancelar' : 'Crear Nuevo Ticket'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Nuevo Ticket</h2>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridad
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Ticket'}
              </Button>
            </form>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Mis Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <Card
              key={ticket._id}
              title={ticket.title}
              status={ticket.status}
              priority={ticket.priority}
              createdAt={ticket.createdAt}
              onViewDetail={() => handleViewDetail(ticket._id)}
            />
          ))}
        </div>

        {tickets.length === 0 && (
          <p className="text-gray-500 text-center py-8">No tienes tickets aún</p>
        )}
      </div>
    </div>
  );
}