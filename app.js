
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    
    console.log('received: %s', data);

    ws.send('something');
  });
 

});

module.exports = server
