import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';


export default function Room({ roomName, socket, userName }) {
    const [message, setMessage] = useState("");
    const [writtenMessage, setWrittenMessage] = useState("");


    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let writtenMessage = message;
        setWrittenMessage(writtenMessage);
        socket.emit('chat', {
            data: {
                name: userName,
                message: message,
            }
        })
        socket.on('chat', (data) => {
            console.log(data);
        });
        setMessage(""); //tömmer textarea efter send
    }


    return (
        <div>
            <h2>You have entered {roomName}</h2>
            <p><strong>{userName}</strong></p>
            <p>{writtenMessage}</p>
            <form type="submit" onSubmit={handleSubmit}>
                <textarea
                    cols="30"
                    rows="10"
                    className="textarea"
                    placeholder="Message"
                    type="text"
                    id="nameInput"
                    onChange={handleChange}
                    value={message}
                ></textarea>
                <input
                    className="input__button"
                    type="submit"
                    value="Send" />
            </form>
        </div>
    )
}