import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import { sendTicketResponseEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json(
        { error: 'ID de ticket requerido' },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ ticketId })
      .populate('author', 'name role')
      .sort({ createdAt: 1 });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error obteniendo comentarios:', error);
    return NextResponse.json(
      { error: 'Error obteniendo comentarios' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { ticketId, author, message } = await req.json();

    if (!ticketId || !author || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const comment = await Comment.create({
      ticketId,
      author,
      message
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name role');

    // Enviar email al cliente si el comentario es de un agente
    const authorUser = await User.findById(author);
    if (authorUser && authorUser.role === 'agent') {
      const ticket = await Ticket.findById(ticketId).populate('createdBy', 'email');
      if (ticket && ticket.createdBy) {
        const clientUser = ticket.createdBy as any;
        await sendTicketResponseEmail(clientUser.email, ticket.title);
      }
    }

    return NextResponse.json({ comment: populatedComment }, { status: 201 });
  } catch (error) {
    console.error('Error creando comentario:', error);
    return NextResponse.json(
      { error: 'Error creando comentario' },
      { status: 500 }
    );
  }
}