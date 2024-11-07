import React, { useState, useEffect } from 'react';
import './ManageOrders.css';

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  // Fetch orders from the backend
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('http://localhost:3000/getallorders', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data); // Set the fetched orders to state
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }

    fetchOrders();
  }, []);

  const updateOrderStatus = (orderId) => {
    const newStatus = prompt("Enter new status:");
    setOrders(orders.map(order => 
      order._id === orderId ? { ...order, status: newStatus || order.status } : order
    ));
  };

  const deleteOrder = (orderId) => {
    setOrders(orders.filter(order => order._id !== orderId));
  };

  const reassignCourier = (orderId) => {
    const newCourier = prompt("Enter new courier name:");
    setOrders(orders.map(order => 
      order._id === orderId ? { ...order, courier: newCourier || order.courier } : order
    ));
  };

  return (
    <div className="orders-container">
      <h1>Manage Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Pickup Location</th>
            <th>Drop-off Location</th>
            <th>Package Details</th>
            <th>Delivery Time</th>
            <th>User Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.pickupLocation}</td>
              <td>{order.dropOffLocation}</td>
              <td>{order.packageDetails}</td>
              <td>{order.deliveryTime}</td>
              <td>{order.userEmail}</td>
              <td>{order.status}</td>
              <td>
                <button className="update-btn" onClick={() => updateOrderStatus(order._id)}>Update Status</button>
                <button className="reassign-btn" onClick={() => reassignCourier(order._id)}>Reassign Courier</button>
                <button className="delete-btn" onClick={() => deleteOrder(order._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageOrders;
