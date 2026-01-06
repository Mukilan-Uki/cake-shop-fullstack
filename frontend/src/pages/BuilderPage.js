import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BuilderPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Cake Design State
  const [cakeDesign, setCakeDesign] = useState({
    base: 'chocolate',
    frosting: 'vanilla',
    size: 'medium',
    layers: 2,
    toppings: [],
    message: '',
    colors: {
      cake: '#D2691E',  // Chocolate brown
      frosting: '#FFF5E6', // Cream
      decorations: '#FF6B8B' // Strawberry pink
    },
    price: 39.99
  });

  const [isSaving, setIsSaving] = useState(false);

  // Add undo/redo history
const [designHistory, setDesignHistory] = useState([]);
const [historyIndex, setHistoryIndex] = useState(-1);

  // Available Options
  const cakeBases = [
    { id: 'chocolate', name: 'Chocolate', price: 5, color: '#8B4513' },
    { id: 'vanilla', name: 'Vanilla', price: 4, color: '#F3E5AB' },
    { id: 'red-velvet', name: 'Red Velvet', price: 6, color: '#8B0000' },
    { id: 'carrot', name: 'Carrot', price: 5, color: '#FF8C00' },
    { id: 'lemon', name: 'Lemon', price: 4, color: '#FFFACD' }
  ];

  const frostings = [
    { id: 'vanilla', name: 'Vanilla Buttercream', price: 3, color: '#FFF5E6' },
    { id: 'chocolate', name: 'Chocolate Ganache', price: 4, color: '#4A2C2A' },
    { id: 'cream-cheese', name: 'Cream Cheese', price: 4, color: '#FFFAF0' },
    { id: 'strawberry', name: 'Strawberry', price: 3, color: '#FFB6C1' },
    { id: 'matcha', name: 'Matcha', price: 5, color: '#98FB98' }
  ];

  const toppings = [
    { id: 'sprinkles', name: 'Sprinkles', price: 2, icon: 'bi-stars' },
    { id: 'berries', name: 'Fresh Berries', price: 4, icon: 'bi-berry' },
    { id: 'flowers', name: 'Edible Flowers', price: 5, icon: 'bi-flower1' },
    { id: 'chocolate-chips', name: 'Chocolate Chips', price: 3, icon: 'bi-droplet' },
    { id: 'nuts', name: 'Crushed Nuts', price: 3, icon: 'bi-tree' },
    { id: 'gold-leaf', name: 'Gold Leaf', price: 8, icon: 'bi-gem' }
  ];

  const sizes = [
    { id: 'small', name: 'Small (4-6 people)', price: 29.99, serves: '4-6' },
    { id: 'medium', name: 'Medium (8-10 people)', price: 39.99, serves: '8-10' },
    { id: 'large', name: 'Large (12-15 people)', price: 49.99, serves: '12-15' },
    { id: 'xl', name: 'Extra Large (20+ people)', price: 69.99, serves: '20+' }
  ];

  // Calculate total price
  const calculatePrice = () => {
    const basePrice = sizes.find(s => s.id === cakeDesign.size)?.price || 39.99;
    const baseCake = cakeBases.find(b => b.id === cakeDesign.base)?.price || 0;
    const frostingPrice = frostings.find(f => f.id === cakeDesign.frosting)?.price || 0;
    const toppingsPrice = cakeDesign.toppings.length * 2;
    const layersPrice = (cakeDesign.layers - 2) * 3; // Extra layers cost
    
    return basePrice + baseCake + frostingPrice + toppingsPrice + layersPrice;
  };

  // Calculate design complexity
const calculateComplexity = () => {
  let score = 0;
  
  // More layers = more complex
  score += cakeDesign.layers * 10;
  
  // More toppings = more complex
  score += cakeDesign.toppings.length * 5;
  
  // Custom message adds complexity
  score += cakeDesign.message ? 5 : 0;
  
  // Custom colors add complexity
  const defaultColors = { cake: '#D2691E', frosting: '#FFF5E6', decorations: '#FF6B8B' };
  const isCustomColor = 
    cakeDesign.colors.cake !== defaultColors.cake ||
    cakeDesign.colors.frosting !== defaultColors.frosting ||
    cakeDesign.colors.decorations !== defaultColors.decorations;
  
  if (isCustomColor) score += 10;
  
  // Determine complexity level
  if (score < 20) return { 
    level: 'Simple', 
    color: 'success',
    description: 'Easy to make, quick delivery'
  };
  if (score < 40) return { 
    level: 'Moderate', 
    color: 'warning',
    description: 'Standard preparation time'
  };
  return { 
    level: 'Complex', 
    color: 'danger',
    description: 'Requires extra time & care'
  };
};

  // Handle topping selection
  const toggleTopping = (toppingId) => {
    setCakeDesign(prev => ({
      ...prev,
      toppings: prev.toppings.includes(toppingId)
        ? prev.toppings.filter(id => id !== toppingId)
        : [...prev.toppings, toppingId]
    }));
  };

  // Handle color change
  const handleColorChange = (type, color) => {
    setCakeDesign(prev => ({
      ...prev,
      colors: { ...prev.colors, [type]: color }
    }));
  };

  // Update design with history tracking
