const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const data = require('./models/registered')
io.on('connected',(socket)=>{
    socket.on("scanId",(id)=>{
        const isIdExist = data.filter(d => (d.schoolId === id)? true : false);
        if (isIdExist) socket.emit("permitId",JSON.stringify(1));
        if (isIdExist) socket.emit("permitId",JSON.stringify(0));
        
    })
    socket.on("storeData",(data)=>{
        
        
    })
})
module.exports = server;

