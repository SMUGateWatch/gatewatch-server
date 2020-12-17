const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const WebSocket = require("ws");
//const monitoringClient = require("./lib/monitors");
//const gate = require("./lib/gates");
const server = http.createServer();
const wss = new WebSocket.Server({ server });
const { MongoClient } = require("mongodb");
//const {employeeRegistry, studentRegistry} = require('./models/schemas')
const connectedMonitors = [];
const connectedGates = [];

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function createListing(client, newListing) {
  const result = await client
    .db("vehicle-registry")
    .collection("employee-registry")
    .insertOne(newListing);
  console.log(
    `New listing created with the following id: ${result.insertedId}`
  );
}
async function main() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    client.isConnected()
      ? console.log("Server successfully connected to the database")
      : console.log("Server can't connect to server");

    await createListing(client, {
      FirstName: "adadasdas",
      LastName: "asdads",
      Gender: "adsadsa",
      SchoolId: "asdads",
      Office: "adsaddsada",
      Job: "adsadsadas",
      VehicleName: " adasdasd",
      PlateNumber: "adsadasd",
      LicenseNumber: "adsadsda",
      DateRegistered: "adsadasd",
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
main().catch(console.error);
async function createTrafficData(client, classType, trafficData) {
  const database = await client.db("traffic-data");
  const result = false;
  if (classType == "STUDENT")
    result = await database
      .collection("student-registry")
      .insertOne(trafficData);
  if (classType == "EMPLOYEE")
    result = await database
      .collection("employee-registry")
      .insertOne(trafficData);
  return result;
}
wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(data) {
    wss.clients.forEach(client=>{
      if(client == ws){
        isConnected = connectedGates.filter(gate => gate == ws )        
        if(!isConnected) connectedGates.push(ws)
        console.log(connectedGates)
      }
    })
    let parsedData = JSON.parse(data);
    let event = parsedData.event;
    let receivedData = parsedData.data;
    if (receivedData.client === "GATE") connectedGates.push(ws);
    if (receivedData.client === "MONITOR") connectedMonitors.push(ws);

    console.log(connectedGates);
    console.log(connectedMonitors);
    if (event == "verifyID") {
      console.log(`ID was sent for verificaiton : ${receivedData.idScanned}`);
      ws.send(JSON.stringify({ event: "permitID", data: "verified" }));
    }
    if (event == "gateBusy") {
      console.log(
        `gate ${receivedData.gate} was set its availability to ${receivedData.availability}`
      );
      ws.send(JSON.stringify({ event: "permitID", data: "verified" }));
      wss.clients.forEach((client) => {
        if (client !== ws && ws.readyState == WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              event: "broadcastStatusToMonitor",
              data: "verified",
            })
          );
        }
      });
      ws.send(JSON.stringify({ event: "disableRFID", data: "verified" }));
    }
    if (event == "sendData") {
      const classType = receivedData.classType;
      try {
        client.connect();
        const result = trafficData(client, classType, {
          gate: receivedData.gate,
          actionType: receivedData.actionType,
          driverName: receivedData.driverName,
          schoolId: receivedData.schoolId,
        });
        if (result) console.log("traffic data sucessfull inserted");
      } catch (e) {
        console.error(e);
      } finally {
        client.close();
      }
      wss.clients.forEach((client) => {
        if (client !== ws && ws.readyState == WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              event: "broadcastDataToMonitor",
              data: "verified",
            })
          );
        }
      });
    }
  });
  ws.on("disconnect", () => {});
});

module.exports = server;
