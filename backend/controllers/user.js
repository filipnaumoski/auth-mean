const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hash
    })
    user.save().then(result => {
      res.status(200).json({
        message: 'User created!',
        result: result
      })
    }).catch(err => {
      res.status(500).json({
        message: "Invalid authentication credentials!"
      })
    })
  })
}

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({
      email: req.body.email
    }).then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Invalid authentication credentials!'
        })
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Invalid authentication credentials!'
        })
      }
      const token = jwt.sign({
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: '1h'
        })
      const refreshToken = jwt.sign({
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        process.env.JWT_REFRESH_KEY,
        {
          expiresIn: '1d'
        })
      res.status(200).json({
        token: token,
        refreshToken: refreshToken,
        expiresIn: 3600,
        userId: fetchedUser._id
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid authentication credentials!'
      })
    })
}
