const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CourseSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	categories: [String],
	resources: [{
		type: Schema.Types.ObjectId,
		ref: 'course_resource'
	}]
})

const Course = mongoose.model('course', CourseSchema)

module.exports = Course
