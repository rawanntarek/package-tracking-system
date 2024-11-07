import React, { useState, useEffect } from 'react';
import './ManageOrders.css';

function ManageOrders() {
  const [orders, setOrders] = useState([]); // Initialize with an empty array

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('http://localhost:3000/getallorders', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data||[]); // Set the fetched orders to state
        } else {
          console.error('Failed to fetch orders');
          setOrders([])
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([])

      }
    }

    fetchOrders();
  }, []);

  const deleteOrder = async (orderId) => {
    try {
      console.log(`Deleting order with ID: ${orderId}`);
      const response = await fetch('http://localhost:3000/deleteorder', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'id': orderId,
        },
      });

      if (response.ok) {
        console.log('Order deleted successfully');
        setOrders(orders.filter((order) => order._id !== orderId));
      } else {
        console.error('Failed to delete order:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div>
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
          {orders.length > 0 ? (
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.pickupLocation}</td>
                <td>{order.dropOffLocation}</td>
                <td>{order.packageDetails}</td>
                <td>{order.deliveryTime}</td>
                <td>{order.userEmail}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => deleteOrder(order.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageOrders;
