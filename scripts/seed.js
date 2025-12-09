const bcrypt = require('bcryptjs');

async function generateUsers() {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log('Hash:', hashedPassword);
  console.log('\nCopi this code in MongoDB Shell:\n');
  console.log(`
use helpdesk

db.users.insertMany([
  {
    name: "Cliente Test",
    email: "client@test.com",
    password: "${hashedPassword}",
    role: "client",
    createdAt: new Date()
  },
  {
    name: "Agente Test",
    email: "agent@test.com",
    password: "${hashedPassword}",
    role: "agent",
    createdAt: new Date()
  }
])
  `);
}

generateUsers();