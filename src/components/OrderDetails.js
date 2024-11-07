import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./OrderDetails.css"; 

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [courier, setCourier] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/getorder",{
            method: "GET",
            headers: {
              "id": id,
            },
          });
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrder(data);
        if (data.courierID) {
          fetchCourierDetails(data.courierID);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };


    fetchOrderDetails();
  }, [id]);

  const fetchCourierDetails = async (courierID) => {
    try {
      const courierResponse = await fetch(`http://localhost:3000/getcourier?id=${courierID}`);
      if (!courierResponse.ok) {
        throw new Error("Failed to fetch courier details");
      }
      const courierData = await courierResponse.json();
      setCourier(courierData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const cancelOrder = async () => {
    if (order.status !== "pending") {
      alert("Order can only be cancelled if its status is 'pending'");
      return;  
    }

    try {
      const response = await fetch("http://localhost:3000/cancelorder", {
        method: "DELETE",
        headers: {
          "id": id,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      alert("Order cancelled successfully");
      navigate("/ListOfOrders");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header><h1>Order Details</h1></header>
      <form>
      <div>
          <p><b>Order ID:</b> {order.id}</p>
          <p><b>Pickup Location:</b> {order.pickupLocation}</p>
          <p><b>Drop Off Location:</b> {order.dropOffLocation}</p>
          <p><b>Package Details:</b> {order.packageDetails}</p>
          <p><b>Delivery Time:</b> {order.deliveryTime}</p>
          <p><b>Status:</b> {order.status}</p>
          
          {courier ? (
            <div>
              <p><b>Courier Name:</b> {courier.name}</p>
            </div>
          ) : (
            order.courierID && <p><b>Courier Info:</b> No courier details available</p>
          )}
        </div>
          <button type="button" onClick={cancelOrder}>Cancel Order</button>
        
      </form>
    </div>
  );
};

export default OrderDetails;
