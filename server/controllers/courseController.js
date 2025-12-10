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

module.exports = {
    getCourses,
    getCourse,
    createCourse,
};
