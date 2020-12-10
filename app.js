
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const connectedClient = []

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    let parsedData = JSON.parse(data);
    let event = parsedData.event;
    let receivedData = parsedData.data;
    if (event == "verifyID"){  
      console.log(`ID was sent for verificaiton : ${receivedData.idScanned}`);
      ws.send(JSON.stringify({event: "permitID", data: "verified"}));
    }
    if (event == "gateBusy") {
      console.log(`gate ${receivedData.gate} was set its availability to ${receivedData.availability}`);
 
}
    
  });
 

});

module.exports = server
