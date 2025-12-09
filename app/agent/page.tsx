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
  createdBy: {
    name: string;
  };
}

export default function AgentPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'agent') {
      router.push('/login');
    } else {
      fetchTickets();
    }
  }, [user, router, statusFilter]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`/api/tickets?role=agent&status=${statusFilter}`);
      setTickets(response.data.tickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
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
            <h1 className="text-3xl font-bold text-gray-800">Agent Dashboard</h1>
            <p className="text-gray-600">Welcome, {user.name}</p>
          </div>
          <Button onClick={logout} variant="secondary">
            Log Out
          </Button>
        </div>

        <div className="mb-6 flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          All Tickets ({tickets.length})
        </h2>
        
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
          <p className="text-gray-500 text-center py-8">
            There are no tickets with the selected filter
          </p>
        )}
      </div>
    </div>
  );
}
