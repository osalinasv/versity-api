/**
 * Module that holds the API routes for obtaining and manipulating the courses in the database. 
 * @module 
 */

/**
 * The Express.js namespace
 * @const {Object}
 */
const express = require('express')

/**
 * This router object
 * @const {Object}
 */
const router = express.Router()

/**
 * The controller which holds the logic for each route
 * @const {Object}
 * @see {@link module:controllers/courses} For more information on how the routes work
 */
const courses = require('../controllers/courses')

/**
 * Route to create a course
 * @function POST /api/course
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
router.post('/course', courses.createCourse)

/**
 * Route to get a list of courses from a keyword search based on the title of the courses
 * @function POST /api/course/search
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
router.post('/course/search', courses.getCourses)

/**
 * Route to get a course´s data from its slug url
 * @function GET /api/course/:slug
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
router.get('/course/:slug', courses.getCourseBySlug)

module.exports = router
