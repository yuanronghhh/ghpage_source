const http          = require('http');
const path          = require("path");
const body_parser   = require("body-parser");
const cookie_parser = require("cookie-parser");
const os            = require('os');
const fs            = require("fs");
const ifaces        = os.networkInterfaces();
const express       = require("express");
const app           = express();
const port          = 6060;
const morgan        = require('morgan');
var dist_directory  = '/home/greyhound/Documents/ghpage/dist';

app.use(morgan('dev'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(cookie_parser());
app.use(express.static(path.join(dist_directory)));
app.set('views', path.join(dist_directory, 'ghpage'));
app.set('view engine', 'html');
app.engine('html',require('ejs').renderFile);

app.get("/ghpage", function(req, res){
  console.log("/ called " + Math.floor(Math.random()*100));
  res.render("index");
});

app.post("/delete_article", function(req, res, next) {
  var file_path = dist_directory + req.body.file_path;

  fs.open(file_path, 'r', function(err, fd){

    if(err) {
      if(err.code === "ENOENT"){
        return res.status(422).json({
          "msg": err.message
        });
      } else {
        return next(err);
      }
    } else {

      fs.unlink(file_path, function(err) {
        if(err) {
          return next(err);
        }
        return res.status(200).json("delete success!");
      });
    }
  });
});

app.post("/create_article", function(req, res, next) {
  var article = req.body;
  var file_path = dist_directory + "/" + article.file_name + ".md";

  if(Object.keys(article).length === 0 || !article.file_name || !article.content) {
    return res.status(422).json({
      "msg": 'incomplete infomation'
    });
  }

  fs.open(file_path, 'wx', function(err, fd){
    if(err) {
      if(err.code === "EEXIST"){
        return res.status(422).json({
          "msg": err.message
        });
      } else {
        return next(err);
      }
    }

    fs.write(fd, article.content, function(err, written, string){
      if(err) {
        return next(err);
      }

      res.status(200).json({
        msg:"add success!"
      });
    })
  });
});

app.get("/edit_article/:action", function(req, res, next){
  var article = req.body;
  var file_path = dist_directory + "/" + article.file_name + ".md";
  var act = req.params.action;

  if(Object.keys(article).length === 0 || !article.file_name || !article.content) {
    return res.status(422).json({
      "msg": 'incomplete infomation'
    });
  }

  switch(act) {
    case "show":
      showEdit();
      break;
    case "update":
      updateArticle();
      break;
    case "create":
      createArticle();
      break;
    default:
      showEdit();
      break;
  }

  return res.status(403).json({
    "msg": "Error",
    "data": ""
  });

});

app.get("*", function(req, res) {
  return res.status(404).render('404.html')
})


var iptable       = {};
app.listen(port,function(req, res){
  for (var dev in ifaces) {
    ifaces[dev].forEach(function(dt, alias) {
      if (dt.family == 'IPv4') {
        iptable[dev + (alias ? ':' + alias: '')] = dt.address;
      }
    });
  }

  console.log(iptable);
  console.log("start " + port);
});
