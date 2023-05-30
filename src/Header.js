import React from 'react';
import './Header.css';
import { Link } from "react-router-dom";

function Header() {
    return (
        <div className="header">
            <hi>Stock App</hi>
            <nav>
                <ul className="navbar">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/stocks">Stocks</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Header;