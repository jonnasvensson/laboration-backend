const express = require('express');
const app = express();
const PORT = 8095;

const http = require('http').createServer(app);
const io = require('socket.io')(http, {origins: "*:*"});

app.use(express.json());

const { getClient, getDB, createObjectId } = require('./db');

io.on('connection', (socket) => {
    console.log('User connected, id: ', socket.id);

    socket.on("chat", (data) => {
        io.sockets.emit("chat", data);
    })
})

app.get('/chatrooms', (req, res) => {
    console.log('Connected');
    const db = getDB();
    db.collection('chatrooms')
        .find({})
        .toArray()
        .then(data => {
            res.send(data);
    })
    .catch(e => {
        console.error(e);
        res.status(500).end();
    });
});

app.get('/chatrooms/:id', (req, res) => {
    let roomId = req.params.id;

    const db = getDB();
    db.collection('chatrooms')
        .findOne({_id: createObjectId(roomId)})
        .then(room => {
            res.send(room);
    })
    .catch(e => {
        console.error(e);
        res.status(500).end();
    });
});

app.post('/chatrooms', (req, res) => {
    const db = getDB(); // hämtar databasen
    let data = req.body;

    db.collection('chatrooms')
        .insertOne(data)
        .then(result => {
            data._id = result.insertedId;
            res.status(201).send(data);
        })
        .catch(e => {
            console.error(e);
            res.status(500).end();
        });
});

// Skapa knapp i frontenden som pekar på id:et vid delete.
// Kolla deleten, funkar ej!
app.delete('/chatrooms/:id', (req, res) => {
    let roomId = req.params.id;
    const db = getDB();
    console.log('ROOMID', roomId);
    
    db.collection('chatroom')
        .remove({_id: createObjectId(roomId)})
        .then(() => {
            res.status(204).end();
        })
        .catch(e => {
            console.error(e);
            res.status(500).end();
        });
});

http.listen(PORT, () => console.log(`Server started on ${PORT}`));