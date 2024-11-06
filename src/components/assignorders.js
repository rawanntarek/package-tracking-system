import React, { useState, useEffect } from 'react';
import './assignorders.css'; // Ensure to import the CSS

const AssignOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');

  useEffect(() => {
    // Fetch orders from the backend (just orders for now)
    const fetchOrders = async () => {
      try {
        const orderResponse = await fetch('http://localhost:3000/orders'); // Ensure this matches the correct endpoint
        const orderData = await orderResponse.json();

        setOrders(orderData); // Set the fetched orders to state
      } catch (error) {
        console.error("Error fetching orders: ", error);
        alert('Error fetching orders.');
      }
    };

    fetchOrders();
  }, []);

  // Handle assignment (currently, just logging selected order)
  const handleAssign = async () => {
    if (selectedOrder) {
      alert(`Order ID ${selectedOrder} selected.`);
    } else {
      alert('Please select an order.');
    }
  };

  return (
    <div className="assign-orders">
      <h1>Assign Orders</h1>
      
      <div className="assign-form">
        <div className="form-group">
          <label>Select Order:</label>
          <select
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
          >
            <option value="">Select Order</option>
            {orders.map((order) => (
              <option key={order._id} value={order._id}>
                {order.packageDetails} - {order.deliveryTime}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleAssign} className="assign-button">Select Order</button>
      </div>
    </div>
  );
};

export default AssignOrders;
