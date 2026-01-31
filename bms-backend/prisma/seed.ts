import { prisma } from '../src/config/prisma';
import { hashPassword } from '../src/utils/helpers';

async function main() {
  try {
    console.log('🌱 Seeding database...');

    // Create organizations
    const org1 = await prisma.organization.create({
      data: {
        name: 'TechCorp Buildings',
        description: 'Large commercial building management company',
        inviteCode: 'TECH123',
      },
    });

    const org2 = await prisma.organization.create({
      data: {
        name: 'Smart Buildings Inc',
        description: 'Smart building solutions provider',
        inviteCode: 'SMART456',
      },
    });

    console.log('✓ Organizations created');

    // Create users (Admin, Supervisor, Technicians)
    const hashedPassword = await hashPassword('password123');

    const admin1 = await prisma.user.create({
      data: {
        email: 'admin@techcorp.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Admin',
        role: 'ADMIN',
        organizationId: org1.id,
      },
    });

    const supervisor1 = await prisma.user.create({
      data: {
        email: 'supervisor@techcorp.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Supervisor',
        role: 'SUPERVISOR',
        organizationId: org1.id,
      },
    });

    const tech1 = await prisma.user.create({
      data: {
        email: 'technician1@techcorp.com',
        password: hashedPassword,
        firstName: 'Mike',
        lastName: 'Technician',
        role: 'TECHNICIAN',
        organizationId: org1.id,
      },
    });

    const tech2 = await prisma.user.create({
      data: {
        email: 'technician2@techcorp.com',
        password: hashedPassword,
        firstName: 'Emma',
        lastName: 'Engineer',
        role: 'TECHNICIAN',
        organizationId: org1.id,
      },
    });

    console.log('✓ Users created');

    // Create buildings
    const building1 = await prisma.building.create({
      data: {
        name: 'Main Office',
        description: 'Primary office building',
        location: 'Downtown',
        organizationId: org1.id,
      },
    });

    const building2 = await prisma.building.create({
      data: {
        name: 'Warehouse A',
        description: 'Storage and distribution center',
        location: 'Industrial Park',
        organizationId: org1.id,
      },
    });

    console.log('✓ Buildings created');

    // Create categories
    const category1 = await prisma.category.create({
      data: {
        name: 'Chillers',
        description: 'Air conditioning chiller units',
        unit: '°C',
        minValue: 5,
        maxValue: 25,
        organizationId: org1.id,
        buildingId: building1.id,
      },
    });

    const category2 = await prisma.category.create({
      data: {
        name: 'Voltage',
        description: 'Electrical voltage monitoring',
        unit: 'V',
        minValue: 220,
        maxValue: 240,
        organizationId: org1.id,
        buildingId: building1.id,
      },
    });

    const category3 = await prisma.category.create({
      data: {
        name: 'Water Usage',
        description: 'Water consumption monitoring',
        unit: 'L',
        minValue: 0,
        maxValue: 1000,
        organizationId: org1.id,
        buildingId: building2.id,
      },
    });

    console.log('✓ Categories created');

    // Create tasks
    const task1 = await prisma.task.create({
      data: {
        title: 'Daily Chiller Temperature Check',
        description: 'Monitor chiller temperature 3 times daily',
        frequency: 'DAILY',
        scheduledTime: '09:00',
        organizationId: org1.id,
        buildingId: building1.id,
        categoryId: category1.id,
      },
    });

    const task2 = await prisma.task.create({
      data: {
        title: 'Voltage Monitoring',
        description: 'Check main electrical voltage',
        frequency: 'DAILY',
        scheduledTime: '14:00',
        organizationId: org1.id,
        buildingId: building1.id,
        categoryId: category2.id,
      },
    });

    const task3 = await prisma.task.create({
      data: {
        title: 'Water Usage Log',
        description: 'Record daily water consumption',
        frequency: 'DAILY',
        scheduledTime: '17:00',
        organizationId: org1.id,
        buildingId: building2.id,
        categoryId: category3.id,
      },
    });

    console.log('✓ Tasks created');

    // Assign tasks
    await prisma.taskAssignment.createMany({
      data: [
        { taskId: task1.id, userId: tech1.id },
        { taskId: task1.id, userId: tech2.id },
        { taskId: task2.id, userId: tech1.id },
        { taskId: task3.id, userId: tech2.id },
      ],
    });

    console.log('✓ Task assignments created');

    // Create sample readings
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const reading1 = await prisma.reading.create({
      data: {
        value: 22.5,
        notes: 'Temperature stable',
        status: 'APPROVED',
        approvedAt: new Date(),
        organizationId: org1.id,
        buildingId: building1.id,
        categoryId: category1.id,
        taskId: task1.id,
        submittedById: tech1.id,
        submittedAt: yesterday,
      },
    });

    const reading2 = await prisma.reading.create({
      data: {
        value: 230,
        notes: 'Normal voltage',
        status: 'PENDING',
        organizationId: org1.id,
        buildingId: building1.id,
        categoryId: category2.id,
        taskId: task2.id,
        submittedById: tech1.id,
      },
    });

    console.log('✓ Readings created');

    // Add reading comments
    await prisma.readingComment.create({
      data: {
        comment: 'Looks good, within normal range',
        organizationId: org1.id,
        readingId: reading1.id,
        userId: supervisor1.id,
      },
    });

    console.log('✓ Comments added');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('  Admin: admin@techcorp.com / password123');
    console.log('  Supervisor: supervisor@techcorp.com / password123');
    console.log('  Technician 1: technician1@techcorp.com / password123');
    console.log('  Technician 2: technician2@techcorp.com / password123');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
