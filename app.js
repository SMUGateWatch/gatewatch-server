
const http = require('http');
const WebSocket = require('ws');
const monitoringClient = require('./lib/monitors');
const gate = require('./lib/gates');
const server = http.createServer();
const wss = new WebSocket.Server({ server });

const connectedMonitors = []
const connectedGates = []
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    let parsedData = JSON.parse(data);
    let event = parsedData.event;
    let receivedData = parsedData.data;
   if(receivedData.client === 'GATE')   connectedGates.push(ws);
   if(receivedData.client === 'MONITOR')   connectedMonitors.push(ws);

   console.log(connectedGates)
   console.log(connectedMonitors)
    if (event == "verifyID"){  
      console.log(`ID was sent for verificaiton : ${receivedData.idScanned}`);
      ws.send(JSON.stringify({event: "permitID", data: "verified"}));
    }
    if (event == "gateBusy") {
      console.log(`gate ${receivedData.gate} was set its availability to ${receivedData.availability}`);
      ws.send(JSON.stringify({event: "permitID", data: "verified"}));
      wss.clients.forEach((client)=>{
        if (client !== ws && ws.readyState == WebSocket.OPEN){
          ws.send(JSON.stringify({event: "broadcastStatusToMonitor", data: "verified"}));
        } 
      })
      ws.send(JSON.stringify({event: "disableRFID", data: "verified"}));
}
if (event == "sendData") {
  console.log(`gate ${receivedData.gate} was received `);
  wss.clients.forEach((client)=>{
    if (client !== ws && ws.readyState == WebSocket.OPEN){
      ws.send(JSON.stringify({event: "broadcastDataToMonitor", data: "verified"}));
    } 
  })
} 
  });
 ws.on('disconnect', ()=>{

 })

});

module.exports = server
