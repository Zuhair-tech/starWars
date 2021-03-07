const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const Users = require('../controllers/user')

router.route('/login')
    .get((req,res)=>{
        res.render('users/login')
    })
    .post(passport.authenticate('local', {successRedirect: '/arts',failureRedirect: '/login'}))

router.route('/register')
    .get(Users.getRegisterForm)
    .post(catchAsync(Users.newUser))
//If authentication succeeds, the next handler will be invoked 
//and the req.user,req.login, req.logout property can be used

router.get('/logout', Users.logout)

router.get('/demo', Users.demo)

module.exports = router;