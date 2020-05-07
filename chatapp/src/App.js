import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import io from 'socket.io-client';

import Rooms from './Rooms'
import Header from './Header'

const socket = (io('http://localhost:8095'));

function App() {
  const [userName, setUserName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [enterChat, updateEnterChat] = useState(false);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
     if (inputValue.trim().length === 0) {
      setInputValue("");
      return;
    }
     updateEnterChat(true);
    setUserName(inputValue);
  }

  return (
    <div className="App">
      {
        enterChat ? <Rooms userName={userName} socket={socket} />
          :
          <div className="container">
          <Header />
            <form type="submit" onSubmit={handleSubmit}>
              <input
                className="input_name"
                placeholder="Name"
                type="text"
                onChange={handleChange}
                value={inputValue} />
              <input
                className="input_button"
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



