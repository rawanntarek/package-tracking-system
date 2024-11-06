import React, { useState, useEffect } from 'react';
import './ListOfOrders.css';
import { useNavigate } from 'react-router-dom';

const ListOfOrders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Get the logged-in user's email from localStorage or a global state
                const email = localStorage.getItem('userEmail');
                console.log('User email:', email); // Check if the email is correctly retrieved

                if (!email) {
                    alert('No user email found in local storage!');
                    return;
                }
                // Send a GET request to the backend with the logged-in user's email
                const response = await fetch(`http://localhost:3000/listorders?email=${email}`);
                
                if (!response.ok) {
                    const errorData = await response.text();
                    alert(errorData);
                    return;
                }

                const data = await response.json();
                setOrders(data);  // Set the fetched orders to state
            } catch (error) {
                alert('Error fetching orders: ' + error.message);
            }
        };

        fetchOrders();
    }, [navigate]);

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
