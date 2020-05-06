import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import Room from './Room'

export default function Chatview({ userName, socket, updateSocket }) {
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [roomName, setRoomName] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [getMessages, setGetMessages] = useState([]);


    function getAxios() {
        axios.get('/chatrooms')
            .then(res => {
                let data = res.data;
                setRooms(data);
                console.log(res.data);
                console.log(data);
            })
    };
    console.log(rooms._id);


    
    
    const handleRoom = (id, name) => {
        axios.get(`/chatrooms/${id}`)
        .then((res) => {
            console.log(res.data);  
            console.log(res.data._id);
            console.log(res.data.messages);
            setGetMessages(res.data.messages)
        })
        .catch(e => {
            console.error(e);
        })
        
        setRoomId(id)
        setRoomName(name);
        console.log(roomId);
        console.log(roomName);
        
    }
    console.log(getMessages);

    const handleDelete = (id, data) => {
        axios.delete(`/chatrooms/${id}`)
            .then(res => {
                console.log(res);
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
        axios.post('/chatrooms', room)
            .then((res) => {
                setRooms([...rooms, res.data])  // kopierar rooms och lägger till det nya --> room
            })
            .catch(e => {
                console.error(e);
            })
        setInputValue("");
    }



    useEffect(() => {
        getAxios();
    }, []);

    console.log(roomName);
    
    const renderRooms = rooms.map((room, i) => {
        console.log(room);
        
        let id = room._id;
        console.log('ID -->', id);

        let name = room.room;
        console.log('NAME -->', name);

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
                roomName ? <Room getMessages={getMessages} renderRooms={renderRooms} roomName={roomName} socket={socket} updateSocket={updateSocket} userName={userName} rooms={rooms} roomId={roomId}/> : <ul>{renderRooms}</ul>
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





