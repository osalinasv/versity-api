const mongoose = require('mongoose')
const Course = require('../models/course')
const CourseResource = require('../models/course_resource')
const _ = require('lodash')

const createCourse = (req, res) => {
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

const titleToSlug = (title) => {
	return encodeURIComponent(title.toLowerCase().replace(' ', '_'))
}

const getCourseBySlug = (req, res) => {
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

const getCoursesByCategory = (req, res) => {
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

const getCoursesBySearch = (req, res) => {
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
