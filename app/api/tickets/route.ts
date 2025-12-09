import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import { sendTicketCreatedEmail, sendTicketClosedEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    let query: any = {};

    if (role === 'client' && userId) {
      query.createdBy = userId;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Error fetching tickets' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { title, description, createdBy, priority } = await req.json();

    if (!title || !description || !createdBy) {
      return NextResponse.json(
        { error: 'Title, description, and user are required' },
        { status: 400 }
      );
    }

    const ticket = await Ticket.create({
      title,
      description,
      createdBy,
      priority: priority || 'medium',
      status: 'open'
    });

    const user = await User.findById(createdBy);
    if (user) {
      await sendTicketCreatedEmail(user.email, title);
    }

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Error creating ticket' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { ticketId, status, priority, assignedTo } = await req.json();

    if (!ticketId) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    updateData.updatedAt = new Date();

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      updateData,
      { new: true }
    ).populate('createdBy', 'name email');

    if (status === 'closed' && ticket) {
      const user = await User.findById(ticket.createdBy);
      if (user) {
        await sendTicketClosedEmail(user.email, ticket.title);
      }
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: 'Error updating ticket' },
      { status: 500 }
    );
  }
}
