import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import ListOfOrders from './components/ListOfOrders';
import CreateOrder from './components/CreateOrder';
import ManageOrders from './components/ManageOrders';
import AdminDashboard from './components/AdminDashboard';
import AssignOrders from './components/assignorders'; // Note the correct component name


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/ListOfOrders" element={<ListOfOrders />} />
        <Route path="/" element={<Registration />} />
        <Route path="/createorder" element={<CreateOrder />} />
        <Route path="/manageorders" element={<ManageOrders />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} /> {/* Admin Dashboard route */}
        <Route path="/assignorders" element={<AssignOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
