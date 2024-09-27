import React from 'react';
import './Card.css';

const Card = () => {
  return (
    <div className="card">
      <img
        src="https://m.media-amazon.com/images/I/71sVQDj0SCL._AC_UF1000,1000_QL80_.jpg"
        className="card-img"
        alt="Book cover"
      />
      <div className="card-body">
        <h1 className="card-title">Book</h1>
        <p className="card-sub-title">New York City</p>
        <p className="card-infor">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <button className="card-btn">Book</button>
      </div>
    </div>
  );
};

export default Card;
