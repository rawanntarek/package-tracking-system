import React, { useState } from 'react';
import './ManageOrders.css';

function ManageOrders() {
  const [orders, setOrders] = useState([
    { id: 1, customerName: "Alice Johnson", status: "Pending", courier: "Courier A" },
    { id: 2, customerName: "Bob Smith", status: "Shipped", courier: "Courier B" },
    { id: 3, customerName: "Charlie Brown", status: "Delivered", courier: "Courier C" },
  ]);

  const updateOrderStatus = (orderId) => {
    const newStatus = prompt("Enter new status:");
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus || order.status } : order
    ));
  };

  const deleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const reassignCourier = (orderId) => {
    const newCourier = prompt("Enter new courier name:");
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, courier: newCourier || order.courier } : order
    ));
  };

  return (
    <div className="orders-container">
      <h1>Manage Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Status</th>
            <th>Assigned Courier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{order.status}</td>
              <td>{order.courier}</td>
              <td>
                <button className="update-btn" onClick={() => updateOrderStatus(order.id)}>Update Status</button>
                <button className="reassign-btn" onClick={() => reassignCourier(order.id)}>Reassign Courier</button>
                <button className="delete-btn" onClick={() => deleteOrder(order.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageOrders;
