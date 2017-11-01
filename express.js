var express=require('express');
mysql=require('mysql');
var credentials=require('./credentials.json');
Promise = require('bluebird');
var using = Promise.using;

app = express(),
port = process.env.PORT || 1337;

credentials.host='ids.morris.umn.edu'; //setup database credentials

Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection(credentials); // setup the connection
var db = "benek020";
var pool = mysql.createPool(credentials);

//connection.connect(function(err){if(err){console.log(error)}});
var getConnection = function(){
	return pool.getConnectionAsync().disposer(
		function(connection){ return connection.release();}
	);
};

var query = function(sql){
	return using(getConnection(), function(connection){
		return connection.queryAsync(sql);
	});
};
var endPool = function(){
	pool.end(function(err){});
};

var getDatabase = function(){
	var toReturn = query("USE " + db + ";")
	console.log(toReturn);
	return toReturn;};

 

app.use(express.static(__dirname + '/public'));

app.get("/buttons",function(req,res){
  var sql = 'SELECT * FROM benek020.till_buttons';
//  connection.query(sql,(function(res){return function(err,rows,fields){
//     if(err){console.log("We have an error:");
//             console.log(err);}
//     res.send(rows);
//  }})(res));
  query(sql).then(function(results){ 
    res.send(results); 
    endPool; });
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
  console.log(ip);
  var tableName = db + ".transaction_" + ip;
  var modelTable = db + ".transaction_model";
  var sqlMake = "CREATE TABLE IF NOT EXISTS " + tableName + " LIKE " + modelTable + ";";
  var sqlGet = "SELECT * FROM " + tableName + ";";

//  connection.query("USE " + db + ";", (function(err, rows, fields){
//    if (err){ console.log("error switching database: " + err);
//       res.status(500).send(err);
//   }}));
   query(sqlMake)
   .then(query(sqlGet))
   .then(function(results){ (res.send(results)); endPool;});
//  connection.query(sql, (function(res){return function(err, rows, fields){
//     if(err){ console.log("error creating transaction table: " + err); 
//        res.status(500);
//	res.senΘd(err);
//        return;}
    
//     }})(res));

//  connection.query("SELECT * FROM " + tableName + ";", (function(res){return function(err,rows, fields){
//     if(err){console.log("error getting transaction: " + err);
//        res.status(500);
//	res.send(err);
 //       return;
//     } else {
//        res.send(rows);
//     }}})(res));
});


// Your other API handlers go here!

app.listen(port);
