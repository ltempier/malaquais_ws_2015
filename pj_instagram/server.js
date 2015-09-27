
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/www'));

app.listen(app.get('port'),"0.0.0.0", function() {
    console.log('Node app is running on port', app.get('port'));
});
