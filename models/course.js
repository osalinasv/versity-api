const mongoose = require('mongoose')
const Schema = mongoose.Schema
const _ = require('lodash')

const CourseResource = require('./course_resource')

/**
 * The Course mongoose schema
 * @class
 * @property {String} title The course's unique title
 * @property {String} description The course's description
 * @property {String} thumbnailURL The course's thumbnail URL path
 * @property {Object} _author The course's assigned author User object
 * @property {String} slug The course's unique URL slug
 * @property {String[]} categories The course's list of categories
 * @property {Object[]} resources The course's list of CourseResource objects
 */
const CourseSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		default: ''
	},
	thumbnailURL: {
		type: String,
		lowercase: true,
		default: ''
	},
	_author: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	categories: {
		type: [String],
		lowercase: true
	},
	resources: [{
		type: Schema.Types.ObjectId,
		ref: 'course_resource'
	}]
}, {
	timestamps: true
})

CourseSchema.pre('remove', function (next) {
	CourseResource.remove({ _course: { $in: this._id } }, (err) => {
		if (err) next(err)
	})

	next()
})

CourseSchema.pre('save', function (next) {
	if (_.isString(this.title)) this.title = _.upperFirst(this.title)
	next()
})

const Course = mongoose.model('course', CourseSchema)

module.exports = Course
