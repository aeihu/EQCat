import Neo4j from './DBDriver/Neo4j';
import fs from 'fs';

var template = {};

if (fs.existsSync('./server/template.json')){
  	try{
		let __data = fs.readFileSync('./server/template.json', 'utf8');
		template = JSON.parse(__data);
	}	
	catch (err){
		console.log(err);
	}
}

var express = require('express');
var app = express();

const DBDriver = new Neo4j('bolt://localhost', 'neo4j', 'neo.yuukosan.4j');

app.use(express.static('public'));
app.get('/', function (req, res) {
	console.log('11111');
	//res.send('Hello=!');
	res.sendfile("index.html");
	//console.log(req);
	// console.log(res);
	//res.send(DBDriver.runStatement('MATCH (n) RETURN n LIMIT 25'));
});

var cb0 = function (req, res, next) {
    console.log('CBdd0');
    next();
}
  
var cb1 = function (req, res, next) {
    console.log('CB1');
    next();
}
  
var cb2 = function (req, res) {
    res.send('Hello from C!');
}
  
app.get('/example/c', [cb0, cb1, cb2]);

app.get('/example?:cypher', function (req, res) {
  console.log(req.query.cypher);
  DBDriver.runStatement(req.query.cypher, res);
});

app.get('/template', function (req, res) {
	res.jsonp(template);
});

app.get('/template/save?:template', function (req, res) {
	console.log(req.query.template);
	
	try{
		let __json = JSON.parse(req.query.template);

		for (let key in __json){
			template[key] = __json[key]; 
		}

		let __data = fs.writeFile('./server/template.json', 'utf8');
		
		fs.writeFile('./server/template.json', 'Hello Node.js', (err) => {
			if (err) {
				console.log(err);
				res.send('error');
			}
			else{
				res.send('OK');
				console.log('The file has been saved!');
			}
		  });
	}	
	catch (err){
		console.log(err);
		res.send('error');
	}
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});