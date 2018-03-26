const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.send({ data: 'did a get' });
});

router.post('/', (req, res, next) => {
	res.send({ data: 'did a post' });
});

router.put('/', (req, res, next) => {
	res.send({ data: 'did a put' });
});

router.delete('/', (req, res, next) => {
	res.send({ data: 'did a delete' });
});

module.exports = router;
