/*

  Middleware used for checking authentication

*/

var routes = []
  , User = require('../models/User.model');

AuthUser = function(){

}

/*

  Check authentication using token assigned to user

*/
AuthUser.prototype.check = function(req,res,next){

  if(routes.indexOf(req.path) == -1){
    var token = req.param("token");
    var user_id = req.param("user_id");

    User.isValidToken(user_id, token, function(err, result){
        if(err) throw err;
        if(!result){
          res.writeHead(500, {"Content-type":"text"}); //HTTP response

          res.end(JSON.stringify({
            result : "ERR",
            error : {
              code: 2,
              errMsg: "you are not authenticated"
            }
          }));
        }
        return next();
    });
  }

  return next();

}
 /*
    setting routes that don't need authentication.
    the parameter execpt_routes is an array.

    e.g.
    authuser.execpt(['/', '/foo/bar'])
 */
AuthUser.prototype.except = function(except_routes){
  routes = except_routes;
}


module.exports = AuthUser;
