import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import ToDo from './components/ToDo';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';


const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      
      <Route path="/" exact element={<ToDo/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>} /> 
      <Route path="/profile" element={<Profile/>} />
    </Routes>
    </BrowserRouter>
  );
};

export default App;