
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send('something');
  });
 wss.on('idPermission', function incoming(data){
  console.log('received: %s', message);
   ws.send('permit Id');
 })

});

module.exports = server
