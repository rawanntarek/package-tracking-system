import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './assignorders.css';

const AssignOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchCouriers();
  }, []);

  // Fetch orders from the backend API
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/getallorders'); // Replace with your API URL
      const data = await response.json();
      setOrders(data); // Assuming the API response returns a list of orders
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Fetch couriers (you can replace this with a real API call)
  const fetchCouriers = async () => {
    // Assuming couriers are fetched from another API
    try {
      const response = await fetch('http://localhost:8080/getAllCouriers'); // Replace with your API URL
      const data = await response.json();
      setCouriers(data); // Assuming the API response returns a list of couriers
    } catch (error) {
      console.error('Error fetching couriers:', error);
    }
  };

  const handleAssignOrder = async (orderId, courierId) => {
    try {
      // Here you can make an API call to assign the order to the courier
      const response = await fetch('http://localhost:8080/assignOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, courierId }),
      });

      if (response.ok) {
        alert(`Order ${orderId} assigned to Courier ${courierId}`);
        // Optionally, you can refetch orders or update the state to reflect the changes
        fetchOrders();
      } else {
        alert('Failed to assign order');
      }
    } catch (error) {
      console.error('Error assigning order:', error);
    }
  };

  return (
    <div className="assign-orders">
      <h1>Assign Orders to Courier</h1>
      <p>Select an order and assign it to a courier.</p>
      <div className="orders-list">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>courierID</th>
              <th>courierName</th>
              <th>courierPhone</th>
              <th>ReAssign Courier</th>

            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.id}</td>
                <td>{order.status}</td>
                <td>{order.courierID}</td>
                <td>{order.courierName}</td>
                <td>{order.courierPhone}</td>
                

                <td>
                  <select
                    onChange={(e) => handleAssignOrder(order._id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Select Courier</option>
                    {couriers.map((courier) => (
                      <option key={courier.id} value={courier.id}>
                        {courier.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignOrders;
