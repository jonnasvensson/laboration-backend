import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import axios from 'axios';

import './App.css';


export default function Room({ roomName, socket, userName, rooms, roomId }) {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [incomingMessages, setincomingMessages] = useState([]);
    const [data, setData] = useImmer();

    let mappedIncomingMessages;


    const handleChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();        
        let msg = {
            userName : userName,
            message: inputValue,
            roomName: roomName 
        }
        //socket.on('message', (msg) => {});  //Denna lyssnar på emit ovan
            socket.emit('message', msg);    // skickar data till socket
            console.log('MSG --> ', msg);
         
        messages.push(msg)

        console.log(msg);
        console.log(messages);
        
        setInputValue(""); 

        socket.on('message', (msg) => {
            console.log(msg);
            incomingMessages.push(msg);
            console.log(incomingMessages);  
            setData(draftState => {
                draftState.operation();
            });
        })
    }    
    console.log('BEFORE MAPPING', incomingMessages);
    
    mappedIncomingMessages = incomingMessages.map((message, idx) => {
        return <li key={idx}> <h5><strong>{userName}</strong></h5>
            {message}</li>
    })
    console.log('AFTER MAPPING', incomingMessages);
    console.log(rooms);
    
    let holdmessages = rooms.filter(room => {
        
        return room.id === roomId;

    })
    console.log(holdmessages);
    
    
/*     const mappedMessages = messages.map((message, idx) => {
        return <li key={idx}> <h5><strong>{userName}</strong></h5>
            {message.message}</li>
    })
    console.log(messages);
 */    
 
    return (
        <div>
            <h2>You have entered {roomName}</h2>
            <ul>{mappedIncomingMessages}</ul>

          {/*    <ul>
                {mappedMessages}
            </ul> */}
            <form type="submit" onSubmit={handleSubmit}>
                <textarea
                    cols="30"
                    rows="10"
                    className="textarea"
                    placeholder="Message"
                    type="text"
                    id="nameInput"
                    onChange={handleChange}
                    value={inputValue}
                ></textarea>
                <input
                    className="input__button"
                    type="submit"
                    value="Send" />
            </form>
        </div>
    )
}