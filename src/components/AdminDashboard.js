// AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // Make sure to import the CSS

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Function to navigate to manage orders
  const goToManageOrders = () => {
    navigate("/ManageOrders");
  };

  // Function to navigate to assign orders to couriers
  const goToAssignOrders = () => {
    navigate("/assignorders");
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard. What would you like to do today?</p>
      <div className="admin-buttons">
        <button className="admin-button" onClick={goToManageOrders}>Manage Orders</button>
        <button className="admin-button" onClick={goToAssignOrders}>Assign Orders to Courier</button>
      </div>
    </div>
  );
};

export default AdminDashboard;


