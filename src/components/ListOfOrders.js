import React, { useState } from 'react';
import './ListOfOrders.css';
import { useNavigate } from 'react-router-dom';

const ListOfOrders = () => {
    
    const [orders, setOrders] = useState([
        { id: 1, item: 'Laptop', status: 'Shipped' },
        { id: 2, item: 'Phone', status: 'In Transit' },
        { id: 3, item: 'Headphones', status: 'Delivered' },
    ]);
    
    let content;

if (orders.length > 0) {
    // If there are orders, render each one in a list
    content = (
        <ul>
            {orders.map(order => (
                <li key={order.id}>
                    <strong>Item:</strong> {order.item} <br />
                    <strong>Status:</strong> {order.status}
                </li>
            ))}
        </ul>
    );
} else {
    // If there are no orders, display a message
    content = <p>No orders found</p>;
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
                       {content}
                    </div>
                </form>
            </center>
        </div>
    );
}

export default ListOfOrders;
