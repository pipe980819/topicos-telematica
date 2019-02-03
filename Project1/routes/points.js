const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../helpers/auth');

//Bring in Points Model
let Points = require('../model/points');
let Routes = require('../model/routes');
let Shared = require('../model/shared_routes')
let Users = require('../model/user');

//Variables
let lastRouteId = "";
let routesArray = [];
function updateRoutes(userId){
    Routes.find({username: userId}, function(err, routes){
        if (err) throw err;
        routesArray = routes;
    });
}

//Routes
router.get('/routes', isAuthenticated, function(req, res){
    updateRoutes(req.user.id);
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
            Shared.findOneAndRemove({route: req.query.route}, function(err3){
                if(err1 || err2 || err3){
                    console.log(err1, err2, err3);
                }else{
                    req.flash('success', 'Route deleted');
                    res.redirect('/points/routes');
                    updateRoutes(req.user.id);
                }
            });
        });
    });

});

//Shared routes
router.get('/shared', isAuthenticated, async function(req, res){
    var routeArray = [];
    var userArray = [];
    var pointArray = [];
    var i;
    const user = await Users.findOne({_id: req.user.id});
    const shared = await Shared.find({viewers: user.username});
    if(shared.length >= 1){
        for(i = 0; i < shared.length; i++){
            const point = await Points.find({route: shared[i].route});
            const route = await Routes.find({_id: shared[i].route});
            const user = await Users.find({_id: shared[i].owner});
            routeArray.push(route);
            userArray.push(user);
            pointArray.push(point);
        }
    }else{
        res.render('shared_routes', {
            title: routeArray,
            owner: userArray,
            points: pointArray,
            error: true 
        });
    }
    res.render('shared_routes', {
        title: routeArray,
        owner: userArray,
        points: pointArray,
        error: false
    });
});

//Share route
router.get('/share_route/:id', isAuthenticated, async function(req, res){
    let shared = new Shared();
    const username = req.query.username;
    const user = await Users.findOne({username: username});
    const routeUser = await Routes.find({viewers: username});
    const route = await Shared.find({route: req.query.route});
    if (!username) {
        req.flash('error', 'Type a username');
        res.redirect('/points/routes');
    }else if(username == req.user.username){
        req.flash('error', 'You can not share a route with yourself. ');
        res.redirect('/points/routes');
    }else if(!user){
        req.flash('error', 'Username does not exist.');
        res.redirect('/points/routes');
    }else if(!routeUser){
        req.flash('error', 'This route has been already shared with that user.');
        res.redirect('/points/routes');
    }else{
        if(route.length >= 1){
            Shared.update({$push: {viewers: username}}, function(err){
                if(err){
                    console.log(err);
                    return;
                }else{
                    req.flash('success', 'Route shared');
                    res.redirect('/points/routes');
                }
            });
        }else{
            shared.route = req.query.route;
            shared.owner = req.user.id;
            shared.viewers = username;
            shared.save(function(err){
                if(err){
                    console.log(err);
                    return;
                }else{
                    req.flash('success', 'Route shared');
                    res.redirect('/points/routes');
                }
            });
        }
    }
});

//Show shared route
router.get('/show_shared_route/:id', isAuthenticated, function(req, res){
    Points.find({route: req.query.route}, function(err1, point){
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

module.exports = router;