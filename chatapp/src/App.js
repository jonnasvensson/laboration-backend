import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import io from 'socket.io-client';

import Chatview from './Chatview'
import Room from './Room'

const socket = io('http://localhost:8095')

function App() {
  const [userName, updateUserName] = useState("");
  const [enterChat, updateEnterChat] = useState(false);

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
    updateUserName(e.target.value);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    updateEnterChat(true);
  }

  return (
      <div className="App">
          <h1>Chatty</h1>
            {
                enterChat ? <Chatview userName={userName} socket={socket} />
                    :
                      <div className="container">
                          <form type="submit" onSubmit={handleSubmit}>
                                <input
                                  className="input__name"
                                  placeholder="Name"
                                  type="text"
                                  onChange={handleChange}
                                  value={userName} />
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



