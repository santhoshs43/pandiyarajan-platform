const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                instructor: {
                    select: { name: true },
                },
            },
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
    try {
        const course = await prisma.course.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                instructor: {
                    select: { name: true },
                },
                lessons: true,
            },
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
const createCourse = async (req, res) => {
    const { title, description, price, thumbnail } = req.body;

    try {
        const course = await prisma.course.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                thumbnail,
                instructorId: req.user.id,
            },
        });
        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollInCourse = async (req, res) => {
    const courseId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        // Check if already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        // Simulating Payment (In real app, verify payment here)
        // For now, auto-approve enrollment as ACTIVE
        const enrollment = await prisma.enrollment.create({
            data: {
                userId,
                courseId,
                status: 'ACTIVE', // Simulating successful payment
            },
        });

        res.status(201).json({ message: 'Enrolled successfully', enrollment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Generate Certificate
// @route   POST /api/courses/:id/certificate
// @access  Private
const generateCertificate = async (req, res) => {
    const courseId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        // 1. Check if enrolled
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            include: {
                progress: true,
            },
        });

        if (!enrollment) {
            return res.status(404).json({ message: 'Not enrolled in this course' });
        }

        // 2. Check if all lessons are completed
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: { lessons: true },
        });

        const completedLessonIds = enrollment.progress
            .filter(p => p.completed)
            .map(p => p.lessonId);

        const allCompleted = course.lessons.every(lesson => completedLessonIds.includes(lesson.id));

        if (!allCompleted) {
            return res.status(400).json({ message: 'Course not yet completed' });
        }

        // 3. Create or Get Certificate
        const existingCertificate = await prisma.certificate.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (existingCertificate) {
            return res.json(existingCertificate);
        }

        const certificate = await prisma.certificate.create({
            data: {
                userId,
                courseId,
                certificateUrl: `https://example.com/certificates/${userId}/${courseId}`, // Mock URL
            },
        });

        res.status(201).json(certificate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    enrollInCourse,
    generateCertificate,
};
