import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import ListOfOrders from './components/ListOfOrders';
import CreateOrder from './components/CreateOrder';
import ManageOrders from './components/ManageOrders'; // Import ManageOrders component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/ListOfOrders" element={<ListOfOrders />} />
        <Route path="/" element={<Registration />} />
        <Route path="/createorder" element={<CreateOrder />} />
        <Route path="/manageorders" element={<ManageOrders />} />  {/* Add route for ManageOrders */}
      </Routes>
    </Router>
  );
}

export default App;
