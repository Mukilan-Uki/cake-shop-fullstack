import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cakeData } from '../utils/cakeData';
import CakeCard from '../components/CakeCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredCakes, setFeaturedCakes] = useState([]);
  
  useEffect(() => {
    // Get 3 featured cakes
    setFeaturedCakes(cakeData.slice(0, 3));
  }, []);

  const features = [
    { icon: 'bi-palette', title: 'Custom Design', desc: 'Design your unique cake masterpiece' },
    { icon: 'bi-truck', title: 'Fast Delivery', desc: 'Fresh delivery to your doorstep' },
    { icon: 'bi-star', title: 'Premium Quality', desc: 'Handcrafted with love and care' },
    { icon: 'bi-shield-check', title: '100% Satisfaction', desc: 'Guaranteed delicious results' }
  ];

  return (
    <div className="container-fluid px-0">
      {/* Hero Section */}
      <section className="hero-section py-5" style={{
        background: 'linear-gradient(135deg, rgba(255,158,109,0.1) 0%, rgba(255,107,139,0.1) 100%)'
      }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-1 font-script gradient-text mb-4">
                Sweet Moments,<br />Delivered
              </h1>
              <p className="lead fs-4 text-chocolate mb-5">
                Transform your celebrations with handcrafted cakes made with love, delivered fresh to create unforgettable memories
              </p>
              <div className="d-flex flex-column flex-md-row gap-3">
                <button 
                  onClick={() => navigate('/create')}
                  className="btn btn-frosting btn-lg px-5 py-3"
                >
                  <i className="bi bi-magic me-2"></i>
                  Design Your Cake
                </button>
                <button 
                  onClick={() => navigate('/gallery')}
                  className="btn btn-outline-apricot btn-lg px-5 py-3"
                >
                  <i className="bi bi-images me-2"></i>
                  Browse Gallery
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-5 mt-lg-0">
              <div className="position-relative">
                <i className="bi bi-cake-fill text-apricot" style={{ fontSize: '10rem' }}></i>
                <div className="position-absolute top-0 start-0">
                  <i className="bi bi-star-fill text-sprinkle-pink fs-1 animate-float"></i>
                </div>
                <div className="position-absolute top-0 end-0">
                  <i className="bi bi-star-fill text-sprinkle-blue fs-1 animate-float" style={{ animationDelay: '0.5s' }}></i>
                </div>
                <div className="position-absolute bottom-0 start-50 translate-middle-x">
                  <i className="bi bi-star-fill text-lavender fs-1 animate-float" style={{ animationDelay: '1s' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cakes */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-chocolate mb-3">Featured Cakes</h2>
            <p className="lead text-muted">Our most popular creations loved by customers</p>
          </div>
          
          <div className="row">
            {featuredCakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
          
          <div className="text-center mt-5">
            <button 
              onClick={() => navigate('/gallery')}
              className="btn btn-outline-chocolate btn-lg"
            >
              View All Cakes <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5 bg-cream">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-chocolate mb-3">Why Choose Sweet Canvas?</h2>
            <p className="lead text-muted">Experience the difference of artisanal cake making</p>
          </div>
          
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3 mb-4">
                <div className="glass-card p-4 text-center h-100">
                  <div className="rounded-circle bg-apricot bg-opacity-10 p-3 d-inline-flex mb-3">
                    <i className={`bi ${feature.icon} fs-2 text-apricot`}></i>
                  </div>
                  <h4 className="fw-bold mb-3">{feature.title}</h4>
                  <p className="text-muted mb-0">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <div className="glass-card p-5 text-center" style={{
            background: 'linear-gradient(135deg, rgba(255,158,109,0.1) 0%, rgba(106,17,203,0.1) 100%)'
          }}>
            <h2 className="display-4 font-script mb-4">Ready to Create Magic?</h2>
            <p className="lead fs-4 text-chocolate mb-5">
              Design your dream cake today and make your occasion truly unforgettable
            </p>
            <button 
              onClick={() => navigate('/create')}
              className="btn btn-frosting btn-lg px-5 py-3"
            >
              <i className="bi bi-lightning-charge me-2"></i>
              Start Designing Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;