import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ManageOrders from './components/ManageOrders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ManageOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
