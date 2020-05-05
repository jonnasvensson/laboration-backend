import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import io from 'socket.io-client';

import Chatview from './Chatview'
import Room from './Room'

const socket = (io('http://localhost:8095'));


function App() {
  const [userName, setUserName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [enterChat, updateEnterChat] = useState(false);

  useEffect(() => { // plocka bort, behöver inte göra två ggr
    axios.get('/chatrooms')
      .then(res => {
        let data = res.data;
        console.log(data);
        console.log(socket);
        return data;
      })
  }, []);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
/*     if (inputValue.trim().length === 0) {
      setInputValue("");
      return;
    }
 */    updateEnterChat(true);
    setUserName(inputValue);
  }


  return (
    <div className="App">
      <h1>Chatty</h1>
      {
        enterChat ? <Chatview userName={userName} socket={socket}  />
          :
          <div className="container">
            <form type="submit" onSubmit={handleSubmit}>
              <input
                className="input__name"
                placeholder="Name"
                type="text"
                onChange={handleChange}
                value={inputValue} />
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