const updateDesignWithHistory = (newDesign) => {
  const newHistory = designHistory.slice(0, historyIndex + 1);
  newHistory.push(newDesign);
  
  setDesignHistory(newHistory);
  setHistoryIndex(newHistory.length - 1);
  setCakeDesign(newDesign);
};

// Update ALL setCakeDesign calls to use this instead
// For example, change:
// onClick={() => setCakeDesign(prev => ({ ...prev, base: base.id }))}
// TO:
// onClick={() => updateDesignWithHistory({ ...cakeDesign, base: base.id })}

  // Draw cake preview on canvas

  // Validate design before saving
const validateDesign = () => {
  const errors = [];
  
  if (cakeDesign.layers > 5) {
    errors.push('Maximum 5 layers allowed');
  }
  
  if (cakeDesign.message && cakeDesign.message.length > 30) {
    errors.push('Message must be 30 characters or less');
  }
  
  if (cakeDesign.toppings.length > 5) {
    errors.push('Maximum 5 toppings allowed');
  }
  
  return errors;
};

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cake dimensions
    const cakeWidth = 200;
    const cakeHeight = 150;
    const cakeX = (canvas.width - cakeWidth) / 2;
    const cakeY = (canvas.height - cakeHeight) / 2;

    // Draw cake layers
    const layerHeight = cakeHeight / cakeDesign.layers;
    for (let i = 0; i < cakeDesign.layers; i++) {
      // Cake layer
      ctx.fillStyle = cakeDesign.colors.cake;
      ctx.fillRect(cakeX, cakeY + i * layerHeight, cakeWidth, layerHeight - 2);
      
      // Frosting between layers (except top)
      if (i < cakeDesign.layers - 1) {
        ctx.fillStyle = cakeDesign.colors.frosting;
        ctx.fillRect(cakeX, cakeY + (i + 1) * layerHeight - 2, cakeWidth, 4);
      }
    }

    // Top frosting
    ctx.fillStyle = cakeDesign.colors.frosting;
    ctx.beginPath();
    ctx.moveTo(cakeX, cakeY);
    ctx.lineTo(cakeX + cakeWidth, cakeY);
    ctx.lineTo(cakeX + cakeWidth - 20, cakeY - 15);
    ctx.lineTo(cakeX + 20, cakeY - 15);
    ctx.closePath();
    ctx.fill();

    // Decorations
    if (cakeDesign.toppings.includes('sprinkles')) {
      ctx.fillStyle = cakeDesign.colors.decorations;
      for (let i = 0; i < 20; i++) {
        const x = cakeX + Math.random() * cakeWidth;
        const y = cakeY + Math.random() * cakeHeight;
        ctx.fillRect(x, y, 3, 3);
      }
    }

    // Cake message
    if (cakeDesign.message) {
      ctx.fillStyle = '#4A2C2A';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(cakeDesign.message, canvas.width / 2, cakeY + cakeHeight + 30);
    }
  }, [cakeDesign]);

  // Auto-save feature
useEffect(() => {
  const autoSaveTimer = setTimeout(() => {
    if (Object.keys(cakeDesign).length > 0) {
      // Save to temporary storage
      localStorage.setItem('cakeDesignDraft', JSON.stringify(cakeDesign));
      console.log('Design auto-saved');
    }
  }, 5000); // Auto-save every 5 seconds

  return () => clearTimeout(autoSaveTimer);
}, [cakeDesign]);

// Load draft on component mount
useEffect(() => {
  const savedDraft = localStorage.getItem('cakeDesignDraft');
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft);
      setCakeDesign(draft);
      console.log('Draft design loaded');
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }
}, []);

  // Save design and proceed to order
  // Handle Save Design with loading state
