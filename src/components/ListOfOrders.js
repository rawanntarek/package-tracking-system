import React, { useState, useEffect } from "react";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      console.log("Email:", email); // Log email to check if it's retrieved correctly
      if (!email) {
        alert("Email is required");
        return;
      }

      const response = await fetch("http://localhost:3000/getuserorders", {
        method: "GET",
        headers: {
          "email": email,
        },
      });

      console.log("Response status:", response.status); // Log response status
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      console.log("Data:", data); // Log the response data
      setOrders(data);
    } catch (error) {
      alert(error.message);
      console.log("Error:", error); // Log error message
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <header>
        <h1>User Orders</h1>
      </header>
      <div>
        <ul>
          {orders.map((order, index) => (
            <form>
            <li key={index}>
              
                <p>Order {index + 1}: {order.id}</p>
                <p>Status: {order.status}</p>
                <button>View Order Details</button>
              
            </li>
            </form>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserOrders;
