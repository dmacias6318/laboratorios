const express=require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')
const config = require('./server/config')
const helpers = require("./server/helpers");

const app = config(express())
const server=http.createServer(app)


const a=async()=>{
    const claveuser =await helpers.encryptPassword("0fSMt");
    console.log(claveuser)
}

a()


const io=socketIO(server)
require('./socket')(io);

//static files
app.use(express.static(path.join(__dirname,"public")))

server.listen(process.env.PORT || app.get('port'),()=>{
    console.log("server on port ",app.get('port'))
})

