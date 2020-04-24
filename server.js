const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {origins: "*:*"});

app.use(express.json());


let user = [];

app.get('/users', (req, res) => {
    res.send({user})
});

io.on('connection', (socket) => {
    console.log('User connected, id: ', socket.id);

    socket.on("send message", (data) => {
        io.sockets.emit("new message", data);
    })
})

app.post('/users', (req, res) => {
    let name = req.body.name;
    user.push(name);
    res.send(name);
})  

http.listen(8090, (req, res) => console.log('Server started!'));