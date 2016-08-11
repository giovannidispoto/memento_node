var mongoose = require('mongoose')
, crypto = require('crypto')
, ObjectId = mongoose.Schema.ObjectId
, ObjId = mongoose.Types.ObjectId
, salt = 'mementoauderesemper'
, sha512 = crypto.createHmac('sha512', salt);

  var userSchema = new mongoose.Schema({
     _id : String,
     name : String,
     surname: String,
     e_mail: String,
     password: String,
     date_of_birth: Date,
     avatar: String,
     sex: Boolean,
     sessions : { ip: String, }
  });



 // funzione per effettuare l'autenticazione
  userSchema.methods.authUser = function(user, password, callback){
    password = sha512.update(password).digest('hex');
    return this.model('user').findOne({_id : user, password : password}, callback);
  }
   //funzione per ottenere tutti gli utenti
  userSchema.statics.findAll = function(callback){
    return this.model('user').find({}, callback);
  }

  //funzione per ottenere tutte le info di un utente
  userSchema.statics.findUser = function(user_id, callback){
    return this.model('user').find({ _id : user_id }, callback);
  }

  userSchema.methods.changePassword = function(user_id, password ,callback){ //metodo per cambiare la password
    var user = this.model('user').find({_id : user_id});
    sha512.update(password);
    user.password = sha512.digest('hex');
    return this.model('user').update({_id: user_id}, user, callback);
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
