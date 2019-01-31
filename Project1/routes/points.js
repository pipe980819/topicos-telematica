const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../helpers/auth');

//Bring in Points Model
let Points = require('../model/points');
let Routes = require('../model/routes');

//Variables
let lastRouteId = "";
let routesArray = [];
function updateRoutes(){
    Routes.find({}, function(err, routes){
        if (err) throw err;
        routesArray = routes;
    });
}

//Routes
router.get('/routes', isAuthenticated, function(req, res){
    updateRoutes();
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
                //routesArray.push(route);
                req.flash('success', 'Route Added');
                res.redirect('/points/add');
            }
        });
    }
});

//Show route
router.get('/show_route/:id', isAuthenticated, function(req, res){
    Points.find({username: req.user.id, route: req.query.route}, function(err1, point){
        Routes.find({_id: req.query.route}, function(err2, route){
            if(err1 || err2){
                console.log(err1, err2);
            }else{
                res.render('show_route', {
                    title: route[0].name,
                    points: point,
                });
            }
        });
    });
});

//Delete route
router.get('/delete/:id', isAuthenticated, function(req, res){
    Points.deleteMany({username: req.user.id, route: req.query.route}, function(err1){
        Routes.findByIdAndDelete(req.query.route, function(err2){
            if(err1 || err2){
                console.log(err1, err2);
            }else{
                req.flash('success', 'Route deleted');
                res.redirect('/points/routes');
                updateRoutes();
            }
        });
    });

});
module.exports = router;