import React, { useState, useEffect } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/psearch.css';
import LandingPageTrending from './LandingPageTrending';
import CategoryFilter from './CategoryFilter';


function ProductSearch() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setTimeoutReached(true);
        setLoading(false);
      }, 8000);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const handleCategorySelect = (selection) => {
    if (selection.startsWith('Brand:')) {
      const brand = selection.split(':')[1];  // Extract brand from the selection
      fetchProductsByBrand(brand);  // Fetch products by the selected brand
    } else {
      setSelectedCategory(selection);  // Handle other category selections
      if (searchPerformed) {
        handleSearch();  // Perform search if needed
      }
    }
  };
  
  // Function to fetch products filtered by brand
  const fetchProductsByBrand = async (brand) => {
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setTimeoutReached(false);
  
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products/search/', {
        params: { brand: brand }, // Send brand name as query param
      });
      setProducts(response.data); // Set products state with the fetched data
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setTimeoutReached(false);

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products/search/', {
        params: {
          q: query,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
        },
      });

      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchPerformed(false);
    setProducts([]);
    setQuery('');
    setSelectedCategory('All');
  };

  return (
    <Container className="mt-2">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <img src="/logo1.png" alt="Yemberzal" className="me-3 logo-size" />
        </div>
        <div className="d-flex fs-4">
          <Link to="/mission" className="me-3 text-decoration-none">mission</Link>
          <Link to="/about" className="me-3 text-decoration-none">about</Link>
          <Link to="/contact" className="text-decoration-none">contact</Link>
        </div>
      </header>
      

      {/* Logo */}
      <img
        src="/logo2.png"
        alt="Yemberzal"
        className="d-block mx-auto"
        style={{
          margin: 0,
          padding: 0,
          width: '600px',
          height: '300px',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      {/* Search Form */}
      <Form onSubmit={handleSearch} className="mb-4 d-flex justify-content-center">
        <Row className="justify-content-center w-100">
          <Col md={8} className="d-flex justify-content-center">
            <div style={{
              display: 'flex',
              width: '100%',
              borderRadius: '50px',
              overflow: 'hidden',
            }}>
              <Form.Control
                type="text"
                placeholder="Search for Kashmiri clothes (e.g., Pashmina Shawl)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  border: '1px solid #ccc',
                  borderRight: 'none',
                  borderRadius: '50px 0 0 50px',
                  padding: '15px',
                  backgroundColor: '#fff',
                  color: '#333',
                  fontSize: '14px',
                  flex: 1,
                }}
              />
              <Button
                variant="outline-dark"
                type="submit"
                disabled={loading}
                style={{
                  borderRadius: '0 50px 50px 0',
                  padding: '10px 20px',
                  backgroundColor: 'black',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>

      {/* Category Filter */}
      <CategoryFilter onCategorySelect={handleCategorySelect} resetSearch={resetSearch} />

      {/* Search Results */}
      {searchPerformed && (
        <div className="search-results">
          {/* Display results or errors */}
          {error && <div className="alert alert-danger">{error}</div>}
          {timeoutReached && !error && (
            <div className="text-center">
              <p>Search is taking longer than expected. Please try again.</p>
              <Button onClick={resetSearch} variant="outline-secondary">
                Back to Trending
              </Button>
            </div>
          )}
          {products.length === 0 && !error && !timeoutReached && (
            <div className="text-center">
              <Button onClick={resetSearch} variant="outline-secondary">
                Back to Trending
              </Button>
            </div>
          )}
          <Row>
            {products.map((product, index) => (
              <Col md={4} key={index} className="mb-4">
                {/* Product Card */}
              </Col>
            ))}
          </Row>
        </div>
      )}


      {/* make category buttons so when clicked it should filter only those searchs from the backend  such as men, women, All(display everything in the database), accessories, shoe wear, stoles */}

      {/* Conditionally render trending section */}
      {!searchPerformed && (
        <>
          <h2 className="text-center mb-4">Trending Kashmiri Outfits</h2>
          <LandingPageTrending />
        </>
      )}
      
      {/* Search results with conditional rendering */}
      {searchPerformed && (
        <div className="search-results">
        {timeoutReached && !error && (
          <div className="text-center">
            <p>Search is taking longer than expected. Please try again.</p>
            <Button onClick={resetSearch} variant="outline-secondary">
              Back to Trending
            </Button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {products.length === 0 && !error && !timeoutReached && (
          <div className="text-center">
            {/* <p>No products found for "{query}"</p> */}
            <Button onClick={resetSearch} variant="outline-secondary">
              Back to Trending
            </Button>
          </div>
        )}


          <Row>
            {products.map((product, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card 
                  style={{
                    height: '650px', 
                    width: '90%',
                    align: 'center',
                    borderRadius: '50px', 
                    overflow: 'hidden', 
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Same card rendering logic as before */}
                  <div style={{ height: '70%', overflow: 'hidden', position: 'relative' }}>
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.title || 'Product Image'} 
                        style={{ 
                          width: '180%',  // Ensures the image takes up full width of the container
                          height: 'auto', // Adjusts height automatically to maintain aspect ratio
                          objectFit: 'contain',  // Ensures the image is scaled down to fit without cropping
                          objectPosition: 'center',  // Centers the image
                          marginTop: '-30px'  // Optional: adjust this for fine-tuning if you need more zoom out
                        }} 
                      />
                    )}
                  </div>
                  
                  <Card.Body className="d-flex flex-column" style={{ padding: '15px' }}>
                    {/* Brand */}
                    <Card.Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                      <strong>{product.brand || 'Unknown Brand'}</strong> 
                    </Card.Text>

                    {/* Title */}
                    <Card.Title style={{ fontSize: '16px', color: '#566' }}>
                      {product.title || 'Unnamed Product'}
                    </Card.Title>

                    {/* Description */}
                    {/* <Card.Text style={{ flexGrow: 1, fontSize: '14px', color: '#5657', marginBottom: '10px' }}>
                      {product.description ? product.description.slice(0, 150) + '...' : 'No description available'}
                    </Card.Text> */}

                    {/* Price */}
                    <Card.Text style={{ fontSize: '16px', color: '#555' }}>
                      ${product.price || 'Not Available'}
                    </Card.Text>
                    
                    <Button
                      variant="outline-primary"
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginTop: 'auto',    
                        marginBottom: '-15px',
                        marginLeft: '-10%',
                        padding: '8px 16px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderColor: 'transparent',
                        color: 'white',
                        backgroundColor: 'darkgrey',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        width: '115%',
                        height: '50px',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'grey';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'darkgrey';
                      }}
                    >
                      View Product
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* {products.length > 0 && (
            <div className="text-center mt-3">
              <Button onClick={resetSearch} variant="outline-secondary">
                Back to Home Page
              </Button>
            </div>
          )} */}
        </div>
      )}
    </Container>
  );
}

export default ProductSearch;