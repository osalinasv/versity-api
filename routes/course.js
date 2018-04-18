const express = require('express');
const router = express.Router();
const courses = require('../controllers/courses')

router.post('/course', courses.createCourse)

router.get('/course/:slug', courses.getCourseBySlug)

router.post('/course/category', courses.getCoursesByCategory)

router.post('/course/search', courses.getCoursesBySearch)

module.exports = router
