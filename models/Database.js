
var mongoose = require('mongoose');

var Database = function(err, conn){
    var connection = mongoose.connection;

    connection.on("error", err("Error Connection!"));

    connection.once("open", function(){
        conn(mongoose);
    })
}
