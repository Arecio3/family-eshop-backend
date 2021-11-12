const express = require('express');
const router = express.Router();
const { Category } = require('../models/category');

// Find Categories
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({success: false})
    }
    res.send(categoryList);
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


module.exports = router;