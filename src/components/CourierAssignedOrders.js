import React, { useState, useEffect } from 'react';

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
      }
    }
  
    fetchAssignedOrders();
  }, []);

  return (
    <div>
      <h1>Assigned Orders</h1>
      { assignedOrders.length > 0 ? (
        <ul>
          {assignedOrders.map((order) => (
            <form>
            <li key={order.id}>
              <div><b>Order ID:</b> {order.id}</div>
              <div><b>Package Details:</b> {order.packageDetails}</div>
              <div>
                <b>Pickup Location:</b> {order.pickupLocation}
                <br />
                <b>Drop-off Location:</b> {order.dropOffLocation}
                <br />
                <b>Delivery Time:</b> {order.deliveryTime}
                <br />
                <b>Status:</b> {order.status}
              </div>
            </li>
            </form>
          ))}
        </ul>
      ) : (
        <p>No assigned orders</p>
      )}
    </div>
  );
}

export default CourierAssignedOrders;