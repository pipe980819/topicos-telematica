const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

//Check conn
db.once('open', function(){
    console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', function(err){
    console.log(err);
});

//Init app
const app = express();

//Bring in Models
let Article = require('./model/article');

//Load view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Set public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Global variable for users
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//Home route
app.get('/', function(req, res){
    Article.find({}, function(err, article){
        if(err){
            console.log(err);
        }else{
            res.render('index',{
                title: 'Articles',
                articles: article
            });
        }
    });
});

//Add route
app.get('/articles/add', function(req, res){
    res.render('add_article', {
        title:'Add Article'
    });
});

//Add submit POST Route
app.post('/articles/add', function(req, res){
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    
    article.save(function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success', 'Article Added')
            res.redirect('/');
        }
    });
});
//Route files
//let articles = require('./routes/articles');
let users = require('./routes/users')
app.use('/users', users);

//Start server
app.listen(3000);
