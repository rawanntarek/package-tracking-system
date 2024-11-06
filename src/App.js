import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import ListOfOrders from './components/ListOfOrders';
import CreateOrder from './components/CreateOrder';
import ManageOrders from './components/ManageOrders';
import AdminDashboard from './components/AdminDashboard';
import AssignOrders from './components/assignorders'; // Note the correct component name
import CourierDashboard from './components/CourierDashboard'; // Import the CourierDashboard component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/list-of-orders" element={<ListOfOrders />} />
        <Route path="/" element={<Registration />} />
        <Route path="/createorder" element={<CreateOrder />} />
        <Route path="/manageorders" element={<ManageOrders />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/assignorders" element={<AssignOrders />} />
        
        {/* Add the Courier Dashboard route */}
        <Route path="/CourierDashboard" element={<CourierDashboard />} /> {/* Courier Dashboard route */}
      </Routes>
    </Router>
  );
}

export default App;
