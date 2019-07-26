var http = require("http");
var express = require('express');
var multer = require('multer');
var app = express();
app.use(express.static('public'));
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var upload = multer({dest:'./upload/'});
app.get('/index.html', function (req, res) {
    res.send('');
})

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'imageUpload'
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.post('/upload',upload.single('file'), function(req, res){
    // console.log(req.body);
    console.log(req.file);
    var sql = "INSERT INTO file (name, type, size) VALUES ('"+req.file.originalname+"', '"+req.file.mimetype+"','"+req.file.size+"')";
        connection.query(sql, function (err, result) {
          if (err)
              console.log("Not inserted");
          else{
              res.json({status:'Y'});
              console.log("data inserted");
          }
        });
});

app.get('/up',upload.single('file'), function(req, res){
  console.log(req.file);
  connection.query("SELECT * FROM file", function (err, result) {
    if (err) console.log(result);
    else{
       var data = result;
       res.json(data);
    }
  });  
})

app.delete('/delete:id',upload.single('file'), function(req,res){
  console.log(req.params);
  var sql = "DELETE FROM file WHERE id = '"+ req.params.id +"'";
  connection.query(sql, function (err, result) {
     if (err)
         console.log("Not Deleted");
     else{
         res.json({status:'Y'});
         console.log("Data Deleted");
     }
   });
})

app.listen(4000);
   
console.log("Example app listening at 4000");