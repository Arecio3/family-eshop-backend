const express = require('express');
const router = express.Router();
const { Category } = require('../models/category');

// Find Categories
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({success: false})
    }
    res.status(200).send(categoryList);
})

// One Category
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({message: 'The Categorys ID is invalid'})
    }
    res.status(200).send(category)
})

// Post Categories
router.post('/', async (req, res) => {
    // create new category 
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    })
    // waits async to save
    category = await category.save();

    // if theres no category
    if (!category)
    return res.status(404).send('Category was not created');

    // send to frontend
    res.send(category);
})

// Delete Category
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({success: true, message: "Category Destroyed"})
        } else {
            return res.status(404).json({success: false, message: 'Category not found!'})
        }
    // Server Error 
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;