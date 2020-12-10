
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const connectedClient = []

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    let parsedData = JSON.parse(data);
    console.log('received: %s', parsedData.data.name);

    ws.send(JSON.stringify({event: "permitID", data: "verified"}));
  });
 

});

module.exports = server
