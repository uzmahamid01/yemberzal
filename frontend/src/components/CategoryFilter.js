import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';
import '../assets/css/psearch.css';

function CategoryFilter({ onCategorySelect, resetSearch }) {
  const categories = ['All', 'Men', 'Women', 'Accessories', 'Stoles', 'Back to Home'];

  const handleCategoryClick = (category) => {
    if (category === 'Back to Home') {
      resetSearch(); // Trigger the reset search to return to the home page
    } else {
      onCategorySelect(category); // Handle other category selections
    }
  };

  return (
    <div className="text-center mb-4">
      <ButtonGroup>
        {categories.map((category) => (
          <Button 
            key={category} 
            variant="outline-dark" 
            onClick={() => handleCategoryClick(category)} 
            className="category-btn"
          >
            {category}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}

export default CategoryFilter;
