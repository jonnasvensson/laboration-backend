import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import io from 'socket.io-client';

import Chatview from './Chatview'
import Room from './Room'

//const socket = (io('http://localhost:8095'))


function App() {
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [enterChat, updateEnterChat] = useState(false);
  const [socket, updateSocket] = useState(null);

  useEffect(() => {
    axios.get('/chatrooms')
      .then(res => {
        let data = res.data;
        console.log(data);
        console.log(socket);
        return data;
      })
  }, []);

  const handleChange = (e) => {
    setNameInput(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSocket(io('http://localhost:8095')) // connectar med socket vid submit
    updateEnterChat(true);
    setUserName(nameInput);
  }




  return (
    <div className="App">
      <h1>Chatty</h1>
      {
        enterChat ? <Chatview userName={userName} socket={socket} updateSocket={updateSocket} />
          :
          <div className="container">
            <form type="submit" onSubmit={handleSubmit}>
              <input
                className="input__name"
                placeholder="Name"
                type="text"
                onChange={handleChange}
                value={nameInput} />
              <input
                className="input__button"
                type="submit"
                value="Enter"
                onSubmit={handleSubmit} />
            </form>
          </div>
      }
    </div>
  );
}

export default App;



