import React, { useState, useEffect } from 'react';
import { cakeData, cakeCategories } from '../utils/cakeData';
import CakeCard from '../components/CakeCard';
import { getCategoryIcon, formatPrice } from '../utils/helpers';

const GalleryPage = () => {
  const [cakes, setCakes] = useState(cakeData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState(100);

  // Filter cakes based on search, category, and price
  useEffect(() => {
    let filtered = [...cakeData];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(cake =>
        cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(cake => cake.category === selectedCategory);
    }

    // Filter by price
    filtered = filtered.filter(cake => cake.price <= priceRange);

    // Sort cakes
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.isNew - a.isNew);
        break;
      default:
        // Default sorting (popular first)
        filtered.sort((a, b) => b.isPopular - a.isPopular);
    }

    setCakes(filtered);
  }, [searchTerm, selectedCategory, sortBy, priceRange]);

  return (
    <div className="container-fluid px-0">
      {/* Hero Banner */}
      <div className="py-5 text-center" style={{
        background: 'linear-gradient(135deg, rgba(106,17,203,0.1) 0%, rgba(255,107,139,0.1) 100%)'
      }}>
        <div className="container">
          <h1 className="display-3 font-script gradient-text mb-3">Cake Gallery</h1>
          <p className="lead fs-4 text-chocolate">
            Browse our collection of handcrafted masterpieces
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container py-4">
        <div className="glass-card p-4 mb-5">
          <div className="row g-3">
            {/* Search Bar */}
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-cream border-0">
                  <i className="bi bi-search text-chocolate"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-cream"
                  placeholder="Search cakes by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Quick Filters */}
<div className="mb-5">
  <h4 className="mb-3 text-chocolate">Browse by Category</h4>
  <div className="d-flex flex-wrap gap-2">
    {cakeCategories.map(category => (
      <button
        key={category}
        className={`btn ${selectedCategory === category ? 'btn-apricot' : 'btn-outline-apricot'} d-flex align-items-center`}
        onClick={() => setSelectedCategory(category)}
      >
        <i className={`bi ${getCategoryIcon(category)} me-2`}></i>
        {category}
        {category !== 'All' && (
          <span className="badge bg-lavender ms-2">
            {cakeData.filter(cake => cake.category === category).length}
          </span>
        )}
      </button>
    ))}
  </div>
</div>

            {/* Sort By */}
            <div className="col-md-3">
              <select
                className="form-select bg-cream border-0"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort by: Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Price Range Slider */}
            <div className="col-12 mt-3">
              <div className="d-flex align-items-center gap-3">
                <span className="text-chocolate fw-medium">Price Range:</span>
                <span className="text-apricot fw-bold">${priceRange}</span>
                <input
                  type="range"
                  className="form-range flex-grow-1"
                  min="20"
                  max="100"
                  step="5"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  style={{ accentColor: 'var(--apricot)' }}
                />
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="col-12">
              <div className="d-flex flex-wrap gap-2">
                {selectedCategory !== 'All' && (
                  <span className="badge bg-apricot d-flex align-items-center gap-1">
                    {selectedCategory}
                    <button 
                      className="btn-close btn-close-white btn-sm ms-1"
                      onClick={() => setSelectedCategory('All')}
                    ></button>
                  </span>
                )}
                {searchTerm && (
                  <span className="badge bg-strawberry d-flex align-items-center gap-1">
                    Search: "{searchTerm}"
                    <button 
                      className="btn-close btn-close-white btn-sm ms-1"
                      onClick={() => setSearchTerm('')}
                    ></button>
                  </span>
                )}
                <span className="badge bg-lavender">
                  Max Price: ${priceRange}
                </span>
                <span className="badge bg-sprinkle-blue">
                  {cakes.length} {cakes.length === 1 ? 'Cake' : 'Cakes'} Found
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Quick Filters */}
        <div className="mb-5">
          <h4 className="mb-3 text-chocolate">Browse by Category</h4>
          <div className="d-flex flex-wrap gap-2">
            {cakeCategories.map(category => (
              <button
                key={category}
                className={`btn ${selectedCategory === category ? 'btn-apricot' : 'btn-outline-apricot'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                {category !== 'All' && (
                  <span className="badge bg-lavender ms-2">
                    {cakeData.filter(cake => cake.category === category).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cakes Grid */}
        {cakes.length > 0 ? (
          <>
            <div className="row">
              {cakes.map(cake => (
                <CakeCard key={cake.id} cake={cake} />
              ))}
            </div>

            {/* Results Info */}
            <div className="text-center mt-5">
              <div className="glass-card d-inline-flex align-items-center gap-4 p-4">
                <div>
                  <h5 className="text-chocolate mb-1">Showing</h5>
                  <span className="fs-3 fw-bold text-apricot">{cakes.length}</span>
                  <span className="text-muted"> cakes</span>
                </div>
                <div className="vr"></div>
                <div>
                  <h5 className="text-chocolate mb-1">Price Range</h5>
                  <span className="fs-3 fw-bold text-strawberry">${Math.min(...cakes.map(c => c.price))}</span>
                  <span className="text-muted"> - </span>
                  <span className="fs-3 fw-bold text-strawberry">${Math.max(...cakes.map(c => c.price))}</span>
                </div>
                <div className="vr"></div>
                <div>
                  <h5 className="text-chocolate mb-1">Average Rating</h5>
                  <span className="fs-3 fw-bold text-lavender">
                    {(cakes.reduce((sum, cake) => sum + cake.rating, 0) / cakes.length).toFixed(1)}
                  </span>
                  <i className="bi bi-star-fill text-warning ms-1"></i>
                </div>
              </div>
            </div>
          </>
        ) : (
          // No Results Found
          <div className="text-center py-5">
            <div className="glass-card p-5 d-inline-block">
              <i className="bi bi-cake text-muted" style={{ fontSize: '4rem' }}></i>
              <h3 className="mt-3 text-chocolate">No Cakes Found</h3>
              <p className="text-muted mb-4">
                Try adjusting your filters or search term
              </p>
              <button 
                className="btn btn-frosting"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setPriceRange(100);
                  setSortBy('default');
                }}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* Inspiration Section */}
        <div className="mt-5 py-5 glass-card">
          <div className="text-center mb-4">
            <h3 className="text-chocolate">Need Inspiration?</h3>
            <p className="text-muted">Check out our most popular categories</p>
          </div>
          
          <div className="row">
            {['Birthday', 'Wedding', 'Anniversary'].map(category => {
              const categoryCakes = cakeData.filter(cake => cake.category === category);
              return (
                <div key={category} className="col-md-4 mb-4">
                  <div className="card border-0 h-100">
                    <div className="position-relative overflow-hidden rounded-top" style={{ height: '200px' }}>
                      <img
                        src={categoryCakes[0]?.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=200&fit=crop'}
                        className="card-img-top h-100 w-100 object-fit-cover"
                        alt={category}
                      />
                      <div className="card-img-overlay d-flex align-items-end p-0">
                        <div className="w-100 bg-dark bg-opacity-50 p-3">
                          <h5 className="text-white mb-0">{category} Cakes</h5>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">
                        {categoryCakes.length} unique designs for your {category.toLowerCase()} celebration
                      </p>
                      <button 
                        className="btn btn-outline-apricot w-100"
                        onClick={() => setSelectedCategory(category)}
                      >
                        View All {category} Cakes
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;