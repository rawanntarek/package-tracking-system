import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
<<<<<<<<< Temporary merge branch 1
import ListOfOrders from './components/ListOfOrders';
=========
import CreateOrder from './components/CreateOrder';

>>>>>>>>> Temporary merge branch 2

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/ListOfOrders" element={<ListOfOrders />} />
        <Route path="/" element={<Registration />} />
        <Route path="/createorder" element={<CreateOrder />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/assignorders" element={<AssignOrders />} />
        <Route path="/CourierDashboard" element={<CourierDashboard />} /> {/* Courier Dashboard route */}
        <Route path="/manageorders" element={<ManageOrders />} />  {/* Add route for ManageOrders */}
        <Route path="/OrderDetails/:id" element={<OrderDetails />}/>
      </Routes>
    </Router>
  );
}

export default App;
