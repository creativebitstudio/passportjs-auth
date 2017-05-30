const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs= require('express-handlebars');
const expressValidator= require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
// local passport 
const localStrategy= require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');

// initialize express application
const app = express();

mongoose.connect('mongodb://localhost/loginapp');
const db = mongoose.connection;

const routes = require('./routes/index');
const users = require('./routes/users');

// view engine
// where to fins the views file
app.set('views', path.join(__dirname, 'views'));
// name of the layout.handlebars file
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
// for the view engine, use handlebars
app.set('view engine', 'handlebars'); 

// bodyparser and cookieparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

// set static public folder for the browser to access
// this is where we will keep our style sheets, images, videos, jquery code, etc. 
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Middleware for the express-validator, code is taken from the github repo
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});



app.use('/', routes);
app.use('/users', users);


// SEt a port to start server
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), () => {
    console.log('Server listening on port' + app.get('port'));
});
