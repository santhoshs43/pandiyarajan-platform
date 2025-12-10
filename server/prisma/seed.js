const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Create a demo Instructor
    const instructorConfig = {
        email: 'instructor@example.com',
        name: 'John Doe',
        role: 'INSTRUCTOR',
        // In a real app, hash this password! 
        // This is just for seeding demonstration purposes.
        password: 'password123'
    };

    const instructor = await prisma.user.upsert({
        where: { email: instructorConfig.email },
        update: {},
        create: instructorConfig,
    });

    console.log(`Instructor created/found: ${instructor.email}`);

    // 2. Create Java Course
    const javaCourse = await prisma.course.create({
        data: {
            title: 'Java Programming Masterclass',
            description: 'Learn Java from scratch to advanced concepts. Includes object-oriented programming, data structures, and more.',
            price: 49.99,
            thumbnail: 'https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg',
            instructorId: instructor.id,
            lessons: {
                create: [
                    { title: 'Introduction to Java', content: 'History and Setup' },
                    { title: 'Variables and Data Types', content: 'Understanding primitives and objects' },
                    { title: 'OOP Concepts', content: 'Classes, Objects, Inheritance' },
                ],
            },
        },
    });
    console.log(`Course created: ${javaCourse.title}`);

    // 3. Create Python Course
    const pythonCourse = await prisma.course.create({
        data: {
            title: 'Python for Beginners',
            description: 'Start your journey with Python. Great for data science, web development, and automation.',
            price: 39.99,
            thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg',
            instructorId: instructor.id,
            lessons: {
                create: [
                    { title: 'Python Setup', content: 'Installing Python and VS Code' },
                    { title: 'Control Flow', content: 'If statements and Loops' },
                    { title: 'Functions and Modules', content: 'Reusing code effectively' },
                ],
            },
        },
    });
    console.log(`Course created: ${pythonCourse.title}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
