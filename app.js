const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const paginate = require('express-paginate');
const compression = require('compression');
const helmet = require('helmet');

app.use(helmet());
app.use(compression());
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
const slugRoutes = require('./routes/slug');

// settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use('/', slugRoutes); // routes
app.listen(app.get('port'), () => { // starting the server
    console.log(`server on port ${app.get('port')}`);
});