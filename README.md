# HelpDeskPro - Ticket Management System

A web system built with Next.js, TypeScript, and MongoDB for efficient management of technical support tickets.

## Description

HelpDeskPro es una aplicación que centraliza la gestión de tickets de soporte, permitiendo a los clientes crear y dar seguimiento a sus solicitudes, mientras que los agentes pueden gestionar, responder y resolver tickets de manera organizada.

## Main Features

- **Role-Based Authentication:**: Separate login for clients and agents
- **Ticket Management:** Create, edit, update status, and close tickets
- **Comment System:** Conversation thread on every ticket
- **Email Notifications:** Automatic alerts for important events
- **Agent Dashboard:** Full view with filters by status
- **Client Dashboard:** Personalized view of own tickets
- **Reusable Components:**: Button, Badge, and Card typed with TypeScript

## Technologies Used

- **Frontend**: React, Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB con Mongoose
- **Authentication**: Context API + bcryptjs
- **HTTP Client**: Axios
- **Email**: Nodemailer

## Prerequisites

- Node.js 18+ 
- MongoDB installed locally or connection to MongoDB Atlas
- Gmail account for sending emails (with app password)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/yezid-jr/HelpDeskPro-Ticket-Management-System.git
cd helpdesk-pro
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/helpdesk
EMAIL_USER=example@gmail.com
EMAIL_PASS=tu_password_of_gmail
```

**Note**: To obtain the Gmail app password:
1. Go to your Google Account
2. Security → Two-Step Verification
3. App Passwords
4. Generate a new password for "Mail"

### 4. Start MongoDB

If you are using local MongoDB:

```bash
mongosh
```

### 5. Create test users

Connect to MongoDB and run:

```javascript
use helpdesk

// Hash de "password123"
const hashedPassword = "$2b$10$K1FwGiAXaKLKJZW8Xg1xZ.NAeBsa4HFzaGwGZR2AkBbP0iMJpy4Yq"

db.users.insertMany([
  {
    name: "Cliente Test",
    email: "client@test.com",
    password: hashedPassword,
    role: "client",
    createdAt: new Date()
  },
  {
    name: "Agente Test",
    email: "agent@test.com",
    password: hashedPassword,
    role: "agent",
    createdAt: new Date()
  }
])
```

**Important**: You must hash the password using bcrypt. You can use this script:

```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('password123', 10);
console.log(hash);
```

### 6. Run the project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser

## Test Users

- **Client**: 
  - Email: `client@test.com`
  - Password: `password123`

- **Agent**: 
  - Email: `agent@test.com`
  - Password: `password123`

## Screenshots

### Login
![Login](./screenshots/login.png)

### Client Panel - Create Ticket
![Cliente Dashboard](./screenshots/client-create.png)

### Agent Panel - Ticket Management
![Agente Dashboard](./screenshots/agent-dashboard.png)

### Detail View with Comments
![Ticket Detail](./screenshots/ticket-detail.png)

## Project Structure

```
helpdesk-pro/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/login/route.ts
│   │   │   ├── tickets/route.ts
│   │   │   └── comments/route.ts
│   │   ├── client/page.tsx
│   │   ├── agent/page.tsx
│   │   ├── login/page.tsx
│   │   ├── ticket/[id]/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── Card.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── mongodb.ts
│   │   └── email.ts
│   └── models/
│       ├── User.ts
│       ├── Ticket.ts
│       └── Comment.ts
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

## Roles and Permissions

### Client
- View only their own tickets
- Create new tickets
- Add comments to their tickets
- View agent responses

### Agent
- View all system tickets
- Filter tickets by status
- Change ticket status
- Assign priority
- Respond with comments
- Close tickets

## Notification System
The system sends automatic emails for the following events:
**Ticket Created:** Sent to the client when a ticket is created
**New Response:** Sent to the client when an agent comments
**Ticket Closed:** Sent to the client when their ticket is closed

## Implemented Validations
- Required fields in forms
- Authentication required for all operations
- Role validation before sensitive actions
- Error handling with try/catch
- Clear success/error messages to the user

## Testing

To test the application:
1. Log in as client
2. Create a ticket with title and description
3. Verify email reception
4. Log out and log in as agent
5. View the created ticket
6. Add a comment
7. Change the ticket status
8. Verify that the client receives emails


## Developer Information

- **Name**: Yezid Castro
- **Email**: castrogil202@gmail.com

---

## Troubleshooting

### MongoDB connection error
```
Check that MongoDB is running
Verify the URL in MONGODB_URI

```

### Email sending error
```
Verify Gmail credentials
Ensure you’re using an app password
Check that EMAIL_USER and EMAIL_PASS are configured

```

### "Module not found" error
```bash
rm -rf node_modules package-lock.json
npm install
```