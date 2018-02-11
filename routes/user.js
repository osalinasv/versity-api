const express = require('express');
const router = express.Router();

const User = require('../models/user');

// Get all users
router.get('/users', (req, res, next) => {
  User.find((err, users) => {
    res.send(users);
  });
});

// Get one user by id
router.get('/user', (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    res.send(user);
  });
});

// Create user
router.post('/user', (req, res, next) => {
  User.create(req.body)
		.then((user) => {
			res.send(user);
		})
		.catch(next);
});

module.exports = router;
