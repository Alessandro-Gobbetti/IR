// require framework and middleware dependencies
const express = require('express');
const logger = require('morgan');
const methodOverride = require('method-override')

// Application config import
const {webserver} = require('./config/config.js')
const { xss } = require('express-xss-sanitizer');

/////////////////////////////////////////////////////////////////////////////////////
// INIT framework
const app = express();

// app.use(setDomain(domain));

app.use(webserver.rate.generic_limiter)
app.use(logger('dev'));
app.use(xss()) // Parses req attributes to make sure they can't be considered part of an XSS attack
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));    // parse application/x-www-form-urlencoded
app.use(express.json());    // parse application/json
app.use(methodOverride('_method'));

app.set('trust proxy', 1)


/////////////////////////////////////////////////////////////////////////////////////
// CONTROLLERS
//this will automatically load all routers found in the routes folder
const routers = require('./routes');

app.use('/', routers.root);

// Static folders
app.use('/', express.static('public'));

//default fallback handlers
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});


/////////////////////////////////////////////////////////////////////////////////////
// Export app
app.set('port', webserver.port)

module.exports = app