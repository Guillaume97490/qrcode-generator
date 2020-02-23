const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const paginate = require('express-paginate');
const compression = require('compression');
const helmet = require('helmet');

const session = require('express-session');
const flash = require('connect-flash');
process.env.URL
app.use(helmet());

app.use(compression());
app.use('app', function (req, res, next) {});

app.use(session({
    secret:"The milk would do that",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});

app.use(paginate.middleware(5, 50));

app.use(function(req, res, next) {
    res.locals.query = req.query;
    res.locals.page   = req.originalUrl.split('page=')[1];
    next();
 });


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

// importing routes
const exoRoutes = require('./routes/exo');

// settings
app.set('port', process.env.PORT || 3000);

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// routes
app.use('/', exoRoutes);

app.use(function(req, res, next) {
    req.flash("error", 'La route '+req.url+' n\'a pas été trouvé...');
    return res.status(404).redirect('/');
    // return res.status(404).send({ message: 'Route'+req.url+' Not found.' });

});
app.use(function(err, req, res, next) {
    req.flash("error", 'Un probléme est survenue');
    return res.status(500).redirect('/');
    // return res.status(500).send({ error: err });

});

// starting the server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});