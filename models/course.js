const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CourseSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: String,
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	categories: [String]
})

const Course = mongoose.model('course', CourseSchema)

module.exports = Course
