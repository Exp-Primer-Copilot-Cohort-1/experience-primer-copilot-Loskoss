// Create web server
// Run: node comments.js
// Open browser and go to: http://localhost:3000
// Output: Hello World
// To stop server: Ctrl+C

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var comments = require('./comments.json');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var path = url.parse(request.url).pathname;
  var query = url.parse(request.url).query;

  switch(path){
    case '/':
      fs.readFile(__dirname + '/index.html', function(error, data){
        if (error){
          response.writeHead(500);
          response.end('Error: ' + error);
          return;
        }
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(data, 'utf-8');
      });
      break;
    case '/comments':
      if (request.method === 'POST'){
        var body = '';
        request.on('data', function(data){
          body += data;
          if (body.length > 1e6){
            request.connection.destroy();
          }
        });
        request.on('end', function(){
          var post = qs.parse(body);
          comments.push(post.comment);
          fs.writeFile(__dirname + '/comments.json', JSON.stringify(comments), function(error){
            if (error){
              response.writeHead(500);
              response.end('Error: ' + error);
              return;
            }
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('Success');
          });
        });
      } else {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(comments));
      }
      break;
    default:
      response.writeHead(404);
      response.end('Not found');
      break;
  }
});

// Listen on port 3000, IP defaults to