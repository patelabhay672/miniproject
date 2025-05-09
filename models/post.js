const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
 user:{
    type:mongoose.Schema.ObjectId,
    ref:'user'
 },
 date:{
    type:Date,
    default:Date.now
 },
 content:String,
 likes:[
    {
        type:mongoose.Schema.ObjectId,
        ref:"user"
    }
 ]
 
});

module.exports = mongoose.model("post", userSchema);
