var logger = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');

var app = express(); 
var resources = __dirname+'/dist/';
app.set('port', 80);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(resources+'assets'));

process.argv.forEach(function(val, index) {
    if(val == '--dev')
        app.set('port', 3000);
});

app.get('/',  function (req, res) {
	res.sendFile(resources+'index.html');
});

app.get('/blog/*', function(req, res) {
    var options = {
        headers : {
            'Content-Type': 'text/html'
        }
    }
    var postPath = 'posts/'+req.path.replace('/blog/', '');
	res.sendFile(resources+postPath+'.html', options);
});

app.get('/euler/*', function(req, res) {
    var options = {
        headers: {
            'Content-Type': 'text/html'
        }
    };
    res.sendFile(resources+'euler/1'+'.html', options);
});

app.listen(app.get('port'), function() {
	console.log("Web server listening on port " + app.get('port'));
});

