const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all Users
router.get(`/`, async (req, res) => {
    // The API excludes the password on JSON return
    const userList = await User.find().select('-passwordHash');

    if (!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
})

// Get users only with name, email, phone
router.get(`/userinfo`, async (req, res) => {
    // The API excludes the password on JSON return
    const userList = await User.find().select('name email phone -_id');

    if (!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
})

// Get One User
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
        res.status(500).json({message: 'The Users ID is invalid'})
    }
    res.status(200).send(user)
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

// Login
router.post('/login', async (req,res) => {
    // checks email of user
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret

    if (!user) {
        return res.status(400).send('User not found')
    }
    // If theres a user AND the password passed in matches password in DB
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            // Password to create token (secret)
            secret,
            // token expires in 1 day
            {expiresIn: '1d'}
        )
        return res.status(200).send({user: user.email, token: token})
    } else {
        res.status(400).send('Password is Incorrect!')
    }

    return res.status(200).send(user)
})

// Register New User Route
router.post('/register', async (req, res) => {
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

// Gets total Users
router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments();
    // If theres no products
    if (!userCount) {
      res.status(500).json({ success: false });
    }
    res.send({
      userCount: userCount,
    });
  });

  // Delete User
router.delete("/:id", (req, res) => {
    User.findByIdAndRemove(req.params.id)
      .then((user) => {
        if (user) {
          return res
            .status(200)
            .json({ success: true, message: "User Destroyed" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "User not found!" });
        }
        // Server Error
      })
      .catch((err) => {
        return res.status(400).json({ success: false, error: err });
      });
  });

module.exports = router;
