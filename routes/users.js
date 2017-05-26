const express = require('express');
const router = express.Router();
// require passport and local strategy
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// reuire user variable here
const User = require('../models/user');

// // Profile Route
// router.get('/profile', function(req, res){
//     res.render('profile');
// });

// Register Route
router.get('/register', function(req, res){
    res.render('register');
});

// Login route
router.get('/login', function(req, res){
    res.render('login');
});

// Register User Route for POST!
router.post('/register', function(req, res){
    // declaring variables that need to be required in app
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Form Validation for every field inputted by the user
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    // check for validation errors
    var errors = req.validationErrors();
    if(errors){
        res.render('register',{
            errors:errors
        });
    } 
    else{
        // the variable User has to be required
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        User.createUser(newUser, function(err, user) {
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are successfully registered and can now login');
        res.redirect('/users/login');
        }
});
// gets username and matches to see if such username already exists
passport.use(new LocalStrategy(
  function(username, password, done) {
      // create model function
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'Unknown User'});
        }
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            }
            else{
                return done(null, false, {message: 'Invalid password'});
            }
        });
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// this part of the code comes directly from the passportjs.org website
// if you get stuck look up the documentation on passportjs.org
// dont forget to require passport
// this part of the code will authenticate that the user enters the right credentials and either redirects the user to the login page or indicated a credential error
router.post('/login', passport.authenticate('local', {successRedirect:'/profile', failureRedirect:'/users/login', failureFlash: true}), 
function(req, res) {
    res.redirect('/profile')
});

// to allow the user to logout out of his or hers page
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You have successfully logged out');
    res.redirect('/');
});

module.exports = router;