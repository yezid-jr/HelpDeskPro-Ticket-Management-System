import React from 'react';
import Badge from './Badge';
import Button from './Button';

interface CardProps {
  title: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  onViewDetail: () => void;
}

export default function Card({ title, status, priority, createdAt, onViewDetail }: CardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      
      <div className="flex gap-2 mb-3">
        <Badge variant={status}>{status}</Badge>
        <Badge variant={priority}>{priority}</Badge>
      </div>
      
      <p className="text-sm text-gray-500 mb-3">
        Creado: {new Date(createdAt).toLocaleDateString()}
      </p>
      
      <Button onClick={onViewDetail} variant="primary">
        Ver Detalle
      </Button>
    </div>
  );
}