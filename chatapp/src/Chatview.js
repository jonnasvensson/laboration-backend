import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import io from 'socket.io-client';

import Room from './Room'

export default function Chatview({ userName, socket, updateSocket }) {
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [roomName, setRoomName] = useState("");
    const [inputValue, setInputValue] = useState("");


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

    const handleChange = (e) => {
        setInputValue(e.target.value);
    }
    

    const handleNewRoom = () => {
        let room = {
            room: inputValue,
            messages: [],
        }    
        console.log('Clicked new room');
        axios.post('/chatrooms', room )
        .then(res => {
            setRooms([...rooms, room])  // kopierar rooms och lägger till det nya --> room
        })
        .catch(e => {
            console.error(e);
        })
    }

    const handleDelete = (e) => {
        console.log('Button clicked');
        axios.delete('/:id')
    }

    // kopplar med socket anrop med (id) socket.join = connection till ett speciellt rum


    const renderRooms = rooms.map((room, i) => {
        let id = room._id;
        let name = room.room;
        console.log(room.room);
        
        return <li key={i} >
            <strong onClick={(e) => clickRoom(e, id, name)}>{name}</strong>
            <div>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </li>
    })

    return (
        <div className="container_chat">            
            <h4>{userName}</h4>
            {
                roomName ? <Room renderRooms={renderRooms} roomName={roomName} socket={socket} updateSocket={updateSocket} userName={userName} rooms={rooms} roomId={roomId} /> : <ul>{renderRooms}</ul>
            }
            <input 
                type="text" 
                onChange={handleChange}
                value={inputValue}/>
            <input 
                type="button" 
                value="Create chatroom"
                onClick={handleNewRoom}/>            
            <div className="container_messages">
            </div>
        </div>
    );
}





