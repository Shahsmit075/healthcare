const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?sslmode=require'
    }
  }
});

async function testPrismaConnection() {
  try {
    console.log('Testing Prisma connection...');
    // Simple query to test connection
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('Connection successful! Current database time:', result[0].now);
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error connecting with Prisma:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testPrismaConnection(); 