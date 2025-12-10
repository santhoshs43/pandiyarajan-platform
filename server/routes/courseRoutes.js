const express = require('express');
const { getCourses, getCourse, createCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getCourses)
    .post(protect, authorize('INSTRUCTOR', 'ADMIN'), createCourse);

router.route('/:id')
    .get(getCourse);

module.exports = router;
