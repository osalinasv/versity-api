const mongoose = require('mongoose')
const Course = require('../models/course')
const Category = require('../models/category')

const createCourse = (req, res) => {
	Course.create({
		title: req.body.title,
		description: req.body.description || '',
		slug: titleToSlug(req.body.title),
		categories: req.body.categories || []
	})
	.then(course => {
		res.status(200).send(course)
	})
	.catch(err => {
		res.status(500).send({ error: err })
	})
}

const titleToSlug = (title) => {
	return encodeURIComponent(title.toLowerCase().replace(' ', '_'))
}

const getCourseBySlug = (req, res) => {
	Course.findOne({ slug: req.query.slug }, (err, course) => {
		if (err) {
			res.status(500).json({
				error: err
			})
		} else if (course) {
			res.status(200).send(course)
		} else {
			res.status(401).json({
				error: `No course with the slug: ${req.query.slug}`
			})
		}
	})
}

const getCoursesByCategory = (req, res) => {
	const { categories, size } = req.body

	Category.find({ name: { $in: categories } }).select('_id').exec((err, ctg) => {
		if (err) {
			res.status(401).json({
				error: err
			})
		} else if (ctg) {
			Course.find({ categories: { $in: ctg } }, (err, courses) => {
				if (err) {
					res.status(401).json({
						error: err
					})
				} else if (courses) {
					res.status(200).send(courses)
				} else {
					res.status(401).json({
						error: 'There are no courses with these categories'
					})
				}
			})
		} else {
			res.status(401).json({
				error: 'These categories do not exist'
			})
		}
	})
}

const getCoursesBySearch = (req, res) => {
	res.status(401).json({ message: 'TODO' })
}

module.exports = {
	createCourse,
	getCourseBySlug,
	getCoursesByCategory,
	getCoursesBySearch,
}
