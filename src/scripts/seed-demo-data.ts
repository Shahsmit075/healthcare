import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// // Helper function to generate random time between two dates
// function randomDate(start: Date, end: Date) {
//   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
// }

// Helper function to create a clock-in/out pair
function generateClockInOut(userId: string, baseDate: Date, isLongShift = false) {
  const clockInTime = new Date(baseDate);
  clockInTime.setHours(8 + Math.floor(Math.random() * 3)); // Start between 8-10 AM
  clockInTime.setMinutes(Math.floor(Math.random() * 60));

  const clockOutTime = new Date(clockInTime);
  const shiftLength = isLongShift ? 10 + Math.random() * 4 : 6 + Math.random() * 4; // 10-14 hours or 6-10 hours
  clockOutTime.setHours(clockOutTime.getHours() + Math.floor(shiftLength));
  clockOutTime.setMinutes(Math.floor(Math.random() * 60));

  return {
    id: uuidv4(),
    userId,
    clockInTime,
    clockOutTime,
    createdAt: clockInTime,
    updatedAt: clockOutTime,
  };
}

async function seedDemoData() {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.clockIn.deleteMany();
    await prisma.user.deleteMany();

    // Create demo users
    console.log('Creating demo users...');
    const demoUsers = [
      {
        id: uuidv4(),
        name: 'Sarah Johnson',
        email: 'sarah.j@healthcare.demo',
        auth0Id: 'demo|' + uuidv4(),
        role: 'CARE_WORKER',
      },
      {
        id: uuidv4(),
        name: 'Michael Chen',
        email: 'michael.c@healthcare.demo',
        auth0Id: 'demo|' + uuidv4(),
        role: 'CARE_WORKER',
      },
      {
        id: uuidv4(),
        name: 'Emily Rodriguez',
        email: 'emily.r@healthcare.demo',
        auth0Id: 'demo|' + uuidv4(),
        role: 'CARE_WORKER',
      },
      {
        id: uuidv4(),
        name: 'David Kim',
        email: 'david.k@healthcare.demo',
        auth0Id: 'demo|' + uuidv4(),
        role: 'CARE_WORKER',
      },
      {
        id: uuidv4(),
        name: 'Lisa Patel',
        email: 'lisa.p@healthcare.demo',
        auth0Id: 'demo|' + uuidv4(),
        role: 'CARE_WORKER',
      },
    ];

    const users = await Promise.all(
      demoUsers.map(user =>
        prisma.user.create({
          data: {
            ...user,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
      )
    );

    console.log('Creating clock-in records...');
    const clockInRecords = [];
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    // Generate clock-in records for the past 7 days
    for (const user of users) {
      const currentDate = new Date(sevenDaysAgo);

      while (currentDate <= today) {
        // 80% chance of working on any given day
        if (Math.random() < 0.8) {
          // 30% chance of a long shift
          const isLongShift = Math.random() < 0.3;
          clockInRecords.push(generateClockInOut(user.id, currentDate, isLongShift));

          // 20% chance of a second shift
          if (Math.random() < 0.2) {
            const secondShift = generateClockInOut(user.id, currentDate, false);
            secondShift.clockInTime.setHours(secondShift.clockInTime.getHours() + 8);
            secondShift.clockOutTime.setHours(secondShift.clockOutTime.getHours() + 8);
            clockInRecords.push(secondShift);
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Create some active (not clocked out) sessions for today
    const activeUsers = users.slice(0, 2); // Make 2 users currently active
    for (const user of activeUsers) {
      const activeClockIn = {
        id: uuidv4(),
        userId: user.id,
        clockInTime: new Date(today.setHours(today.getHours() - 2)), // Clocked in 2 hours ago
        clockOutTime: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      clockInRecords.push(activeClockIn);
    }

    await prisma.clockIn.createMany({
      data: clockInRecords,
    });

    console.log('Demo data seeded successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${clockInRecords.length} clock-in records`);

  } catch (error) {
    console.error('Error seeding demo data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedDemoData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 