//registration and authorization
const express = require('express');
const {login, registration} = require('../controllers/auth');
const router = express.Router();

//http://localhost:5000/api/auth/login
router.post('/login', login);

//localhost:5000/api/auth/register
router.post('/register', registration);


module.exports = router;