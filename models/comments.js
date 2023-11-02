const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema =  new Schema({
    content:{
        type:String,
        required:true
    },
    blogId:{
        type:Schema.Types.ObjectId,
        ref:'blog'
    },
    createdBy:{
        // type:String
        type:Schema.Types.ObjectId,
        ref:'user'
    }
},{timestamps:true});

const comment = mongoose.model('comment',commentSchema);
module.exports = comment;