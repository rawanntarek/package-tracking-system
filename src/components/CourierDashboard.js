import React, { useState, useEffect } from 'react';

function CourierDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('http://localhost:3000/getallorders', {
          method: 'GET',
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

  // Handle Decline Order

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
    <div>
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
                <div><b>Order ID:</b> {order.id}</div>
                <div><b>Package Details:</b> {order.packageDetails}</div>
                <div>
                  <b>Pickup Location:</b> {order.pickupLocation}<br />
                  <b>Drop-off Location:</b> {order.dropOffLocation}<br />
                  <b>Delivery Time:</b> {order.deliveryTime}<br/>
                  <b>Status:</b> {order.status}
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
              <a href='/CourierAssignedOrders'>assigned orders</a>

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
