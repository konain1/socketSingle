import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import SingleChatPage from './component/SingleChatPage';

function App() {
  const [message, setMessage] = useState('');
  const [recieve, setRecieve] = useState([]); // Array to store received messages
  const [username, setUsername] = useState('');

  // Initialize the socket connection
  const socket = io('http://localhost:3300');

  // Handle sending a message
  const handleMessage = (e) => {
    e.preventDefault();

    if (!username) {
      alert('Please enter a username!');
      return;
    }

    const dataObj = {
      sender: username,
      message: message,
    };

    socket.emit('sent', dataObj); // Emit the message to the server
    setMessage(''); // Clear the message input
  };

  // Set up the socket listener
  useEffect(() => {
    socket.on('recieve', (data) => {
      console.log(data);
      setRecieve((prev) => [...prev, data]); // Append new message to state
    });

    // Cleanup listener on unmount
    return () => {
      socket.off('recieve');
    };
  }, [socket]);

  return (
    <>
      <div>
        <h2>Socket.io Chat App</h2>

        {/* Username input */}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Message input */}
        <div>
          <label htmlFor="message">Message:</label>
          <input
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Send message button */}
        <button onClick={handleMessage}>Send Message</button>
      </div>

      <div>
        <h3>Broadcast Messages:</h3>

        {/* Map through the recieved messages */}
        {recieve.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <SingleChatPage socket={socket} />
    </>
  );
}

export default App;
