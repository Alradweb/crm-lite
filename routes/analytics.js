const express = require('express');
const passport = require("passport");
const {overview, analytics} = require('../controllers/analytics');
const router = express.Router();

router.get('/overview', passport.authenticate('jwt',{session: false}), overview);
router.get('/analytics', passport.authenticate('jwt',{session: false}), analytics);



module.exports = router;