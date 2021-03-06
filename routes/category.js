const express = require('express');
const passport = require('passport');

const {getAllCategories,
       getCategoryById,
       deleteCategory,
       createCategory,
       updateCategory} = require('../controllers/category');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', passport.authenticate('jwt',{session: false}), getAllCategories);
router.get('/:id', passport.authenticate('jwt',{session: false}), getCategoryById);
router.delete('/:id', passport.authenticate('jwt',{session: false}), deleteCategory);
router.post('/', passport.authenticate('jwt',{session: false}), upload.single('image'), createCategory);
router.patch('/:id', passport.authenticate('jwt',{session: false}), upload.single('image'), updateCategory);



module.exports = router;