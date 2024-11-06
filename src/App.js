import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
<<<<<<< HEAD
import ManageOrders from './components/ManageOrders';

=======
import Login from './components/Login';
import Registration from './components/Registration';
import ListOfOrders from './components/ListOfOrders';
import CreateOrder from './components/CreateOrder'
>>>>>>> b33b34d23e3787d04e18baf4433d2138a5b65863
function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<ManageOrders />} />
=======
        <Route path="/login" element={<Login />} />
        <Route path="/ListOfOrders" element={<ListOfOrders />} />
        <Route path="/" element={<Registration />} />

        <Route path="/createorder" element={<CreateOrder />} />

>>>>>>> b33b34d23e3787d04e18baf4433d2138a5b65863
      </Routes>
    </Router>
  );
}

export default App;
