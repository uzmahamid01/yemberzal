import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

function CategoryFilter({ onCategorySelect, resetSearch, fetchProductsByBrand, brands = [] }) {
  const categories = ['All', 'Man', 'Woman', 'Shawl', 'Back to Trending'];
  const [selectedBrand, setSelectedBrand] = useState('');

  const handleCategoryClick = (category) => {
    if (category === 'Back to Trending') {
      resetSearch();  
    } else if (category === 'Shawl') {
      category = ('Pashmina Shawl', 'Pashmina Stole');
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
  }, [selectedBrand, fetchProductsByBrand]);

  return (
    <div className="text-center mb-4 px-4 sm:px-0">
      <ButtonGroup className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button 
            key={category} 
            variant="outline-dark" 
            onClick={() => handleCategoryClick(category)} 
            className="category-btn px-2 py-1 text-sm sm:text-base"
          >
            {category}
          </Button>
        ))}
        <DropdownButton 
          variant="outline-dark" 
          id="dropdown-brand" 
          title="Shop by Brand"
          onSelect={handleBrandSelect}
          className="category-btn px-2 py-1 text-sm sm:text-base dropdown-btn"
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