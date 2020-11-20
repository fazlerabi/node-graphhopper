import React from 'react';
import './marker.css';

const Marker = (props) => {
  const { name, title } = props;
  return (
    <div>
      <div className="pin" title={name}>
        { title.includes('home') ? 'H' : name}
      </div>
    </div>
  );
};

export default Marker;
