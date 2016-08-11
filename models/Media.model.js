var mongoose = require('mongoose')
, ObjectId = mongoose.Schema.ObjectId;

var mediaSchema = new mongoose.Schema({
    user_id : {},
    description: String,
    hashtags : [String],
    media: String,
    date: Date,
    likes: [String],
    comments : [{ user_id: String, comment: String }]
});

mediaSchema.method.findPhotosByUser = function(user_id, callback){
    return this.model('media').find({user_id : user_id}, callback);
}

var Media = mongoose.model('media', mediaSchema);
module.exports = Media;
