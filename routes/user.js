const express = require('express')
const router = express.Router()
const users = require('../controllers/users.js')

//register user
router.post('/user/register', users.postUser)

//update user
router.post('/user/update', users.updateUser)

//login user
router.post('/user/login', users.loginUser)

//change password
router.post('/user/changepassword', users.changePassword)

//forgot password
router.post('/user/forgotpassword', users.forgotPassword)

//reset password
router.post('/user/reset/:token', users.resetPassword)

//forgot username
router.post('/user/forgotusername', users.forgotName)

//logout user
router.get('/user/logout', users.logoutUser)

//status 
router.get('/user/status', users.getUserStatus)

module.exports = router
