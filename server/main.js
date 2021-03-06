import Neo4j from './DBDriver/Neo4j';
import fs from 'fs';
import muilter from'./Util/Multer';
import path from'path';
import { Base64 } from 'js-base64';
import GlobalConstant from'../Common/GlobalConstant';
import log4js from './Util/Log4js';
import md5 from'md5';

class EQCarServer{
    constructor(){
		this.express = require('express');
		this.app = this.express();
		this.iconUploader = muilter(this.iconPath).single('file');
		this.imageUploader = muilter(this.imagePath).single('file');
	}
	
	DBDriver = null;
	templates = {};
	styles = {};
	favorites = {};
	icons = [];
	configPath = './server/Config/config.json';
	templatePath = './server/Config/templates.json';
	favoritesPath = './server/Config/favorites.json';
	stylePath = './server/Config/styles.json';
	iconPath = './public/icons';
	imagePath = './public/images';
	////////////////////////////////////////////////
	express = null;
	app = null;
	iconUploader = null;
	imageUploader = null;
	webServer = null;

	readCongfigFile (filename)
	{
		if (fs.existsSync(filename)){
			try{
				let __data = fs.readFileSync(filename, 'utf8');
				return JSON.parse(__data);
			}	
			catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <' + filename + '>');
			}
		}

