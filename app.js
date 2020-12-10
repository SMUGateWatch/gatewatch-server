
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    let parsedData = data.json();
    console.log('received: %s', parsedData.event);
    console.log('received: %s', parsedData.data);
    ws.send('something');
  });
 

});

module.exports = server
