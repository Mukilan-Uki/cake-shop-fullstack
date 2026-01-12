import React from 'react';
import { Link } from 'react-router-dom';

const CakeCard = ({ cake }) => {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card glass-card h-100 border-0">
        {/* Cake Image */}
        <div className="position-relative overflow-hidden rounded-top">
          <img 
            src={cake.image} 
            className="card-img-top"
            alt={cake.name}
            style={{ height: '250px', objectFit: 'cover' }}
          />
          
          {/* Badges */}
          <div className="position-absolute top-0 end-0 p-2">
            {cake.isNew && (
              <span className="badge bg-success me-1">NEW</span>
            )}
            {cake.isPopular && (
              <span className="badge bg-warning">POPULAR</span>
            )}
          </div>
          
          {/* Overlay */}
          <div className="card-img-overlay d-flex align-items-end p-0">
            <div className="w-100 bg-dark bg-opacity-50 p-3">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-white fw-bold">{cake.category}</span>
                <span className="text-white">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  {cake.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cake Details */}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold text-chocolate">{cake.name}</h5>
          <p className="card-text text-muted flex-grow-1">{cake.description}</p>
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <span className="fw-bold fs-4 text-apricot">${cake.price}</span>
              <small className="text-muted ms-2">starting from</small>
            </div>
            
            // Replace the button section in CakeCard.js with this:
<div className="d-flex justify-content-between align-items-center mt-3">
  <div>
    <span className="fw-bold fs-4 text-apricot">${cake.price}</span>
    <small className="text-muted ms-2">starting from</small>
  </div>
  
  <div className="d-flex justify-content-between align-items-center mt-3">
  <div>
    <span className="fw-bold fs-4 text-apricot">${cake.price}</span>
    <small className="text-muted ms-2">starting from</small>
  </div>
  
  <div className="d-flex gap-2">
    <button 
      className="btn btn-outline-apricot"
      onClick={(e) => {
        e.stopPropagation();
        alert(`Quick view: ${cake.name}`);
      }}
      title="Quick View"
    >
      <i className="bi bi-eye"></i>
    </button>
    <button 
      className="btn btn-frosting"
      onClick={(e) => {
        e.stopPropagation();
        alert(`Added ${cake.name} to cart!`);
      }}
    >
      <i className="bi bi-cart-plus me-1"></i>
      Add to Cart
    </button>
  </div>
</div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CakeCard;