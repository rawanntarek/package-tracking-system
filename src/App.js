import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; // Assuming you have a Login componentimport Login from './components/Login'; // Assuming you have a Login component
import Registration from './components/Registration'; // Assuming you have a Login component


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
        <Registration/>
      </div>
    </Router>
  );
}

export default App;
