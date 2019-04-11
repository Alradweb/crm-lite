const express = require('express');
const passport = require("passport");
const {getPositionByCategoryId, createPosition, deletePosition, updatePosition} = require('../controllers/position');
const router = express.Router();


router.get('/:categoryId', passport.authenticate('jwt',{session: false}), getPositionByCategoryId);
router.post('/', passport.authenticate('jwt',{session: false}), createPosition);
router.patch('/:id', passport.authenticate('jwt',{session: false}), updatePosition);
router.delete('/:id', passport.authenticate('jwt',{session: false}), deletePosition);


module.exports = router;