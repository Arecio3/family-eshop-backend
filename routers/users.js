const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Get all Users
router.get(`/`, async (req, res) => {
    const userList = await User.find();

    if (!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
})

// Register New User
router.post('/', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    // create new user 
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        // Hashing password after user entered
        passwordHash: bcrypt.hashSync(req.body.passwordHash, salt),
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        zip: req.body.zip,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
    })
    // waits async to save
    user = await user.save();

    // if theres no user
    if (!user)
    return res.status(404).send('User was not registered !');

    // send to frontend
    res.send(user);
})

module.exports = router;
