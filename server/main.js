import Neo4j from './DBDriver/Neo4j';
import fs from 'fs';

var templates = {};
var styles = {};
const templatePath = './server/Config/templates.json';
const stylePath = './server/Config/styles.json';

function ReadCongfigFile (path)
{
	if (fs.existsSync(path)){
		  try{
			let __data = fs.readFileSync(path, 'utf8');
			return JSON.parse(__data);
		}	
		catch (err){
			console.log(err);
		}
	}

	return {};
}

templates = ReadCongfigFile(templatePath);
styles = ReadCongfigFile(stylePath);

var express = require('express');
var app = express();

const DBDriver = new Neo4j('bolt://127.0.0.1', 'neo4j', 'neo.yuukosan.4j');

app.use(express.static('public'));
app.get('/', function (req, res) {
	console.log('11111');
	res.sendfile("index.html");
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
	let __result = {
		templates: templates,
		labels: DBDriver._labels,
		propertyKeys: DBDriver._propertyKeys,
	}
	res.jsonp(__result);
});

app.get('/style', function (req, res) {
	let __result = {
		styles: styles,
	}
	
	res.jsonp(__result);
});

app.get('/template/save?:template', function (req, res) {
	console.log(req.query.template);
	
	try{
		let __json = JSON.parse(req.query.template);

		for (let key in __json){
			templates[key] = __json[key]; 
		}

		let __data = fs.writeFile(templatePath, 'utf8');
		
		fs.writeFile(templatePath, 'Hello Node.js', (err) => {
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