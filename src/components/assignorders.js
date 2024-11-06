import React, { useState, useEffect } from 'react';
import './assignorders.css';

const AssignOrders = () => {
    const [orders, setOrders] = useState([]);
    const [couriers, setCouriers] = useState([]);

    useEffect(() => {
        const fetchAllOrdersAndCouriers = async () => {
            try {
                // Fetch all orders
                const ordersResponse = await fetch("http://localhost:3000/getallorders", { method: "GET" });
                if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
                const ordersData = await ordersResponse.json();
                setOrders(ordersData);

                // Fetch couriers data
                const couriersResponse = await fetch("http://localhost:3000/getcouriers", { method: "GET" });
                if (!couriersResponse.ok) throw new Error('Failed to fetch couriers');
                const couriersData = await couriersResponse.json();
                setCouriers(couriersData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchAllOrdersAndCouriers();
    }, []);

    return (
        <div className="orders-list">
            <h3>Orders</h3>
            {orders.length > 0 ? (
                <ul className="order-list">
                    {orders.map((order) => (
                        <li key={order._id} className="order-item">
                            <div>{order.packageDetails}</div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No orders found</p>
            )}

            <h3>Couriers</h3>
            {couriers.length > 0 ? (
                <ul className="courier-list">
                    {couriers.map((courier) => (
                        <li key={courier._id} className="courier-item">
                            <div>{courier.name}</div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No couriers found</p>
            )}
        </div>
    );
};

export default AssignOrders;
