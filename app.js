
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose')
  , User = require('./models/User.model.js')
  , Media = require('./models/Media.model.js');

var app = module.exports = express.createServer();
mongoose.connect("mongodb://localhost/memento");

function isAuth(req, res, next){
  var err = { error : "2"};
  res.writeHead(500, {"Content-type":"text"});
  res.end(JSON.stringify(err));
}

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req,res){
  res.writeHead(200, {"Content-type":"text/JSON"});
  res.write(JSON.stringify({"home":"home"}));
  res.end();
});


 /*
  * Start User HTTP action
 */
 app.get('/user', function(req, res){

     User.findAll(function(err, users){
       if(err) console.log("Error: " + err);
       res.writeHead(200, {"Content-type": "text/JSON"});
       res.write(JSON.stringify(users));
       res.end();
     })
 });

app.get('/user/:id', function(req, res){ // richiesta informazioni utente
    var id = req.params.id;
    res.writeHead(200, {"Content-type": "text"});

    User.findUser(id, function(err, user){
        if(err) throw err;
        res.write(JSON.stringify(user));
        res.end();
    });
});

app.post('/user/:id', function(req, res){
  var id = req.params.id;
  res.writeHead(200, {"Content-type": "text"});
  res.end("Create"+ id +" profile");
});

app.delete('/user/:id', function(req,res){
  var id = req.params.id;
  res.writeHead(200, {"Content-type": "text"});
  res.end("Delete " + id +" profile");
});

app.put('/user/:id', function(req, res){
  var id = req.params.id;
  res.writeHead(200, {"Content-type": "text"});
  res.end("Update "+ id +" profile");
});

/*
* END User HTTP Action
*/

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
