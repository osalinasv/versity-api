/**
 * The controller for the Course routes
 * @module
 */

/**
 * The Course model
 * @const
 */
const Course = require('../models/course')
const User = require('../models/user')

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
 * 	thumbnailURL: String|undefined,
 * 	author: String,
 * 	categories: String|String[]
 * 	resources: Object[]
 * }
 * ```
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
const createCourse = async (req, res, next) => {
	const {
		title,
		description,
		thumbnailURL,
		author,
		categories,
		resources
	} = req.body

	if (!_.isString(title) || !title) {
		return res.status(401).json({ message: 'A title must be defined' })
	}

	let authorRes = null

	if (!_.isString(author) || !author) {
		return res.status(401).json({ message:'A course must be asosiated to an User' })
	} else {
		try {
			authorRes = await User.findById(author)
			if (_.isEmpty(authorRes)) return res.status(401).json(`Author with id '${author}' does not exist`)
		} catch(err) {
			return res.status(500).send(err)
		}
	}

	const course = new Course({
		title,
		slug: titleToSlug(title),
		description,
		thumbnailURL,
		author: authorRes._id,
		categories: [].concat(categories).filter(s => _.isString(s) && s)
	})

	// return res.status(200).send(course)

	let courseRes = null

	try {
		courseRes = await course.save()
		if (!courseRes) return res.status(400).json({ message: 'Could not create course' })
	} catch(error) {
		return res.status(500).send(error)
	}

	const filteredRes = [].concat(resources).filter(o => _.isObject(o) && !_.isEmpty(o))

	for (const r of filteredRes) {
		const resource = new CourseResource(r)

		try {
			const resourceRes = await resource.save()

			if (resourceRes) {
				courseRes.resources.push(resourceRes._id)
			} else {
				courseRes.remove()
				return res.status(400).json({ message: `Could not create resource for course with id ${courseRes._id}` })
			}
		} catch (error) {
			courseRes.remove()
			return res.status(500).send(error)
		}
	}

	courseRes.markModified('resources')

	try {
		const finalCourse = await courseRes.save()

		if (finalCourse) {
			return res.status(200).send(finalCourse)
		} else {
			courseRes.remove()
			return res.status(400).json({ message: `Could not set resources for course with id ${courseRes._id}, deleting course` })
		}
	} catch(error) {
		courseRes.remove()
		return res.status(500).send(error)
	}
}

/**
 * Returns an underscored shortened URL version of the supplied title
 * @param {String} title The title to process
 * @returns {String} The resulting URL slug
 */
const titleToSlug = (title, maximum = 7) => {
	const words = title.toLowerCase().split(' ')
	return words.slice(0, (words.length > maximum) ? maximum : words.length).join('_')
}

/**
 * Get a course or course list's data from the request body of form:
 * ```
 * req.body: {
 * 	keywords: String|String[]|undefined,
 * 	categories: String|String[]|undefined,
 * 	populate: Boolean|undefined
 * 	size: Int|undefined
 * }
 * ```
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
const getCourses = (req, res, next) => {
	const { 
		keywords,
		categories,
		populate,
		size
	} = req.body

	let search = Course.find({})

	if ((_.isArray(keywords) && !_.isEmpty(keywords)) || (_.isString(keywords) && keywords)) {
		const keys = [].concat(keywords).filter(s => s)
		search.in('title', keys)
	}

	if ((_.isArray(categories) && !_.isEmpty(categories)) || (_.isString(categories) && categories)) {
		const cats = [].concat(categories).filter(s => s)
		search.in('categories', cats)
	}

	search.populate('author', 'first_name last_name username')

	if (populate === 'true') search.populate('resources', 'title content mediaURL')
	else search.select('-resources')

	if (size && size > 0) search.limit(size)
	search.sort({ createdAt: -1 })

	search.exec((err, courses) => {
		if (err) return res.status(500).send(err)
		res.status(200).send(courses)
	})
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
	const slug = _.toString(req.params.slug)

	Course.findOne({ slug })
		.select('-slug')
		.populate('author', 'first_name last_name username')
		.populate('resources', 'title content mediaURL')
		.exec((err, course) => {
			if (err) {
				return res.status(500).send(err)
			} else if (!_.isEmpty(course)) {
				return res.status(200).send(course)
			} else {
				return res.status(401).json({ message: `No course with the slug '${slug}'` })
			}
		})
}

module.exports = {
	createCourse,
	getCourses,
	getCourseBySlug,
}
