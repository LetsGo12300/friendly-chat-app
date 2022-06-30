import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chats = () => {
  const [chats, setChats] = useState([]);

  const getChats = async () => {
    const { data } = await axios.get('/api/chat');
    setChats(data);
  };

  useEffect(() => {
    getChats();
  }, []);

  return (
    <>
      {chats.map((chat) => {
        return <div key={chat._id}>{chat.chatName}</div>;
      })}
    </>
  );
};

export default Chats;
