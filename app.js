
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    let event = data.event;
    let pkg_data = data.data;
    console.log('received: %s', pkg_data);

    ws.send(JSON.stringify({emitterEvent: "permitID", emitData: "HEYYA"}));
  });
 

});

module.exports = server
