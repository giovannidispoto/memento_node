var mongoose = require('mongoose')
, crypto = require('crypto')
, ObjectId = mongoose.Schema.ObjectId
, ObjId = mongoose.Types.ObjectId
, salt = 'mementoauderesemper'
, sha512 = require('js-sha512');

  var userSchema = new mongoose.Schema({
     _id : String,
     name : String,
     surname: String,
     e_mail: String,
     password: String,
     date_of_birth: Date,
     avatar: String,
     sex: Boolean,
     sessions : { ip: String, expire: Date,  }
  });



 // funzione per effettuare l'autenticazione
  userSchema.methods.auth = function(password, callback){
    var pass = sha512 (password + salt);
    if(pass == this.password){
      callback(true);
    }else{
      callback(false);
    }
}

   //funzione per ottenere tutti gli utenti
  userSchema.statics.findAll = function(callback){
    return this.model('user').find({}, callback);
  }

  //funzione per ottenere tutte le info di un utente
  userSchema.statics.findUser = function(user_id, callback){
    return this.model('user').findOne({ _id : user_id }, callback);
  }

  userSchema.methods.changePassword = function(user_id, password ,callback){ //metodo per cambiare la password
    this.password = sha512(password+salt);
    return this.save(callback);
  }

  userSchema.methods.updateProfile = function(avatar, name, surname, e_mail, user_id, date_of_birth, callback){
    var user = this.model('user').findOne({_id : user_id});

    user.avatar = avatar;
    user.name = name;
    user.surname = surname;
    user.e_mail = e_mail;
    user.date_of_birth  = date_of_birth;

    return this.model('user').update({_id : user_id}, user, callback);
  }

  var User = mongoose.model('user', userSchema);


  module.exports = User;
