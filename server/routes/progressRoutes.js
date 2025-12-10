const express = require('express');
const { updateProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/:enrollmentId/lessons/:lessonId', protect, updateProgress);

module.exports = router;
