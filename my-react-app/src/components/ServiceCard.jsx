import React from 'react';

const ServiceCard = ({ service, onClick }) => {
  return (
    <div className="service-card" data-service={service.name} onClick={() => onClick(service.name)}>
      <img src={service.image} alt={service.name} />
      <div className="service-content">
        <h3>{service.name}</h3>
        <p>{service.description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
