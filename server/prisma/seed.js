const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create a demo Instructor
    const instructorConfig = {
        email: 'instructor@example.com',
        name: 'John Doe',
        role: 'INSTRUCTOR',
        // In a real app, hash this password! 
        // This is just for seeding demonstration purposes.
        password: hashedPassword
    };

    const instructor = await prisma.user.upsert({
        where: { email: instructorConfig.email },
        update: { password: hashedPassword },
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
                    { title: 'Introduction to Java', content: 'History and Setup', videoUrl: 'https://www.youtube.com/watch?v=grEKMHGYyns' },
                    { title: 'Variables and Data Types', content: 'Understanding primitives and objects', videoUrl: 'https://www.youtube.com/watch?v=gtQJNm3_p-A' },
                    { title: 'OOP Concepts', content: 'Classes, Objects, Inheritance', videoUrl: 'https://www.youtube.com/watch?v=U8wrZ92nAL8' },
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
                    { title: 'Python Setup', content: 'Installing Python and VS Code', videoUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc' },
                    { title: 'Control Flow', content: 'If statements and Loops', videoUrl: 'https://www.youtube.com/watch?v=6iF8Xb7Z3wQ' },
                    { title: 'Functions and Modules', content: 'Reusing code effectively', videoUrl: 'https://www.youtube.com/watch?v=NSbOtYzIQI0' },
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
