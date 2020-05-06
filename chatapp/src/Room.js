import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';

import './App.css';
import axios from 'axios';


export default function Room({ roomName, socket, userName, rooms, roomId, getMessages }) {
    const [inputValue, setInputValue] = useState("");
    const [data, setData] = useImmer([]);

    useEffect(() => {        // hämtar hem alla meddelenaden
        socket.on('new messages', (data) => {
            console.log('NEW MESSAGES --> USEEFFECT1', data);

            data.map((message) => {
                return setData((draft) => {
                    draft.push(message);
                })
            })
        })
    }, [])
/*     socket.on('message', data => {
        console.log('MESSAGE', data);
        
    }) */

    useEffect(() => {
        socket.on('message', (data) => {
/*             axios.get('/chatroom/:id')
            .then(() => {
                
            })
 */            console.log('MESSAGE --> USEEFFECT2', data);
 
            setData((draft) => {
                draft.push(data);
            });
        });
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            userName: userName,
            message: inputValue,
            roomId: roomId
        }
        socket.emit('new message', data);   // skickar meddelandet.
        socket.emit('room', (roomId));
        setData((draft) => {
            draft.push(data)
        });
        setInputValue("");
    }
    console.log(getMessages);
    
    const mappedGetMessages = getMessages.map((getMessage, jdx) => {
        return <li key={jdx}><h5><strong>{getMessage.userName}</strong></h5>{getMessage.message}</li>
    } )

    const mappedMessages = data.map((message, idx) => {
        return <li key={idx}> <h5><strong>{message.userName}</strong></h5>
            {message.message}</li>
    })
    console.log('data-->', data);

/*     let holdmessages = rooms.filter(room => {

        return room.id === roomId;

    })
    console.log(holdmessages);

 */    return (
        <div>
            <h2>You have entered {roomName}</h2>
            <div className="container_messages">
{/*                 <ul>{mappedMessages}</ul>
 */}                <ul className="messages_db">{mappedGetMessages}</ul>
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
                    value="Send" />
            </form>
        </div>
    )
}
