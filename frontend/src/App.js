import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Chats from './components/Chats';

const App = () => {
  return (
    <div id='app'>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/chats' element={<Chats />}></Route>
      </Routes>
    </div>
  );
};

export default App;
