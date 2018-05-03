const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * The Course mongoose schema
 * @class
 * @property {String} title The course's unique title
 * @property {String} description The course's description
 * @property {Object} author The course's assigned author User object
 * @property {String} slug The course's unique URL slug
 * @property {String[]} categories The course's list of categories
 * @property {Object[]} resources The course's list of CourseResource objects
 */
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
