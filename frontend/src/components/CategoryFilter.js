import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import '../assets/css/psearch.css';

function CategoryFilter({ onCategorySelect, resetSearch }) {
  const categories = ['All', 'Men', 'Women', 'Accessories', 'Stoles', 'Back to Home'];
  const [brands, setBrands] = useState([]);  // State to store brands

  // Fetch brands from API
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products/brands')  // Your backend API for fetching brands
      .then(response => {
        setBrands(response.data);  // Set brands from API response
      })
      .catch(error => {
        console.error('Error fetching brands:', error);
      });
  }, []);

  const handleCategoryClick = (category) => {
    if (category === 'Back to Home') {
      resetSearch(); // Trigger the reset search to return to the home page
    } else {
      onCategorySelect(category); // Handle other category selections
    }
  };

  const handleBrandSelect = (brand) => {
    console.log(`Brand selected: ${brand}`);  // Debugging line
    // Handle the brand selection, for example, by passing the brand name
    onCategorySelect(`Brand:${brand}`);
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

      {/* Brand Dropdown */}
      {/* <DropdownButton 
        variant="outline-dark"
        title="Select Brand"
        id="dropdown-brand"
        className="ms-3"
        onSelect={handleBrandSelect} // Handle brand selection from dropdown
      >
        {brands.length > 0 ? (
          brands.map((brand, index) => (
            <Dropdown.Item key={index} eventKey={brand}>{brand}</Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item disabled>No Brands Available</Dropdown.Item>
        )}
      </DropdownButton> */}
    </div>
  );
}

export default CategoryFilter;
