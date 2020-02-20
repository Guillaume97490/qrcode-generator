const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const paginate = require('express-paginate');

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



let User = require('./models/exo');

// starting the server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});