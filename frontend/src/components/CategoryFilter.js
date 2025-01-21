import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

function CategoryFilter({ onCategorySelect, resetSearch, fetchProductsByBrand, brands = [] }) {
  const categories = ['All', 'Man', 'Woman', 'Accessories', 'Stole', 'Back to Home'];
  const [selectedBrand, setSelectedBrand] = useState('');

  const handleCategoryClick = (category) => {
    if (category === 'Back to Home') {
      console.log('Back to Home clicked');
      resetSearch();  
    } else if (category === 'Stole') {
      category = ['Pashmina Shawl', 'Pashmina Stole'];
      onCategorySelect(category);
    } else {
      onCategorySelect(category);
    }
  };

  const handleBrandSelect = (brand) => {
    if (selectedBrand === brand) return;
    setSelectedBrand(brand); 
    fetchProductsByBrand(brand); 
  };

  useEffect(() => {
    if (selectedBrand) {
      fetchProductsByBrand(selectedBrand); 
    }
  }, [selectedBrand]);
  

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
        <DropdownButton 
          variant="outline-dark" 
          id="dropdown-brand" 
          title="Shop by Brand"
          onSelect={handleBrandSelect}
          className="category-btn dropdown-btn"
          drop="down"
        >
          {brands.length > 0 ? (
            brands.map((brand) => (
              <Dropdown.Item key={brand} eventKey={brand}>
                {brand}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item disabled>No brands available</Dropdown.Item>
          )}
        </DropdownButton>
      </ButtonGroup>
    </div>
  );
}

export default CategoryFilter;
