const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../helpers/auth');

//Bring in Points Model
let Points = require('../model/points');

//Add points
router.get('/add', isAuthenticated, function(req, res){
    res.render('add_points');
});

//Add submit POST Route
router.post('/add', function(req, res){
    let point = new Points();
    point.latitude = req.body.latitude;
    point.longitude = req.body.longitude;
    point.username = req.user.id;
    
    point.save(function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success', 'Point Added')
            res.redirect('/points/add');
        }
    });
});
module.exports = router;