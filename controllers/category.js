const Category = require('../models/Category');
const Position = require('../models/Position');
const {errorHandler} = require('../utils/authHandler');

module.exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({user: req.user.id});
        res.status(200).json(categories);
    } catch (e) {
        errorHandler(res, e);
    }
};
module.exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.status(200).json(category);
    } catch (e) {
        errorHandler(res, e);
    }
};
module.exports.deleteCategory = async (req, res) => {
    try {
        await Category.remove({_id: req.params.id});
        await Position.remove({category: req.params.id});
        res.status(200).json({
            message: 'Category removed and all child positions removed'
        })
    } catch (e) {
        errorHandler(res, {message: 'Could not remove category, try again'});
    }
};
module.exports.createCategory = async (req, res) => {
    const category = new Category({
        name: req.body.name,
        user: req.user.id,
        imageSrc: req.file ? req.file.path : ''
    });
    try {
        await category.save();
        res.status(201).json(category)
    } catch (e) {
        errorHandler(res, {message: 'Could not create category, try again'});
    }
};
module.exports.updateCategory = async (req, res) => {
    const updated = {
        name: req.body.name
    };
    if (req.file) {
        updated.imageSrc = req.file.path
    }
    try {
        const category = await Category.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true, useFindAndModify: false}
        );
        res.status(200).json(category)
    } catch (e) {
        errorHandler(res, {message: 'Failed to convert category, try again.'});
    }
};