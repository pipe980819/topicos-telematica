const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../helpers/auth');

//Bring in Points Model
let Points = require('../model/points');
let Routes = require('../model/routes');

//Variables
let lastRouteId = "";
let routesArray = [];

//Routes
router.get('/routes', isAuthenticated, function(req, res){
    Points.find({username: req.user.id}, function(err, point){
        if(err){
            console.log(err);
        }else{
            res.render('routes',{
                title: 'Your routes',
                points: point,
                routes: routesArray
            });
        }
    });
});

//Add points
router.get('/add', isAuthenticated, function(req, res){
    res.render('add_points');
});

//Add submit POST Route
router.post('/add', isAuthenticated, function(req, res){
    let point = new Points();
    point.latitude = req.body.latitude;
    point.longitude = req.body.longitude;
    point.route = lastRouteId;
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

//Add new route
router.post('/create_route', isAuthenticated, function(req, res){
    let route = new Routes();
    const route_name = req.body.route_name;

    req.checkBody('route_name', 'Type a name for the route').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('add_points', {
          errors: errors
        });
    }else{
        route.name = route_name;
        route.username = req.user.id;
    
        route.save(function(err){
            if(err){
                console.log(err);
                return;
            }else{
                lastRouteId = route.id;
                routesArray.push(route);
                req.flash('success', 'Route Added');
                res.redirect('/points/add');
            }
        });
    }
});
module.exports = router;