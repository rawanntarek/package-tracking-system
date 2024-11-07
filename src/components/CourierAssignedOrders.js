import React, { useState, useEffect } from 'react';
import './CourierAssignedOrders.css';

function CourierAssignedOrders() {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch assigned orders for the courier
  useEffect(() => {
    const courierID = localStorage.getItem('courierID');
    if (!courierID) {
        alert('Courier ID is missing');
        return;
    }
    async function fetchAssignedOrders() {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/getassignedorders', {
          method: 'GET',
          headers: {
            'courierID': courierID,  
          },
        });
  
        if (response.ok) {
          const orders = await response.json();
          setAssignedOrders(orders);
        } else {
          console.error('Failed to fetch assigned orders');
          alert('Failed to fetch assigned orders. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching assigned orders:', error);
        alert('Error fetching assigned orders');
      } finally {
        setLoading(false);
      }
    }
  
    fetchAssignedOrders();
  }, []);

  return (
    <div>
      <h1>Assigned Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : assignedOrders.length > 0 ? (
        <ul>
          {assignedOrders.map((order) => (
            <li key={order.id}>
              <div><strong>Order ID:</strong> {order.id}</div>
              <div><strong>Package Details:</strong> {order.packageDetails}</div>
              <div>
                <strong>Pickup Location:</strong> {order.pickupLocation}
                <br />
                <strong>Drop-off Location:</strong> {order.dropOffLocation}
                <br />
                <strong>Delivery Time:</strong> {order.deliveryTime}
                <br />
                <strong>Status:</strong> {order.status}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assigned orders</p>
      )}
    </div>
  );
}

export default CourierAssignedOrders;
