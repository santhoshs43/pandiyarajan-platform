const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Update lesson progress
// @route   PUT /api/enrollments/:enrollmentId/lessons/:lessonId
// @access  Private
const updateProgress = async (req, res) => {
    const enrollmentId = parseInt(req.params.enrollmentId);
    const lessonId = parseInt(req.params.lessonId);
    const userId = req.user.id; // Ensure the user owns the enrollment

    try {
        // Verify enrollment belongs to user
        const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
        });

        if (!enrollment || enrollment.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const progress = await prisma.lessonProgress.upsert({
            where: {
                enrollmentId_lessonId: {
                    enrollmentId,
                    lessonId,
                },
            },
            update: {
                completed: true,
            },
            create: {
                enrollmentId,
                lessonId,
                completed: true,
            },
        });

        res.json(progress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get progress for a course
// @route   GET /api/courses/:courseId/progress
// @access  Private
const getCourseProgress = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = req.user.id;

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            },
            include: {
                progress: true
            }
        });

        if (!enrollment) {
            return res.status(404).json({ message: 'Not enrolled' });
        }

        res.json(enrollment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    updateProgress,
    getCourseProgress
};
