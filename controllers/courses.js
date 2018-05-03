/**
 * The controller for the Course routes
 * @module
 */

const mongoose = require('mongoose')

/**
 * The Course model
 * @const
 */
const Course = require('../models/course')

/**
 * The CourseResource model
 * @const
 */
const CourseResource = require('../models/course_resource')
const _ = require('lodash')

/**
 * Creates and stores a course from the request body of form:
 * ```
 * req.body: {
 * 	title: String,
 * 	description: String|undefined,
 * 	author: String,
 * 	categories: String|Array<String>
 * }
 * ```
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
const createCourse = (req, res, next) => {
	const course = new Course({
		title: req.body.title,
		description: req.body.description || '',
		author: req.body.author,
		slug: titleToSlug(req.body.title),
		categories: req.body.categories || []
	})

	if (req.body.resources && req.body.resources.length > 0) {
		console.log('do resources')
		req.body.resources.forEach(resource => {
			console.log('do resources forloop')

			const re = new CourseResource(resource)
			console.log('resource creationg', re)

			re.save((err, _re) => {
				console.log('resource on save', _re)
				if (err) res.status(500).send({ error: err })
			})

			course.resources.push(re._id)
		})

		course.save((err, c) => {
			if (err) res.status(500).send({ error: err })
			else res.status(200).send(c)
		})
	} else {
		course.save((err, c) => {
			if (err) res.status(500).send({ error: err })
			else res.status(200).send(c)
		})
	}
}

/**
 * Returns an underscored shortened URL version of the supplied title
 * @param {String} title The title to process
 * @returns {String} The resulting URL slug
 */
const titleToSlug = (title) => {
	const words = title.toLowerCase().split(' ')
	const section = words.slice(0, (words.length > 10) ? 10 : words.length)

	return encodeURIComponent(section.join('_'))
}

/**
 * Get a course's data from the request parameters of form:
 * ```
 * req.params: {
 * 	slug: String
 * }
 * ```
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
const getCourseBySlug = (req, res, next) => {
	Course.findOne({ slug: req.params.slug })
		.populate('author', 'first_name last_name username')
		.populate('resources', 'title content mediaURL')
		.exec((err, course) => {
			if (err) {
				res.status(500).json({ error: err })
			} else if (!_.isEmpty(course)) {
				res.status(200).send({ course })
			} else {
				res.status(401).json({ error: `No course with the slug: ${req.params.slug}` })
			}
		})
}

/**
 * Get a course or course list's data from the request body of form:
 * ```
 * req.params: {
 * 	categories: String|Array<String>,
 * 	size: Int
 * }
 * ```
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
const getCoursesByCategory = (req, res, next) => {
	const { categories, size } = req.body
	const collection = [].concat(categories)

	if (_.isEmpty(collection)) {
		res.status(401).json({ error: 'No categories provided' })
		return
	}

	if (!size || size <= 0) {
		res.status(401).json({ error: 'The load size can not be zero nor negative' })
		return
	}

	Course.find({ categories: { $in: collection } })
		.limit(size)
		.exec((err, courses) => {
			if (err) {
				res.status(401).json({ error: err })
			} else if (!_.isElement(courses)) {
				res.status(200).send({ courses })
			} else {
				res.status(401).json({ error: 'There are no courses with these categories' })
			}
		})
}

/**
 * Get a course or course list's data from the request body of form:
 * ```
 * req.params: {
 * 	keywords: String|Array<String>,
 * 	size: Int
 * }
 * ```
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
const getCoursesBySearch = (req, res, next) => {
	const { keywords, size } = req.body
	const collection = [].concat(keywords)

	if (_.isEmpty(collection)) {
		// TODO: When no keywords are provided then just return the latest [size] courses.
		res.status(401).json({ error: 'No keywords provided' })
		return
	}

	if (!size || size <= 0) {
		res.status(401).json({ error: 'The load size can not be zero nor negative' })
		return
	}

	res.status(401).json({ message: 'TODO' })
}

module.exports = {
	createCourse,
	getCourseBySlug,
	getCoursesByCategory,
	getCoursesBySearch,
}
