const mongoose = require('mongoose')
const Course = require('../models/course')
const _ = require('lodash')

const createCourse = (req, res) => {
	Course.create({
		title: req.body.title,
		description: req.body.description || '',
		slug: titleToSlug(req.body.title),
		categories: req.body.categories || []
	})
	.then(course => {
		res.status(200).send({ course })
	})
	.catch(err => {
		res.status(500).send({ error: err })
	})
}

const titleToSlug = (title) => {
	return encodeURIComponent(title.toLowerCase().replace(' ', '_'))
}

const getCourseBySlug = (req, res) => {
	Course.findOne({ slug: req.query.slug })
		.exec((err, course) => {
			if (err) {
				res.status(500).json({ error: err })
			} else if (!_.isEmpty(course)) {
				res.status(200).send({ course })
			} else {
				res.status(401).json({ error: `No course with the slug: ${req.query.slug}` })
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
