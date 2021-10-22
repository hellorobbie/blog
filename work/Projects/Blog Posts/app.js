//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

let posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://robbie:robisdope@cluster0.r3ufb.mongodb.net/BlogPostsDB", {useNewUrlParser: true})

const blogSchema = {
  blogTitle: String,
  blogPost: String
};

const Post = mongoose.model("post", blogSchema);

const Post1 = new Post ({
  blogTitle: "Day 1",
  blogPost: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
});

const Post2 = new Post ({
  blogTitle: "Day 2",
  blogPost: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
});

const Post3 = new Post ({
  blogTitle: "Day 3",
  blogPost: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
});

const defaultPosts = [Post1, Post2, Post3];



app.get("/", function(req, res){
  Post.find({}, function(err, foundPosts){
    if (foundPosts.length === 0){
      Post.insertMany(defaultPosts, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Succesfully added items");
        }
      });
      res.redirect("/");
    } else {
      res.render("home", {startingContent: homeStartingContent, newPosts: foundPosts});
    };
  });
});

app.get("/cgi-sys/defaultwebpage.cgi", function(req,res) {
  res.redirect("/");
});

app.get("/about", function(req, res){
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req,res){
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req,res){
  res.render("compose")
});

app.post("/compose", function(req,res){

 const post = new Post ({
   blogTitle: req.body.blogTitle,
   blogPost: req.body.blogPost
  }); 

  if (req.body.postList === "Publish") {
    post.save();
    posts.push(post);
    res.redirect("/");
  }
});

app.get("/posts/:topic", function(req,res){
  const topic = req.params.topic;
  
  // console.log(topic);
  Post.findById({_id: topic}, function(err, foundPost){
    if (foundPost) {
      // console.log(foundPost);
      res.render("post", {blogTitle: foundPost.blogTitle, blogPost: foundPost.blogPost});
    } else {
      console.log("error");
    }
  });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
console.log("Server started on port 3000");
app.listen(port);

