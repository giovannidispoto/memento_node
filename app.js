
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose')
  , User = require('./models/User.model.js')
  , Media = require('./models/Media.model.js')
  , uuid = require('node-uuid');

const YEAR_MILLIS =  31556952000;

var app = module.exports = express.createServer();

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/memento");

function isAuth(req, res, next){
  var token = req.param("token");
  var user_id = req.param("user_id");

  User.isValidToken(user_id, token, function(err, result){
      if(err) throw err;
  });

  res.writeHead(500, {"Content-type":"text"});
  res.end(JSON.stringify({
    result : "ERR",
    error : {
      code: 2,
      errMsg: "you are not authenticated"
    }
  }));
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

app.post('/login', function(req, res){ //autenticazione

 User.findUser(req.param("user_id"), function(err, user){ //cerco l'utente con l'username richiesto

    if(user == undefined){ //se l'utente non esiste
      res.writeHead(503, {"Content-type": "text/JSON"});
      res.write(JSON.stringify({
        result : "ERR",
        error : {
          code: 1,
          errMsg: "user not found"
        }
      }));
    }

     user.auth(req.param("pass"), function(match){ //controllo che le password siano uguali
        if(match){
             var token = uuid.v1();
             var expire = ( new Date().getTime() + YEAR_MILLIS );
            user.createSession(req.connection.remoteAddress,token,expire, null, function(err, user){
              if(err) throw err;
                res.writeHead(200, {"Content-type": "text/JSON"});
                res.write(JSON.stringify({
                  result : "OK",
                  error : 0,
                  session : {
                    token : token,
                    expire : expire
                  }
                })); //do la risposta in JSON con codice 200: OK
                res.end();

            });

        }else{
          res.writeHead(503, {"Content-type": "text/JSON"});
          res.write(JSON.stringify({
            result : "ERR",
            error : {
              code : 3,
              errMsg: "bad credentials"
            }
          })); //do la risposta di errore con codice 503: Bad credentials
          res.end();
        }
     });
 });

});


 /*
  * Start User HTTP action
 */

 app.post('/user',isAuth, function(req, res){

     User.findAll(function(err, users){
       if(err) console.log("Error: " + err);
       res.writeHead(200, {"Content-type": "text/JSON"});
       res.write(JSON.stringify(users));
       res.end();
     })
 });

 app.post('/user/', function(req, res){

   var user = new User({ //creo nuovo utente
     _id : req.param("user_id"),
     name : req.param("name"),
     surname: req.param("surname"),
     e_mail: req.param("e_mail"),
     password: req.param("password"),
     date_of_birth: req.param("date_of_birth"),
     avatar: "avatar",
     sex: req.param("sex"),
   });

   console.log("Created new user: "+ user._id);
   res.writeHead(201, {"Content-type": "text"});

     res.end(JSON.stringify({ //risposta
       result : "OK",
       error : 0
     }));
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

app.delete('/user/:id', function(req,res){ //richiesta eliminazione utente
  var id = req.params.id;
  res.writeHead(200, {"Content-type": "text"});
  res.end("Delete " + id +" profile");
});

app.put('/user/:id', function(req, res){ //richiesta modifica utente
  var id = req.params.id;
  res.writeHead(200, {"Content-type": "text/JSON"});
  res.end("Update "+ id +" profile");
});

/*
* END User HTTP Action
*/

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
