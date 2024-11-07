import React, { useState, useEffect } from 'react';

function CourierDashboard() {
  const [orders, setOrders] = useState([]); // Initialize with an empty array

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('http://localhost:3000/getallorders', {
          method: 'GET'
        });

        if (response.ok) {
          const orders = await response.json();
          setOrders(orders);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }

    fetchOrders();
  }, []);

  const acceptOrder = async (orderID) => {
    const courierID = localStorage.getItem('courierID'); // Get courier's ID from localStorage

    if (!courierID) {
      alert('Courier ID not found in localStorage');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/acceptorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'orderID': orderID,
          'courierID': courierID,
        },
      });

      if (response.ok) {
        alert('Order Accepted and Assigned to Courier');
        const updatedOrders = orders.filter((order) => order.id !== orderID);
        setOrders(updatedOrders);
      } else if (response.status === 404) {
        alert('Order not found');
      } else {
        console.error('Failed to accept the order');
      }
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const declineOrder = async (orderID) => {
    const courierID = localStorage.getItem('courierID');
    try {
      const response = await fetch(`http://localhost:3000/declineorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'orderID': orderID,
          'courierID': courierID,
        },
      });

      if (response.ok) {
        alert('Order Declined');
        const updatedOrders = orders.filter((order) => order.id !== orderID);
        setOrders(updatedOrders);
      } else {
        console.error('Failed to decline the order');
      }
    } catch (error) {
      console.error('Error declining order:', error);
    }
  };

  return (
    <div className="orders-list">
      <center>
      <header>
      <h1>Orders</h1>
      </header>
      </center>
      {orders && orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <form key={order.id}>
              <li>
                <div><strong>Order ID:</strong> {order.id}</div>
                <div><strong>Package Details:</strong> {order.packageDetails}</div>
                <div>
                  <strong>Pickup Location:</strong> {order.pickupLocation}<br />
                  <strong>Drop-off Location:</strong> {order.dropOffLocation}<br />
                  <strong>Delivery Time:</strong> {order.deliveryTime}<br/>
                  <strong>Status:</strong> {order.status}
                </div>
                <div>
                  <button
                    onClick={() => acceptOrder(order.id)}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => declineOrder(order.id)}
                  >
                    Decline
                  </button>
                </div>
              </li>
            </form>
          ))}
        </ul>
      ) : (
        <p>No orders found</p>
      )}
    </div>
  );
}

export default CourierDashboard;
