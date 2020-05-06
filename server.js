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
    
    let createRoom = {
        room: req.body.room,
        messages: [],
    }

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


// Socket setup

io.on('connection', (socket) => {   // skapar connection --> lyssnar på ett event kallad connection
    console.log('User connected, id: ', socket.id); // när connection är gjord, log visas socket har en prop .id
    socket.on("new message", (data) => {    // denna triggas och lyssnar på new message
        console.log('NEW MESSAGE I SERVER', data);
        console.log(data.roomId);
        
        const db = getDB();

        db.collection('chatrooms')
        .updateOne({_id: createObjectId(data.roomId)}, {$push: {
            "messages": data }
        })
        .then((res) => {
            console.log(res);
            console.log(data);
            
            console.log('COMPLETED');
        })
        .catch(e => {
            console.error(e);
        });
    

        socket.broadcast.emit("message", data);
        console.log('MESSAGE FROM CLIENT', data);
        
    })  
    socket.on('room', (roomId) => {
        socket.join(roomId)
    })
/*     socket.on('message', data =>{
        socket.broadcast.emit('message', data);
    })
 */})

http.listen(PORT, () => console.log(`Server started on ${PORT}`));