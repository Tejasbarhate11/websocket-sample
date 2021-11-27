const WebSocket = require("ws")

const express = require("express")

//initialize express app instance
const app = express()

const path = require("path")


app.use("/",express.static(path.resolve(__dirname, "../client")))

// regular http server using node express which serves your webpage
const myServer = app.listen(9876, () => console.log("server started listenining on http://localhost:9876") )       

const wsServer = new WebSocket.Server({
    noServer: true
})   


// on connection event
wsServer.on("connection", (ws) => {   

    //on message event 
    ws.on("message", (msg) => {

        //send the message to each ready client
        wsServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {     // check if client is ready
                client.send(msg.toString());
            }
        })
    })
})

 //handling upgrade(http to websocekt) request
myServer.on('upgrade', async (request, socket, head) => {     

    // accepts half requests and rejects half. Reload browser page in case of rejection
    if(Math.random() > 0.5){
        //proper connection close in case of rejection
        return socket.end("HTTP/1.1 401 Unauthorized\r\n", "ascii")     
    }
    
    //emit connection when request accepted
    wsServer.handleUpgrade(request, socket, head, (ws) => {
      wsServer.emit('connection', ws, request);
    })

})