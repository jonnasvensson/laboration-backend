import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:8090')

function App() {
  const [user, setUser] = useState("")

  useEffect(() => {
    axios.get('/users')
      .then(res => {
        let data = res.data;
        console.log(data);
        console.log(socket);
        return data;
      })
  }, []);

  const handleChange = (e) => {
    setUser(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div className="App">
      <h1>hello</h1>
      <form type="submit">
        <label htmlFor="nameInput">Name</label>
        <input 
          type="text" 
          id="nameInput"
          onChange={handleChange}
          value={user}/>
        <input type="button" value="Enter chat"/>
      </form>
      <p>{user}</p>
    </div>
  );
}

export default App;



