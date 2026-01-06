// Builder helper functions
export const generateDesignId = () => {
  return `DESIGN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const saveDesignToHistory = (design) => {
  const designs = JSON.parse(localStorage.getItem('designHistory') || '[]');
  designs.unshift({
    ...design,
    id: generateDesignId(),
    savedAt: new Date().toISOString()
  });
  
  // Keep only last 10 designs
  const limitedDesigns = designs.slice(0, 10);
  localStorage.setItem('designHistory', JSON.stringify(limitedDesigns));
  
  return limitedDesigns.length;
};

export const calculateNutrition = (design) => {
  // Mock nutrition calculation based on design
  const baseCalories = design.size === 'small' ? 1200 : 
                       design.size === 'medium' ? 2000 : 
                       design.size === 'large' ? 3000 : 4000;
  
  return {
    calories: baseCalories + (design.layers * 200),
    sugar: 'High',
    servings: design.size === 'small' ? '4-6' :
              design.size === 'medium' ? '8-10' :
              design.size === 'large' ? '12-15' : '20+'
  };
};

export const shareDesign = (design) => {
  const designUrl = `${window.location.origin}/share/${design.id}`;
  const text = `Check out my custom cake design! ${designUrl}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'My Cake Design',
      text: text,
      url: designUrl,
    });
  } else {
    navigator.clipboard.writeText(text);
    alert('Design link copied to clipboard!');
  }
};