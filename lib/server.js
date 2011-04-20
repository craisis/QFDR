var child   = require('child_process')
  , express = require('express')
  , fs      = require('fs')
  , io      = require('socket.io')
  , path    = require('path')
  , _       = require('underscore');

function sendDir(path, res, next) {
  fs.readdir(path, function(err, files){
    if(err) {
      next(err);
    } else {
      res.send(files);
    }
  });
}

function sendFile(path, res, next) {
  fs.readFile(path, function(err, data){
    if(err) {
      next(err);
    } else {
      res.contentType('application/json');
      res.send(data);
    }
  });
}

exports.run = function(){
  var server = express.createServer()
    , socket = io.listen(server);

  var contests = {};

  var contestsPath = path.resolve(__dirname, '../data/contests');
  var logbooksPath = path.resolve(process.env.HOME, '.qfdr/logbooks');

  server.get('/contests', function(req, res, next){
    sendDir(contestsPath, res, next);
  });

  server.get('/contests/:id', function(req, res, next){
    var contestPath = path.resolve(contestsPath, req.params.id, 'config.json');
    sendFile(contestPath, res, next);
  });

  server.get('/logbooks', function(req, res, next){
    sendDir(logbooksPath, res, next);
  });

  server.get('/logbooks/:id', function(req, res, next){
    var logbookPath = path.resolve(logbooksPath, req.params.id + '.json');
    sendFile(logbookPath, res, next);
  })

  server.listen(3000);
}
