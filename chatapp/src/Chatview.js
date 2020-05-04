import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import io from 'socket.io-client';

import Room from './Room'

export default function Chatview({ userName, socket, updateSocket }) {
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [roomName, setRoomName] = useState("");


    useEffect(() => {
        axios.get('/chatrooms')
            .then(res => {
                let data = res.data;
                let id = res.data._id;
                setRooms(data);
                console.log(res.data);
            })
    }, []);

    const clickRoom = (e, id, name) => {
        console.log(id);
        setRoomId(id)
        setRoomName(name);
        
    }

    // kopplar med socket anrop med (id) socket.join = connection till ett speciellt rum


    const renderRooms = rooms.map((room, i) => {
        let roomName = room.room;
        let id = room._id;
        let name = room.room;
        return <li key={i} onClick={(e) => clickRoom(e, id, name)} >{name}</li>   // skickar in id:ed i clickRoom
    })

    return (
        <div className="container_chat">
            <h4>{userName}</h4>
            { 
                roomName ? <Room renderRooms={renderRooms} roomName={roomName} socket={socket} updateSocket={updateSocket} userName={userName} rooms={rooms} roomId={roomId}/> : <ul>{renderRooms}</ul> 
            }
            <div className="container_messages">
            </div>
        </div>
    );
}