const handleSaveDesign = async () => {
// Validate first
  const errors = validateDesign();
  if (errors.length > 0) {
    alert(`Please fix the following:\n${errors.join('\n')}`);
    return;
  }
  
  setIsSaving(true);  
  // Simulate save delay (like API call)
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const design = {
    ...cakeDesign,
    finalPrice: calculatePrice(),
    designId: Date.now(),
    createdAt: new Date().toISOString()
  };
  
  // Save to localStorage
  localStorage.setItem('cakeDesign', JSON.stringify(design));
  
  setIsSaving(false);
  
  // Show success message
  alert('🎂 Design saved successfully! Redirecting to order...');
  
  // Navigate to order page
  navigate('/order', { state: { design } });
};

  

  return (
    <div className="container-fluid px-0">
      {/* Builder Header */}
      <div className="py-5 text-center" style={{
        background: 'linear-gradient(135deg, rgba(255,158,109,0.1) 0%, rgba(106,17,203,0.1) 100%)'
      }}>
        <div className="container">
          <h1 className="display-3 font-script gradient-text mb-3">Design Your Cake</h1>
          <p className="lead fs-4 text-chocolate">
            Create your perfect cake masterpiece step by step
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          {/* Left Column - Cake Preview */}
          <div className="col-lg-5 mb-5 mb-lg-0">
            <div className="glass-card p-4 h-100">
              <h3 className="text-chocolate mb-4">Live Preview</h3>
              
              {/* Undo/Redo Controls */}
<div className="d-flex justify-content-center gap-2 mb-3">
  <button
    className="btn btn-outline-secondary btn-sm"
    onClick={() => {
      if (historyIndex > 0) {
        setHistoryIndex(prev => prev - 1);
        setCakeDesign(designHistory[historyIndex - 1]);
      }
    }}
    disabled={historyIndex <= 0}
  >
    <i className="bi bi-arrow-counterclockwise"></i> Undo
  </button>
  
  <button
    className="btn btn-outline-secondary btn-sm"
    onClick={() => {
      if (historyIndex < designHistory.length - 1) {
        setHistoryIndex(prev => prev + 1);
        setCakeDesign(designHistory[historyIndex + 1]);
      }
    }}
    disabled={historyIndex >= designHistory.length - 1}
  >
    Redo <i className="bi bi-arrow-clockwise"></i>
  </button>
</div>
              {/* Canvas Preview */}
              <div className="text-center mb-4">
                <canvas 
                  ref={canvasRef}
                  width={400}
                  height={300}
                  className="border rounded bg-cream w-100"
                  style={{ maxWidth: '400px' }}
                />
              </div>

              {/* Design Summary */}
              <div className="glass-card p-3 mb-4">
                <h5 className="text-chocolate mb-3">Your Design Summary</h5>
                <div className="row">
                  <div className="col-6">
                    <p className="mb-2"><strong>Base:</strong> {cakeBases.find(b => b.id === cakeDesign.base)?.name}</p>
                    <p className="mb-2"><strong>Frosting:</strong> {frostings.find(f => f.id === cakeDesign.frosting)?.name}</p>
                  </div>
                  <div className="col-6">
                    <p className="mb-2"><strong>Size:</strong> {sizes.find(s => s.id === cakeDesign.size)?.name}</p>
                    <p className="mb-2"><strong>Layers:</strong> {cakeDesign.layers}</p>
                  </div>
                </div>
                <p className="mb-0"><strong>Toppings:</strong> {cakeDesign.toppings.length} selected</p>

                {/* Design Complexity Badge */}
<div className="mt-3 d-flex flex-wrap gap-2">
  <span className={`badge bg-${calculateComplexity().color}`}>
    <i className="bi bi-lightning me-1"></i>
    {calculateComplexity().level}
  </span>
  
  <span className="badge bg-info">
    <i className="bi bi-clock me-1"></i>
    {cakeDesign.layers * 2} hours preparation
  </span>
  
  {cakeDesign.toppings.length > 0 && (
    <span className="badge bg-purple">
      <i className="bi bi-stars me-1"></i>
      {cakeDesign.toppings.length} toppings
    </span>
  )}
</div>

{/* Complexity Description */}
<p className="text-muted mt-2 mb-0 small">
  <i className="bi bi-info-circle me-1"></i>
  {calculateComplexity().description}
</p>
              </div>

              {/* Total Price */}
              <div className="text-center">
                <div className="display-6 fw-bold gradient-text mb-3">
                  ${calculatePrice().toFixed(2)}
                </div>
                {/* Auto-save Status */}
<div className="text-center mb-3">
  <small className="text-muted">
    <i className="bi bi-cloud-check me-1"></i>
    Design auto-saves every 5 seconds
  </small>
</div>
                <button 
  className="btn btn-frosting btn-lg w-100"
  onClick={handleSaveDesign}
  disabled={isSaving}
>
  {isSaving ? (
    <>
      <span className="spinner-border spinner-border-sm me-2"></span>
      Saving Your Design...
    </>
  ) : (
    <>
      <i className="bi bi-check-circle me-2"></i>
      Save Design & Continue to Order
    </>
  )}
</button>
              </div>
            </div>
          </div>

          {/* Right Column - Design Options */}
          <div className="col-lg-7">
            {/* Step 1: Cake Base */}
            <div className="glass-card p-4 mb-4">
              <h4 className="text-chocolate mb-4">
                <span className="badge bg-apricot me-2">1</span>
                Choose Cake Base
              </h4>
              <div className="row g-3">
                {cakeBases.map(base => (
                  <div key={base.id} className="col-6 col-md-4">
                    <button
                      className={`btn w-100 h-100 p-3 ${cakeDesign.base === base.id ? 'btn-apricot' : 'btn-outline-apricot'}`}
                      onClick={() => setCakeDesign(prev => ({ ...prev, base: base.id }))}
                    >
                      <div 
                        className="rounded-circle mx-auto mb-2"
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: base.color,
                          border: '2px solid white'
                        }}
                      ></div>
                      <div className="fw-medium">{base.name}</div>
                      <small className="text-muted">+${base.price}</small>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Frosting */}
            <div className="glass-card p-4 mb-4">
              <h4 className="text-chocolate mb-4">
                <span className="badge bg-strawberry me-2">2</span>
                Choose Frosting
              </h4>
              <div className="row g-3">
                {frostings.map(frosting => (
                  <div key={frosting.id} className="col-6 col-md-4">
                    <button
                      className={`btn w-100 h-100 p-3 ${cakeDesign.frosting === frosting.id ? 'btn-strawberry' : 'btn-outline-strawberry'}`}
                      onClick={() => setCakeDesign(prev => ({ ...prev, frosting: frosting.id }))}
                    >
                      <div 
                        className="rounded-circle mx-auto mb-2"
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: frosting.color,
                          border: '2px solid white'
                        }}
                      ></div>
                      <div className="fw-medium">{frosting.name}</div>
                      <small className="text-muted">+${frosting.price}</small>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Size & Layers */}
            <div className="glass-card p-4 mb-4">
              <h4 className="text-chocolate mb-4">
                <span className="badge bg-lavender me-2">3</span>
                Size & Layers
              </h4>
              
              {/* Size Selection */}
              <div className="mb-4">
                <h6 className="text-chocolate mb-3">Cake Size</h6>
                <div className="d-flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size.id}
                      className={`btn ${cakeDesign.size === size.id ? 'btn-lavender' : 'btn-outline-lavender'}`}
                      onClick={() => setCakeDesign(prev => ({ ...prev, size: size.id }))}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layers Selection */}
              <div>
                <h6 className="text-chocolate mb-3">Number of Layers</h6>
                <div className="d-flex align-items-center gap-3">
                  <button 
                    className="btn btn-outline-apricot"
                    onClick={() => setCakeDesign(prev => ({ 
                      ...prev, 
                      layers: Math.max(1, prev.layers - 1) 
                    }))}
                    disabled={cakeDesign.layers <= 1}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  
                  <div className="text-center">
                    <div className="display-6 fw-bold text-apricot">{cakeDesign.layers}</div>
                    <small className="text-muted">layers</small>
                  </div>
                  
                  <button 
                    className="btn btn-outline-apricot"
                    onClick={() => setCakeDesign(prev => ({ 
                      ...prev, 
                      layers: Math.min(5, prev.layers + 1) 
                    }))}
                    disabled={cakeDesign.layers >= 5}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4: Toppings */}
            <div className="glass-card p-4 mb-4">
              <h4 className="text-chocolate mb-4">
                <span className="badge bg-sprinkle-blue me-2">4</span>
                Add Toppings & Decorations
              </h4>
              <div className="row g-3">
                {toppings.map(topping => (
                  <div key={topping.id} className="col-6 col-md-4">
                    <button
                      className={`btn w-100 h-100 p-3 ${cakeDesign.toppings.includes(topping.id) ? 'btn-sprinkle-blue' : 'btn-outline-sprinkle-blue'}`}
                      onClick={() => toggleTopping(topping.id)}
                    >
                      <i className={`bi ${topping.icon} fs-3 mb-2`}></i>
                      <div className="fw-medium">{topping.name}</div>
                      <small className="text-muted">+${topping.price}</small>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 5: Custom Message & Colors */}
            <div className="glass-card p-4">
              <h4 className="text-chocolate mb-4">
                <span className="badge bg-sprinkle-pink me-2">5</span>
                Personalize Your Cake
              </h4>
              
              {/* Custom Message */}
              <div className="mb-4">
                <h6 className="text-chocolate mb-3">Add a Custom Message</h6>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="E.g., Happy Birthday Sarah!"
                  value={cakeDesign.message}
                  onChange={(e) => setCakeDesign(prev => ({ ...prev, message: e.target.value }))}
                  maxLength={30}
                />
                <small className="text-muted">Max 30 characters</small>
              </div>

              {/* Color Customization */}
              <div>
                <h6 className="text-chocolate mb-3">Custom Colors</h6>
                <div className="row g-3">
                  <div className="col-4">
                    <label className="form-label">Cake Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color w-100"
                      value={cakeDesign.colors.cake}
                      onChange={(e) => handleColorChange('cake', e.target.value)}
                      title="Choose cake color"
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label">Frosting Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color w-100"
                      value={cakeDesign.colors.frosting}
                      onChange={(e) => handleColorChange('frosting', e.target.value)}
                      title="Choose frosting color"
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label">Decoration Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color w-100"
                      value={cakeDesign.colors.decorations}
                      onChange={(e) => handleColorChange('decorations', e.target.value)}
                      title="Choose decoration color"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Design Templates */}
        <div className="mt-5">
          <h3 className="text-center text-chocolate mb-4">Quick Design Templates</h3>
          <div className="row g-3">
            <div className="col-md-3">
              <button 
                className="btn btn-outline-apricot w-100 h-100 p-3"
                onClick={() => setCakeDesign({
                  base: 'chocolate',
                  frosting: 'chocolate',
                  size: 'medium',
                  layers: 3,
                  toppings: ['sprinkles'],
                  message: 'Happy Birthday!',
                  colors: { cake: '#8B4513', frosting: '#4A2C2A', decorations: '#FF6B8B' },
                  price: 44.99
                })}
              >
                <i className="bi bi-balloon fs-1 mb-2"></i>
                <div>Birthday Classic</div>
              </button>
            </div>
            <div className="col-md-3">
              <button 
                className="btn btn-outline-strawberry w-100 h-100 p-3"
                onClick={() => setCakeDesign({
                  base: 'red-velvet',
                  frosting: 'cream-cheese',
                  size: 'large',
                  layers: 4,
                  toppings: ['berries', 'flowers'],
                  message: 'Congratulations!',
                  colors: { cake: '#8B0000', frosting: '#FFFAF0', decorations: '#FF1493' },
                  price: 59.99
                })}
              >
                <i className="bi bi-heart fs-1 mb-2"></i>
                <div>Wedding Elegance</div>
              </button>
            </div>
            <div className="col-md-3">
              <button 
                className="btn btn-outline-lavender w-100 h-100 p-3"
                onClick={() => setCakeDesign({
                  base: 'vanilla',
                  frosting: 'strawberry',
                  size: 'small',
                  layers: 2,
                  toppings: ['chocolate-chips'],
                  message: 'You\'re Sweet!',
                  colors: { cake: '#F3E5AB', frosting: '#FFB6C1', decorations: '#9D5CFF' },
                  price: 34.99
                })}
              >
                <i className="bi bi-star fs-1 mb-2"></i>
                <div>Simple & Sweet</div>
              </button>
            </div>
            <div className="col-md-3">
              <button 
                className="btn btn-outline-sprinkle-blue w-100 h-100 p-3"
                onClick={() => setCakeDesign({
                  base: 'lemon',
                  frosting: 'matcha',
                  size: 'medium',
                  layers: 3,
                  toppings: ['gold-leaf', 'nuts'],
                  message: 'Just Because',
                  colors: { cake: '#FFFACD', frosting: '#98FB98', decorations: '#FFD700' },
                  price: 49.99
                })}
              >
                <i className="bi bi-flower1 fs-1 mb-2"></i>
                <div>Spring Fresh</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;