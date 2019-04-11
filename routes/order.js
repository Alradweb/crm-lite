const express = require('express');
const passport = require('passport');
const router = express.Router();

const {getAllOrders, createOrder} = require('../controllers/order');



router.get('/', passport.authenticate('jwt',{session: false}), getAllOrders);
router.post('/', passport.authenticate('jwt',{session: false}), createOrder);


module.exports = router;