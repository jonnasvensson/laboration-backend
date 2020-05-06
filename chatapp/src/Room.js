import React, { useEffect, useState } from 'react';

import './App.css';
import axios from 'axios';


export default function Room({ roomName, socket, userName, roomId }) {
    const [inputValue, setInputValue] = useState("");
    const [data, setData] = useState([]);
    const [newMessages, setNewMessages] = useState([]);

    useEffect(() => {     
        axios.get('/chatrooms/' + roomId)
        .then((res) => {
            setData(res.data);
        })
        .catch((e) => {
            console.error(e);
        })
    }, [newMessages, roomId])
    
    socket.on('message', (data) => {
        setNewMessages(data);
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            userName: userName,
            message: inputValue,
            roomId: roomId
        }
        socket.emit('new message', data); 
        setInputValue("");
    }
    
    const mappedMessages = 
    data.room && data.messages.map((message, idx) => {
        return <li key={idx}> <h5><strong>{message.userName}</strong></h5>
            {message.message}</li>
    })

    return (
        <div>
            <h2>You have entered {roomName}</h2>
            <div className="container_messages">
                  <ul>{mappedMessages}</ul>
            </div>
            <form type="submit" onSubmit={handleSubmit}>
                <textarea
                    cols="30"
                    rows="10"
                    className="textarea"
                    placeholder="Message"
                    type="text"
                    id="nameInput"
                    onChange={(e) =>setInputValue(e.target.value)}
                    value={inputValue}
                ></textarea>
                <input
                    className="input__button"
                    type="submit"
                    value="Send"/>
            </form>
        </div>
    )
}
