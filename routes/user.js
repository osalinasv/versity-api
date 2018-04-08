var express = require('express');
var router = express.Router();
var path = require('path')
var users = require('../controllers/users.js')

//Home endpoint
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public'))
});

//register user
router.post('/user/register', users.postUser);

//update user
router.post('/user/update', users.updateUser);

//login user
router.post('/user/login', users.loginUser);

//change password
router.post('/user/changepassword', users.changePass);

//forgot password
router.post('/user/forgotpassword', users.forgotPass);

//reset password
router.post('/user/reset/:token', users.resetPassword)

//forgot username
router.post('/user/forgotusername', users.forgotName);

//logout user
router.get('/user/logout', users.logoutUser);

//status 
router.get('/user/status', users.getuserStatus);

//find a users information
router.get('/user/profile/:firstName?', users.getUsers);

//
// router.get('', )
//
// router.get('', )
//
// router.get('', )

module.exports = router;
