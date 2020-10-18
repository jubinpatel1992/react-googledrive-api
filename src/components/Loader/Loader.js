import React from 'react';
import './Loader.css';

export const Loader = ({ status }) => {
    return (
        <div className="loader-container">
            <div className="loader"></div>
            <div className="loader-message">{status}</div>
        </div>
    )
}