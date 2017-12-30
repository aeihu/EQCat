var express = require('express');
var app = express();
//const neo4j = require('./DBDriver/Neo4j');

import Neo4j from './DBDriver/Neo4j';

const DBDriver = new Neo4j('bolt://localhost', 'neo4j', 'neo.yuukosan.4j');

app.get('/', function (req, res) {
  res.send('Hello Wxssosrld!');
  DBDriver.runStatement('MATCH (n) RETURN n LIMIT 25');
});

var cb0 = function (req, res, next) {
    console.log('CB0');
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
  

app.use(express.static('public'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});