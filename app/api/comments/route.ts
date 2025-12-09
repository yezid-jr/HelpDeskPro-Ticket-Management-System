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
        { error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ ticketId })
      .populate('author', 'name role')
      .sort({ createdAt: 1 });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Error fetching comments' },
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
        { error: 'All fields are required' },
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

    // Send email to the client if the comment is from an agent
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
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Error creating comment' },
      { status: 500 }
    );
  }
}
