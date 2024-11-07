import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import ListOfOrders from './components/ListOfOrders';
import CreateOrder from './components/CreateOrder';
import AdminDashboard from './components/AdminDashboard';
import AssignOrders from './components/assignorders';  
import CourierDashboard from './components/CourierDashboard';  
import ManageOrders from './components/ManageOrders';  
import OrderDetails from './components/OrderDetails';
import CourierAssignedOrders from './components/CourierAssignedOrders';

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
        
        {/* Add the Courier Dashboard route */}
        <Route path="/CourierDashboard" element={<CourierDashboard />} /> {/* Courier Dashboard route */}
        <Route path="/manageorders" element={<ManageOrders />} />  {/* Add route for ManageOrders */}
        <Route path="/OrderDetails/:id" element={<OrderDetails />}/>
        <Route path="/courierassignedorders" element={<CourierAssignedOrders/>} />
      </Routes>
    </Router>
  );
}

export default App;