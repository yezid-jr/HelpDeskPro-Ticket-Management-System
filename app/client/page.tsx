'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/Card';
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
      console.error('Error loading tickets:', error);
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

      setMessage('Ticket created successfully');
      setTitle('');
      setDescription('');
      setPriority('medium');
      setShowForm(false);
      fetchTickets();
    } catch (error) {
      setMessage('Error creating ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (ticketId: string) => {
    router.push(`/ticket/${ticketId}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/40">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-2">
              Client Dashboard
            </h1>

            <p className="text-gray-600 text-lg">Welcome back, <span className="font-semibold text-blue-600">{user.name}</span></p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-blue-700 font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Log Out
          </button>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 text-green-800 px-6 py-4 rounded-2xl mb-6 shadow-md animate-fade-in">
            <span className="font-medium">✓ {message}</span>
          </div>
        )}

        {/* Create Ticket Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-500 via-cyan-600 to-blue-700 hover:from-blue-600 hover:via-cyan-800 hover:to-blue-800 text-white font-semibold rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            {showForm ? '✕ Cancel' : 'Create New Ticket'}
          </button>
        </div>

        {/* Create Ticket Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl mb-8 border border-white/40 animate-slide-down">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                +
              </span>
              New Ticket
            </h2>
            <form onSubmit={handleCreateTicket} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-purple-50/50 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-purple-50/50 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 resize-none"
                  rows={5}
                  placeholder="Please provide detailed information about your issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-4 py-3 bg-purple-50/50 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Ticket'}
              </button>
            </form>
          </div>
        )}

        {/* Tickets Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            My Tickets
            <span className="ml-3 text-lg font-normal text-gray-500">({tickets.length})</span>
          </h2>

          {tickets.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">You have no tickets yet</p>
              <p className="text-gray-400 text-sm mt-2">Create your first ticket to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}