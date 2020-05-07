const express = require('express');
const app = express();
const PORT = 8095;

const http = require('http').createServer(app);
const io = require('socket.io')(http, {origins: "*:*"});

app.use(express.json());

const { getClient, getDB, createObjectId } = require('./db');


app.get('/chatrooms', (req, res) => {
    console.log('DB Connected');
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
    console.log();
    

    const db = getDB();
    db.collection('chatrooms')
        .findOne({_id: createObjectId(roomId)})
        .then(room => {
            res.status(200).send(room);
    })
    .catch(e => {
        console.error(e);
        res.status(500).end();
    });

});

app.post('/chatrooms', (req, res) => {
    let roomName = req.body.rooms;
    const db = getDB(); 
    console.log(db);
    
    
    let createRoom = {
        room: req.body.room,
        messages: [],
    }
    console.log(roomName);
    
    console.log(createRoom.room);

    db.collection('chatrooms')
        .insertOne(createRoom)
        .then(result => {
            createRoom._id = result.insertedId;
            res.status(201).send(createRoom);
        })
        .catch(e => {
            console.error(e);
            res.status(500).end();
        });
});

app.delete('/chatrooms/:id', (req, res) => {
    let roomId = req.params.id;
    console.log('ID -->', roomId);
    
    const db = getDB();

    db.collection('chatrooms')
        .findOneAndDelete({_id: createObjectId(roomId)})
        .then(() => {
            res.status(204).end();
        })
        .catch(e => {
            console.error(e);
            res.status(500).end();
        });
});

io.on('connection', (socket) => {   
    console.log('User connected, id: ', socket.id); 
    socket.on("new message", (data) => {    
        
        const db = getDB();

        db.collection('chatrooms')
        .updateOne({_id: createObjectId(data.roomId)}, {$push: {
            "messages": data }
        })
        .then(() => {            
            console.log('COMPLETED');
        })
        .catch(e => {
            console.error(e);
        });
        io.sockets.emit("message", data);       
    })  
    socket.on('room', (roomId) => {
        socket.join(roomId)
    })
})

http.listen(PORT, () => console.log(`Server started on ${PORT}`));