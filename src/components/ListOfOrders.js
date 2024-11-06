import React, { useState, useEffect } from 'react';
import './ListOfOrders.css';  // Assuming your CSS is in the same folder
import { useNavigate } from 'react-router-dom';

const ListOfOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        if (!userEmail) {
            navigate("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch("http://localhost:3000/getuserorders", {
                    method: "GET",
                    headers: {
                        "email": userEmail,  // Match backend header
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();

                if (Array.isArray(data) && data.length === 0) {
                    setOrders([]); // No orders found
                } else {
                    const ordersWithStringId = data.map(order => ({
                        ...order,
                        _id: order._id, // Convert ObjectId to string
                    }));
                    setOrders(ordersWithStringId);
                    setSelectedOrder(ordersWithStringId[0] || null); // Automatically select the first order if available
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [userEmail, navigate]);

    const handleOrderClick = (orderId) => {
        const order = orders.find((order) => order._id === orderId);
        setSelectedOrder(order);
    };

    const handleGoBack = () => {
        setSelectedOrder(null);
    };

    const renderOrderDetailsForm = () => {
        if (!selectedOrder) return null;

        return (
            <form className="order-details-form">
                <h3>Order Details</h3>
                <div>
                    <label><strong>Order ID:</strong></label>
                    <input type="text" value={selectedOrder._id} disabled />
                </div>
                <div>
                    <label><strong>Package Details:</strong></label>
                    <textarea value={selectedOrder.packageDetails} disabled />
                </div>
                <div>
                    <button type="button" onClick={handleGoBack}>Back to Orders</button>
                </div>
            </form>
        );
    };

    let orderListContent;
    if (orders.length > 0) {
        orderListContent = (
            <ul className="order-list">
                {orders.map((order) => (
                    <li key={order._id} onClick={() => handleOrderClick(order._id)} className="order-item">
                        Order ID: {order._id} - {order.packageDetails || "No Details"}
                    </li>
                ))}
            </ul>
        );
    } else {
        orderListContent = <p>No orders found</p>;
    }

    return (
        <div>
            <main>
                <center>
                    <h2>Package Tracking System</h2>
                    <h2>Your Orders</h2>
                </center>
            </main>
            <center>
                <form>
                    <label>Orders</label>
                    <div className="orders-list">
                        {selectedOrder ? renderOrderDetailsForm() : orderListContent}
                    </div>
                </form>
            </center>
        </div>
    );
};

export default ListOfOrders;
