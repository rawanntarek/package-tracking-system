import React, { useState, useEffect } from 'react';

function CourierDashboard() {
  const [orders, setOrders] = useState([]);

  // Fetch all orders from the backend
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('http://localhost:3000/getallorders', {
          method: 'GET'
        });

        if (response.ok) {
          const orders = await response.json();
          setOrders(orders); // Set the orders to state
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }

    fetchOrders(); // Fetch orders on component mount
  }, []); // Empty dependency array to only run once on mount

  // Handle Accept Order
  const acceptOrder = async (orderID) => {
    const courierID = localStorage.getItem('courierID'); // Get courier's ID from localStorage
    
    try {
      const response = await fetch('http://localhost:3000/acceptorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set content type
          'orderID': orderID,                // Send orderID in the headers
          'courierID': courierID,            // Send courierID in the headers
        },
      });
  
      if (response.ok) {
        alert('Order Accepted and Assigned to Courier');
        // Refresh the orders list after accepting
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
  
  
//d/d/d
  // Handle Decline Order
  const declineOrder = async (orderID) => {
    try {
      const response = await fetch(`http://localhost:3000/declineorder?orderID=${orderID}`, {
        method: 'POST'
      });

      if (response.ok) {
        alert('Order Declined');
        // Refresh the orders list after declining
        const updatedOrders = orders.filter((order) => order._id !== orderID);
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
      {orders.length > 0 ? (
        <ul className="order-list">
          {orders.map((order) => (
            <form>
            <li key={order.id} className="order-item">
              
              <div><strong>Order ID:</strong> {order.id}</div> {/* Display Order ID */}
              <div><strong>Package Details:</strong> {order.packageDetails}</div>
              <div>
                <strong>Pickup Location:</strong> {order.pickupLocation}<br />
                <strong>Drop-off Location:</strong> {order.dropOffLocation}<br />
                <strong>Delivery Time:</strong> {order.deliveryTime}<br/>
                <strong>Status:</strong> {order.status}
              </div>
              
              <div className="buttons">
                <button
                  className="accept-btn"
                  onClick={() => acceptOrder(order.id)}
                >
                  Accept
                </button>
                <button
                  className="decline-btn"
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
