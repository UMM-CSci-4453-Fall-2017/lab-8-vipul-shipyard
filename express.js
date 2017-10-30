var express=require('express'),
mysql=require('mysql'),
credentials=require('./credentials.json'),
app = express(),
port = process.env.PORT || 1337;

credentials.host='ids.morris.umn.edu'; //setup database credentials

var connection = mysql.createConnection(credentials); // setup the connection
var db = "benek020";

connection.connect(function(err){if(err){console.log(error)}});

app.use(express.static(__dirname + '/public'));
app.get("/buttons",function(req,res){
  var sql = 'SELECT * FROM benek020.till_buttons';
  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});
app.get("/click",function(req,res){
  var id = req.param('id');
  var sql = 'YOUR SQL HERE'
  console.log("Attempting sql ->"+sql+"<-");
  

  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an insertion error:");
             	console.log(err);
		res.status(500).send(err);}
     else {res.send(rows);}
	 // rows is a placeholder, probably want to send price or something
  }})(res));
});

app.get("/getTrans", function(req, res){
  var ip = req.ip;
  var tableName = db + ".transaction_" + ip;
  var modelTable = db + ".transaction_model";
  var sql = "CREATE TABLE IF NOT EXISTS " + tableName + " LIKE " + modelTable + ";";

  connection.query(sql, (function(res){return function(err, rows, fields){
     if(err){ console.log("error creating transaction table: " + err); 
        res.status(500).send(err);
        return;}
    
     }})(res));

  connection.query("SELECT * FROM " + tableName + ";", (function(res){return function(err,rows, fields){
     if(err){console.log("error getting transaction: " + err);
        res.status(500).send(err);
        return;
     } else {
        res.send(rows);
     }}})(res));
});


// Your other API handlers go here!

app.listen(port);
