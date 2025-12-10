const express = require('express');
const { getCourses, getCourse, createCourse, enrollInCourse, generateCertificate } = require('../controllers/courseController');
const { getCourseProgress } = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getCourses)
    .post(protect, authorize('INSTRUCTOR', 'ADMIN'), createCourse);

router.route('/:id')
    .get(getCourse);

router.route('/:id/enroll')
    .post(protect, enrollInCourse);

router.route('/:id/certificate')
    .post(protect, generateCertificate);

router.route('/:courseId/progress')
    .get(protect, getCourseProgress);

module.exports = router;
