'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import axios from 'axios';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  createdBy: {
    _id: string;
    name: string;
  };
}

interface Comment {
  _id: string;
  message: string;
  author: {
    name: string;
    role: string;
  };
  createdAt: string;
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchTicket();
      fetchComments();
    }
  }, [user, params.id]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`/api/tickets?ticketId=${params.id}`);
      setTicket(response.data.tickets[0]);
      setNewStatus(response.data.tickets[0].status);
    } catch (error) {
      console.error('Error cargando ticket:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments?ticketId=${params.id}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error cargando comentarios:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('/api/comments', {
        ticketId: params.id,
        author: user?.id,
        message: newComment
      });

      setMessage('Comentario agregado');
      setNewComment('');
      fetchComments();
    } catch (error) {
      setMessage('Error al agregar comentario');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    setLoading(true);
    setMessage('');

    try {
      await axios.patch('/api/tickets', {
        ticketId: params.id,
        status: newStatus
      });

      setMessage('Estado actualizado');
      fetchTicket();
    } catch (error) {
      setMessage('Error al actualizar estado');
    } finally {
      setLoading(false);
    }
  };

  if (!ticket || !user) return <div className="p-8">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Button onClick={() => router.back()} variant="secondary">
          ← Volver
        </Button>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded my-4">
            {message}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mt-4">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{ticket.title}</h1>
            <div className="flex gap-2">
              <Badge variant={ticket.status}>{ticket.status}</Badge>
              <Badge variant={ticket.priority}>{ticket.priority}</Badge>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{ticket.description}</p>

          <div className="text-sm text-gray-500 mb-4">
            <p>Creado por: {ticket.createdBy.name}</p>
            <p>Fecha: {new Date(ticket.createdAt).toLocaleString()}</p>
          </div>

          {user.role === 'agent' && (
            <div className="border-t pt-4 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cambiar Estado
              </label>
              <div className="flex gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="open">Abierto</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="resolved">Resuelto</option>
                  <option value="closed">Cerrado</option>
                </select>
                <Button onClick={handleUpdateStatus} disabled={loading}>
                  Actualizar
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4">Comentarios</h2>

          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment._id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-gray-800">
                    {comment.author.name} ({comment.author.role})
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-600">{comment.message}</p>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <p className="text-gray-500 mb-6">No hay comentarios aún</p>
          )}

          <form onSubmit={handleAddComment}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agregar Comentario
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
              rows={3}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Comentario'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}