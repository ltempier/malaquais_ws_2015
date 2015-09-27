'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    session = require('express-session');

var app = express();
app.set('port', (process.env.PORT || 5000));

app.use(session({
    name: 'session',
    secret: '53cr37m4l4qu415',
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: true
}));

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/styles', express.static(__dirname + '/styles'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/images', express.static(__dirname + '/images'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require('./routes')(app);


var url = 'mongodb://localhost:27017/hello-malaquais';
if (process.env.NODE_ENV == 'production')
    url = 'mongodb://hello:malaquais@ds035703.mongolab.com:35703/hello-malaquais';

MongoClient.connect(url, function (err, db) {
    if (err)
        return console.log('mongodb error ' + err);
    global.__db = db;
    app.listen(app.get('port'), function () {
        console.log('Node app is running on port', app.get('port'));
    });
});