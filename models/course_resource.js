const mongoose = require('mongoose')

/**
 * The CourseResource mongoose schema
 * @class
 * @property {String} title The resources's unique title
 * @property {String} content The resources's content or description
 * @property {String} mediaURL The resources's media URL to a view or image
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
        type: String
    }
})

const CourseResource = mongoose.model('course_resource', CourseResourceSchema)

module.exports = CourseResource
