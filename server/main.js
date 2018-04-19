import Neo4j from './DBDriver/Neo4j';
import fs from 'fs';
import muilter from'./Util/Multer';
import path from'path';
import { Base64 } from 'js-base64';

var templates = {};
var styles = {};
var icons = [];
const templatePath = './server/Config/templates.json';
const stylePath = './server/Config/styles.json';
const iconPath = './public/icons';
const imagePath = './public/images';

function ReadCongfigFile (filename)
{
	if (fs.existsSync(filename)){
		  try{
			let __data = fs.readFileSync(filename, 'utf8');
			return JSON.parse(__data);
		}	
		catch (err){
			console.log(err);
		}
	}

	return {};
}

function GetIconList(dir)
{
	let __root = path.join(dir)  
	let __pa = fs.readdirSync(__root);
	let __result = [];

	__pa.forEach(function(ele,index){  
		let __info = fs.statSync(__root+"/"+ele)      
		if(__info.isDirectory()){  
			console.log("dir: "+ele)  
		}else{
			__result.push('icons/' + ele);
			console.log("file: "+ele)  
		}     
	}) 

	return __result;
}

templates = ReadCongfigFile(templatePath);
styles = ReadCongfigFile(stylePath);
icons = GetIconList(iconPath);

console.log(icons);

var express = require('express');
var app = express();
var uploadIcon = muilter(iconPath).single('file');
var uploadImage = muilter(imagePath).single('file');

const DBDriver = new Neo4j('bolt://127.0.0.1', 'neo4j', 'neo.yuukosan.4j');

var staticDir = express.static('public', {lastModified: false, etag:false});
app.use(staticDir);
console.log(staticDir)

app.get('/', function (req, res) {
	res.sendfile("index.html");
});

app.get('/example?:cypher', function (req, res) {
	DBDriver.runStatement(Base64.decode(req.query.cypher), {}, res);
});

app.get('/template', function (req, res) {
	let __result = {
		templates: templates,
		labels: DBDriver._labels,
		propertyKeys: DBDriver._propertyKeys,
		relationshipTypes: DBDriver._relationshipTypes,
	}
	res.jsonp(__result);
});

app.get('/style', function (req, res) {
	let __result = {
		styles: styles,
	}
	
	res.jsonp(__result);
});

app.get('/icon', function (req, res) {
	let __result = {
		icons: icons,
	}
	
	res.jsonp(__result);
});

app.get('/template/save?:template', function (req, res) {

});

app.get('/addNode?:node', function (req, res) {
	try{
		let __json = JSON.parse(Base64.decode(req.query.node));
		DBDriver.addSingleNode(__json, res);
	}	
	catch (err){
		console.log(err);
		res.send('error');
	}
});

app.get('/mergeNode?:node', function (req, res) {
	try{
		let __json = JSON.parse(Base64.decode(req.query.node));
		DBDriver.mergeSingleNode(__json, res);
	}	
	catch (err){
		console.log(err);
		res.send('error');
	}
});

app.get('/deleteNode?:nodes', function (req, res) {
	try{
		let __json = JSON.parse(Base64.decode(req.query.nodes));
		DBDriver.deleteNodes(__json, res);
	}	
	catch (err){
		console.log(err);
		res.send('error');
	}
});

app.get('/addEdge?:edge', function (req, res) {
	try{
		let __json = JSON.parse(Base64.decode(req.query.edge));
		DBDriver.addSingleEdge(__json, res);
	}	
	catch (err){
		console.log(err);
		res.send('error');
	}
});

app.get('/mergeEdge?:edge', function (req, res) {
	try{
		let __json = JSON.parse(Base64.decode(req.query.edge));
		DBDriver.mergeSingleEdge(__json, res);
	}	
	catch (err){
		console.log(err);
		res.send('error');
	}
});

app.get('/deleteEdge?:edges', function (req, res) {
	try{
		let __json = JSON.parse(Base64.decode(req.query.edges));
		DBDriver.deleteEdges(__json, res);
	}	
	catch (err){
		console.log(err);
		res.send('error');
	}
});

app.post('/upload_icon',  function (req, res) {
	//console.log(req)
	uploadIcon(req, res, function (err) {
        //添加错误处理
		if (err) {
			res.send('err');
			return  console.log(err);
		} 
        //文件信息在req.file或者req.files中显示。
		res.send('文件上传成功');
		
		console.log('==============================================')
		console.log(path.join('public', 'icon/'+req.file.filename))
		// icons.push('icon/'+req.file.filename);
		// app.use(express.static('public'));
		
		icons = GetIconList(iconPath);
		console.log('==============================================')
	})
});

app.post('/upload_image',  function (req, res) {
	//console.log(req)
	uploadImage(req, res, function (err) {
        //添加错误处理
		if (err) {
			res.send('err');
			return  console.log(err);
		} 
        //文件信息在req.file或者req.files中显示。
		res.send(req.file.filename);
	})
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});