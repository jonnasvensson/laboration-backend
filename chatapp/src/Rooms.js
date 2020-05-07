import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import Chatview from './Chatview'
import Header from './Header'


export default function Rooms({ userName, socket, updateSocket }) {
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
            .catch(e => {
                console.error(e);
            })
    };

    function postAxios() {
        let room = {
            room: inputValue,
            messages: [],
        }
        axios.post('/chatrooms', room)
            .then((res) => {
                let data = res.data.room;
                    setRooms([...rooms, res.data])
                    getAxios();
            })
            .catch(e => {
                console.error(e);
            })
    };    

    function validate() {
        let valid = true;
        rooms.filter((room) =>{
            if (room.room === inputValue) {
                return (valid = false);
            }
            return null;
        });
        return valid;
    }


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
        if (inputValue.trim().length === 0) {
            setInputValue("");
            return;
        }
        if (!validate(roomName)) {
            return;
        }
        postAxios();
       setInputValue("");
    }

    useEffect(() => {
        getAxios();
    }, []);
    

    const renderRooms = rooms.map((room, i) => {
        let id = room._id;
        let name = room.room;

        return <li key={i} >
            <strong className="li_rooms" onClick={() => handleRoom(id, name)}>{name}</strong>
            <div className="underline_li" ></div>
            <div>
                <button onClick={() => handleDelete(id)}>Delete</button>
            </div>
        </li>
    })


    return (
        <div className="container_chat">
            <Header />
                {
                    roomName ? <Chatview roomName={roomName} socket={socket} updateSocket={updateSocket} userName={userName} rooms={rooms} roomId={roomId} />
                        :
                        <>
                            <div>
                                <ul className="ul__rooms">{renderRooms}</ul>
                            </div>
                            <input
                                className="input_room"
                                placeholder="Chat room"
                                type="text"
                                onChange={(e) => setInputValue(e.target.value)}
                                value={inputValue}
                            />
                            <input
                                className="input_roombutton"
                                type="button"
                                value="Create chatroom"
                                onClick={handleSubmit} />
                        </>
                }
        </div>
    );
}





