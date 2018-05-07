const mongoose = require('mongoose')
const _ = require('lodash')

/**
 * The CourseResource mongoose schema
 * @class
 * @property {String} title The resources's unique title
 * @property {String} content The resources's content or description
 * @property {String} mediaURL The resources's media URL to a view or image
 * @property {String} type The resources type
 */
const CourseResourceSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String
	},
	mediaURL: {
		type: String,
		lowercase: true
	},
	type: {
		type: String,
		required: true,
		lowercase: true,
		enum: ['text', 'image', 'video'],
		default: 'text'
	}
})

CourseResourceSchema.pre('save', function (next) {
	if (_.isString(this.title)) this.title = _.upperFirst(this.title)

	next()
})

const CourseResource = mongoose.model('course_resource', CourseResourceSchema)

module.exports = CourseResource