		return {};
	}
	
	getIconList(dir)
	{
		let __root = path.join(dir);
		let __pa = fs.readdirSync(__root);
		let __result = [];

		__pa.forEach(function(ele,index){  
			let __info = fs.statSync(__root+"/"+ele)      
			if(!__info.isDirectory()){  
				__result.push('icons/' + ele);
			}     
		});

		return __result;
	}
	
	connectNeo4j(){
		let __result = true;
		let __config = this.readCongfigFile(this.configPath);
		this.DBDriver = new Neo4j();
		try{
			__result = this.DBDriver.login(__config.Neo4j.address, __config.Neo4j.username, __config.Neo4j.password);
		}catch(err){
			__result = false;
			log4js.logger.error(err.name + ': ' + err.message + ' <connectNeo4j>');
		}

		return __result;
	}

	init()
	{
		log4js.logger.info('===== Initialize EQCarServer =====');
		log4js.logger.info('Loading template files');
		this.templates = this.readCongfigFile(this.templatePath);
		log4js.logger.info('Loading style files');
		this.styles = this.readCongfigFile(this.stylePath);
		log4js.logger.info('Loading favorites files');
		this.favorites = this.readCongfigFile(this.favoritesPath);
		log4js.logger.info('Loading icon files');
		this.icons = this.getIconList(this.iconPath);

		if (Object.keys(this.styles).length < 1){
			this.styles = {
				nodes:{},
				edges:{}
			}
		}

		log4js.logger.info('connecting database');
		this.connectNeo4j();
		
		log4js.logger.info('start web server');
		this.app.use(this.express.static('public', {lastModified: false, etag:false}));
		this.app.get('/', function (req, res) {
			res.sendfile("index.html");
		}.bind(this));
		
		this.app.get('/example?:cypher', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.cypher));
				this.DBDriver.runStatement(__json.statement, {}, res);
			}catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <setStyle>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/template', function (req, res) {
			let __result = {
				//templates: this.templates,
				labels: this.DBDriver._labels,
				propertyKeys: this.DBDriver._propertyKeys,
				relationshipTypes: this.DBDriver._relationshipTypes,
			}
			
			res.send(Base64.encodeURI(JSON.stringify(__result)));
		}.bind(this));
		
		this.app.get('/getTemplate', function (req, res) {
			if (!this.templates.hasOwnProperty('nodes')){
				this.templates['nodes'] = {};
			}

			if (!this.templates.hasOwnProperty('edges')){
				this.templates['edges'] = {};
			}

			res.send(Base64.encodeURI(JSON.stringify(this.templates)));
		}.bind(this));
		
		this.app.get('/setTemplate?:template', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.template));
				if (!this.templates.hasOwnProperty(__json.mode)){
					this.templates[__json.mode] = {};
				}

				this.templates[__json.mode][__json.key] = __json.value
				
				fs.writeFile(this.templatePath, JSON.stringify(this.templates, null, 2),
					function(err, written, buffer){
						if(err) {
							log4js.logger.error(err.name + ': ' + err.message + ' <saveTemplate>');
						}else{
							log4js.logger.info('save template: ' + __json.key);
						}
					}
				);
				res.send(Base64.encodeURI('{}'));
			}catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <saveTemplate>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/getFavorites', function (req, res) {
			let __result = {
				favorites: this.favorites,
			}
			
			res.send(Base64.encodeURI(JSON.stringify(__result)));
		}.bind(this));

		this.app.get('/addFavoritesDir', function (req, res) {
			try{
				let __i = 0;
				let __folder = 'NewFolder';
				while (this.favorites.hasOwnProperty(__folder)){
					__i++;
					__folder = 'NewFolder' + __i;
				}

				this.favorites[__folder] = [];

				fs.writeFile(this.favoritesPath, JSON.stringify(this.favorites, null, 2),
					function(err, written, buffer){
						if(err) {
							log4js.logger.error(err.name + ': ' + err.message + ' <addFavoritesDir>');
						}else{
							log4js.logger.info('add favorite dir: "' + __folder + '"');
						}
					}
				);
				
				res.send(Base64.encodeURI(JSON.stringify({folder: __folder})));
			}catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <addFavoritesDir>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));

		this.app.get('/addFavorites?:cypher', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.cypher));
				if (!this.favorites.hasOwnProperty('default')){
					this.favorites.default = [];
				}

				this.favorites.default.push(__json.statement);
				this.favorites.default.push(__json.statement);
				
				fs.writeFile(this.favoritesPath, JSON.stringify(this.favorites, null, 2),
					function(err, written, buffer){
						if(err) {
							log4js.logger.error(err.name + ': ' + err.message + ' <addFavorites>');
						}else{
							log4js.logger.info('add favorite: ' + __json.statement);
						}
					}
				);
				res.send(Base64.encodeURI('{}'));
			}catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <addFavorites>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));

		this.app.get('/removeFavoritesDir?:data', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.data));
				if (this.favorites.hasOwnProperty(__json.key)){
					delete this.favorites[__json.key];

					fs.writeFile(this.favoritesPath, JSON.stringify(this.favorites, null, 2),
						function(err, written, buffer){
							if(err) {
								log4js.logger.error(err.name + ': ' + err.message + ' <removeFavoritesDir>');
							}else{
								log4js.logger.info('remove favorite dir: "' + __json.key + '"');
							}
						}
					);
				}else{
					log4js.logger.warn('there is no "' + __json.key + '" folder');
				}
				
				res.send(Base64.encodeURI('{}'));
			}catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <removeFavoritesDir>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));

		this.app.get('/removeFavorites?:data', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.data));
				if (this.favorites.hasOwnProperty(__json.key)){
					this.favorites[__json.key].splice(__json.index, 2);

					fs.writeFile(this.favoritesPath, JSON.stringify(this.favorites, null, 2),
						function(err, written, buffer){
							if(err) {
								log4js.logger.error(err.name + ': ' + err.message + ' <removeFavorites>');
							}else{
								log4js.logger.info('remove favorite: ' + __json.key);
							}
						}
					);
				}else{
					log4js.logger.warn('there is no "' + __json.key + '" folder');
				}
				
				res.send(Base64.encodeURI('{}'));
			}catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <removeFavorites>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/moveFavorites?:data', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.data));
				let __key = '';
				let __val = '';
				if (this.favorites.hasOwnProperty(__json.oldDir)){
					__key = this.favorites[__json.oldDir][__json.oldIndex];
					__val = this.favorites[__json.oldDir][__json.oldIndex+1];
					this.favorites[__json.oldDir].splice(__json.oldIndex, 2);

					if (__json.newIndex < 0){
						this.favorites[__json.newDir].push(__key);
						this.favorites[__json.newDir].push(__val);
					}else{
						if (__json.newDir != __json.oldDir){
							this.favorites[__json.newDir].splice(__json.newIndex+2, 0, __val);
							this.favorites[__json.newDir].splice(__json.newIndex+2, 0, __key);
						}else{
							this.favorites[__json.newDir].splice(__json.newIndex, 0, __val);
							this.favorites[__json.newDir].splice(__json.newIndex, 0, __key);
						}
					}

					fs.writeFile(this.favoritesPath, JSON.stringify(this.favorites, null, 2),
						function(err, written, buffer){
							if(err) {
								log4js.logger.error(err.name + ': ' + err.message + ' <moveFavorites>');
							}else{
								log4js.logger.info('move favorite: ' + __key);
							}
						}
					);
				}else{
					log4js.logger.warn('there is no "' + __json.oldDir + '" folder');
				}
				
				res.send(Base64.encodeURI('{}'));
			}catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <moveFavorites>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/editFavoritesDir?:data', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.data));
				if (this.favorites.hasOwnProperty(__json.oldName)){
					let __txt = JSON.stringify(this.favorites).replace('"' + __json.oldName + '":', '"' + __json.newName + '":');
					this.favorites = JSON.parse(__txt);
					fs.writeFile(this.favoritesPath, JSON.stringify(this.favorites, null, 2),
						function(err, written, buffer){
							if(err) {
								log4js.logger.error(err.name + ': ' + err.message + ' <editFavoritesDir>');
							}else{
								log4js.logger.info('edit favorite dir: "' + __json.oldName + '" rename to "' + __json.newName + '"');
							}
						}
					);
				}else{
					log4js.logger.warn('there is no "' + __json.oldName + '" folder');
				}
				
				res.send(Base64.encodeURI('{}'));
			}catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <editFavoritesDir>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));

		this.app.get('/editFavorites?:data', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.data));
				if (this.favorites.hasOwnProperty(__json.key)){
					this.favorites[__json.key][__json.index] = __json.name;

					fs.writeFile(this.favoritesPath, JSON.stringify(this.favorites, null, 2),
						function(err, written, buffer){
							if(err) {
								log4js.logger.error(err.name + ': ' + err.message + ' <editFavorites>');
							}else{
								log4js.logger.info('edit favorite: ' + __json.key);
							}
						}
					);
				}else{
					log4js.logger.warn('there is no "' + __json.key + '" folder');
				}
				
				res.send(Base64.encodeURI('{}'));
			}catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <editFavorites>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));

		this.app.get('/getStyles', function (req, res) {
			let __result = {
				styles: this.styles,
			}
			
			res.send(Base64.encodeURI(JSON.stringify(__result)));
		}.bind(this));
		
		this.app.get('/setStyle?:style', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.style));
				if (__json.mode == GlobalConstant.mode.node){
					if (!this.styles.nodes.hasOwnProperty(__json.label)){
						this.styles.nodes[__json.label] = GlobalConstant.defaultNodeStyle();
					}
		
					switch (__json.property){
						case 'size_property':
							this.styles.nodes[__json.label].size_property = __json.value;
							break;
						case 'size_level':
							this.styles.nodes[__json.label].size_level = __json.value;
							break;
						default:
							this.styles.nodes[__json.label][__json.property] = __json.value;
							break;
					}
				}else{
					if (!this.styles.edges.hasOwnProperty(__json.type)){
						this.styles.edges[__json.type] = GlobalConstant.defaultEdgeStyle();
					}
		
					switch (__json.property){
						case 'stroke_property':
							this.styles.edges[__json.type].stroke_property = __json.value;
							break;
						case 'stroke_level':
							this.styles.edges[__json.type].stroke_level = __json.value;
							break;
						default:
							this.styles.edges[__json.type][__json.property] = __json.value;
							break;
					}
				}
		
				fs.writeFile(this.stylePath, JSON.stringify(this.styles, null, 2),
					function(err, written, buffer){
						if(err) {
							log4js.logger.error(err.name + ': ' + err.message + ' <setStyle>');
						}else{
							log4js.logger.info('set ' + (GlobalConstant.mode.node == __json.mode ? "node's " + __json.label : "edge's " + __json.type) +
								' style (' + __json.property + ': ' + __json.value + ')');
						}
					}
				);
				res.send(Base64.encodeURI('{}'));
			}catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <setStyle>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/icon', function (req, res) {
			let __result = {
				icons: this.icons,
			}
			
			res.send(Base64.encodeURI(JSON.stringify(__result)));
		}.bind(this));
		
		this.app.get('/expand?:node', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.node));
				this.DBDriver.expandNode(__json, res);
			}	
			catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <expand>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/addNode?:node', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.node));
				this.DBDriver.addSingleNode(__json, res);
			}	
			catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <addNode>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/mergeNode?:node', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.node));
				this.DBDriver.mergeSingleNode(__json, res);
			}	
			catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <mergeNode>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/preDeleteNode?:nodes', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.nodes));
				this.DBDriver.preDeleteNodes(__json, res);
			}catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <preDeleteNode>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/deleteNode?:nodes', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.nodes));
				this.DBDriver.deleteNodes(__json, res);
			}catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <deleteNode>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/addEdge?:edge', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.edge));
				this.DBDriver.addSingleEdge(__json, res);
			}
			catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <addEdge>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/directEdge?:edge', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.edge));
				this.DBDriver.directSingleEdge(__json, res);
			}	
			catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <directEdge>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/mergeEdge?:edge', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.edge));
				this.DBDriver.mergeSingleEdge(__json, res);
			}	
			catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <mergeEdge>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/deleteEdge?:edges', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.edges));
				this.DBDriver.deleteEdges(__json, res);
			}
			catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <deleteEdge>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.get('/deleteNE?:NE', function (req, res) {
			try{
				let __json = JSON.parse(Base64.decode(req.query.NE));
				this.DBDriver.deleteNodesAndEdges(__json, res);
			}	
			catch (err){
				log4js.logger.error(err.name + ': ' + err.message + ' <deleteNE>');
				res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
			}
		}.bind(this));
		
		this.app.post('/upload_icon',  function (req, res) {
			this.iconUploader(req, res, function (err) {
				if (err) {
					log4js.logger.error(err.name + ': ' + err.message + ' <upload_icon>');
					res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
					return;
				}
				
				let __filename = this.iconPath + '/' + req.file.filename;
				if (fs.existsSync(__filename)){
					fs.readFile(__filename, function(err, buf) {
						let __fileFormat = (req.file.filename).split(".");
						let __newFilename =  md5(buf) + "." + __fileFormat[__fileFormat.length - 1]
						fs.rename(__filename, this.iconPath + '/' + __newFilename, function(err){
							if (err) {
								log4js.logger.error(err.name + ': ' + err.message + ' <upload_icon>');
								res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
								return;
							}
							
							res.send(Base64.encodeURI(JSON.stringify({filename:__newFilename})));
							this.icons = this.getIconList(this.iconPath);
						}.bind(this));
					}.bind(this));
				}else{
					log4js.logger.error('fsError: ' + req.file.filename + ' not found <upload_icon>');
					res.send(Base64.encodeURI(JSON.stringify({error: 'fsError', message:req.file.filename + ' not found'})));
				}
			}.bind(this))
		}.bind(this));
		
		this.app.post('/upload_image',  function (req, res) {
			this.imageUploader(req, res, function (err) {
				if (err) {
					log4js.logger.error(err.name + ': ' + err.message + ' <upload_image>');
					res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
					return;
				}
				
				let __filename = this.imagePath + '/' + req.file.filename;
				if (fs.existsSync(__filename)){
					fs.readFile(__filename, function(err, buf) {
						let __fileFormat = (req.file.filename).split(".");
						let __newFilename =  md5(buf) + "." + __fileFormat[__fileFormat.length - 1]
						fs.rename(__filename, this.imagePath + '/' + __newFilename, function(err){
							if (err) {
								log4js.logger.error(err.name + ': ' + err.message + ' <upload_image>');
								res.send(Base64.encodeURI(JSON.stringify({error: err.name, message:err.message})));
								return;
							}
							
							res.send(Base64.encodeURI(JSON.stringify({filename:__newFilename})));
						}.bind(this));
					}.bind(this));
				}else{
					log4js.logger.error('fsError: ' + req.file.filename + ' not found <upload_image>');
					res.send(Base64.encodeURI(JSON.stringify({error: 'fsError', message:req.file.filename + ' not found'})));
				}
			}.bind(this))
		}.bind(this));
		
		log4js.logger.info('===== Initialize EQCarServer finish =====');
		return true;
	}

	run()
	{
		this.webServer = this.app.listen(3000, function () {
			let host = this.webServer.address().address;
			let port = this.webServer.address().port;
		
			log4js.logger.info('Run Server listening at http://' + host + ':' + port);
		}.bind(this));
	}

	close(){
		if (this.DBDriver != null){
			this.DBDriver.close();
		}
	}
}

var svr = new EQCarServer();

if (svr.init()){
	svr.run();
}