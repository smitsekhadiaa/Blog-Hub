const mongoose= require('mongoose')
const Schema=mongoose.Schema;  //Schema will define the structure of documents we are goint to later store inside our collection
const blogSchema=new Schema({   //creating new instance of Schema
    title:{
        type:String,            //Schema defines the structure of our content, modal surrrounds it and provides us with a interface to communicate with the data base cllection
        required:true
    },
    snippet:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    }
},{timestamps: true});

const Blog= mongoose.model('Blog',blogSchema);
module.exports=Blog;