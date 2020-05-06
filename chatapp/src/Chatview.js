import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import Room from './Room'

export default function Chatview({ userName, socket, updateSocket }) {
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [roomName, setRoomName] = useState("");
    const [inputValue, setInputValue] = useState("");


    function getAxios() {
        axios.get('/chatrooms')
            .then(res => {
                let data = res.data;
                setRooms(data);
            })
    };
    
    const handleRoom = (id, name) => {        
        setRoomId(id)
        setRoomName(name);
    }
    
    const handleDelete = (id, data) => {
        axios.delete(`/chatrooms/${id}`)
            .then(() => {
                return data;
            })
            .catch(e => {
                console.error(e);
            })
        getAxios();
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        let room = {
            room: inputValue,
            messages: [],
        }
        if (inputValue.trim().length === 0) {
            setInputValue("");
            return;
        }
        // kolla om room.room redan finns.
        axios.post('/chatrooms', room)
            .then((res) => {
                setRooms([...rooms, res.data]) 
            })
            .catch(e => {
                console.error(e);
            })
        setInputValue("");
    }

    useEffect(() => {
        getAxios();
    }, []);

    const renderRooms = rooms.map((room, i) => {        
        let id = room._id;
        let name = room.room;

        return <li key={i} >
            <strong onClick={() => handleRoom(id, name)}>{name}</strong>
            <div>
                <button onClick={() => handleDelete(id)}>Delete</button>
            </div>
        </li>
    })


    return (
        <div className="container_chat">
            <h4>{userName}</h4>
            {
                roomName ? <Room renderRooms={renderRooms} roomName={roomName} socket={socket} updateSocket={updateSocket} userName={userName} rooms={rooms} roomId={roomId}/> : <ul>{renderRooms}</ul>
            }
            <input
                type="text"
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
            />
            <input
                type="button"
                value="Create chatroom"
                onClick={handleSubmit} />
            <div className="container_messages">
            </div>
        </div>
    );
}





