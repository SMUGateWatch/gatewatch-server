//const dotenv = require("dotenv");
//dotenv.config();
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
const db_uri = process.env.MONGODB_URI;
const client = new MongoClient(db_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

 client.connect();
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
    client.isConnected()
      ? console.log("Server successfully connected to the database")
      : console.log("Server can't connect to server");
    await createListing(client, {
      message: "Connect to Database. Success",
    });
  } catch (e) {
    console.error(e);
  } 
}
main().catch(console.error);

async function createTrafficData(client, classType, trafficData) {
  const database = await client.db("agcs");
  const result = false;
  if (classType == "STUDENT")
    res = await database.collection("students").insertOne(trafficData);
  res.insertedId
    ? (result = true)
    : console.log("Theres a problem witht he query");
  if (classType == "EMPLOYEE")
    res = await database.collection("employee").insertOne(trafficData);
  res.insertedId
    ? (result = true)
    : console.log("Theres a problem witht he query");
  return result;
}
async function verifyId(client, uid) {
  const database = await client.db("agcs");
  const result = false;
  try {
    
    const employee = await database
      .collection("employee")
      .findOne({ UID: uid });
    const student = await database.collection("students").findOne({ UID: uid });
    if (employee || student) result = true;
  } catch (e) {
    console.error(e);
  }

  return result;
}

wss.on("connection", async function connection(ws) {
  ws.on("message", async function incoming(data) {
    wss.clients.forEach((client) => {
      if (client == ws) {
        isConnected = connectedGates.filter((gate) => gate == ws);
        if (!isConnected) connectedGates.push(ws);
        console.log(connectedGates);
      }
    });
    main().catch(console.error);
    let parsedData = JSON.parse(data);
    let event = parsedData.event;
    let receivedData = parsedData.data;

    let socketClient = receivedData.client;

    if (socketClient === "GATE") connectedGates.push(ws);
    if (socketClient === "MONITOR") connectedMonitors.push(ws);

    console.log(connectedGates);
    console.log(connectedMonitors);
    if (event == "verifyID") {
      let id = receivedData.idScanned
      console.log(`ID was sent for verificaiton : ${id}`);      
      const result = await verifyId(client, id);     
    if (result)
        ws.send(JSON.stringify({ event: "permitID", data: "verified" }));
      if (!result)
        ws.send(JSON.stringify({ event: "permitID", data: "not verified" }));
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
        const result = createTrafficData(client, classType, {
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
  ws.on("close", () => console.log("Client disconnected"));
});

module.exports = server;
