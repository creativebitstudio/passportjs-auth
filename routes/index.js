const express = require('express');
const router = express.Router();

// Home Route
router.get('/', function(req, res){
    res.render('index');
}); 

// Profile Route
router.get('/profile', function(req, res){
    res.render('profile');
});

module.exports = router;