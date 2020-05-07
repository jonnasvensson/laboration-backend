import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './App.css';
import Header from './Header'


export default function Chatview({ roomName, socket, userName, roomId }) {
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
        return <li key={idx}>
                <strong>{message.userName}: </strong>{message.message}
                </li>
    })

    return (
        <>
            <h2>{roomName}</h2>
            <ul className="ul_messages">{mappedMessages}
            </ul>
            <h4> {userName}</h4>
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
                    className="input_messagebutton"
                    type="submit"
                    value="Send"/>
            </form>
            </>
    )
}
