const mongoose = require('mongoose')

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
