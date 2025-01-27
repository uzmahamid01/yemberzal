import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/psearch.css';
import LandingPageTrending from './LandingPageTrending';
import CategoryFilter from './CategoryFilter';
import apiClient from '../config/config';
import ReactGA from 'react-ga';
import { debounce } from 'lodash';

ReactGA.initialize('G-SW7M3XVNPW'); 
ReactGA.pageview(window.location.pathname + window.location.search);

function ProductSearch() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [brands, setBrands] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState('');
  // const [currency, setCurrency] = useState('USD'); 


  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length > 2) {
        await handleSearch();
      }
    }, 300),
    []
  );

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

  const handleCategorySelect = async (selection) => {
    // if (selectedCategory === selection) return; 
  
    setSelectedCategory(selection);
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setTimeoutReached(false);
  
    try {
      const params = {
        category: selection === 'All' ? '' : selection,
        q: query || undefined,
      };
  
      const response = await apiClient.get('/products/search/', {
        params: params,
      });
  
      setProducts(response.data);
      setProductCount(response.data.length); 
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByBrand = async (brand) => {
    if (loading || selectedBrand === brand) return; 
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setTimeoutReached(false);
  
    try {
      const response = await apiClient.get('/products/search/', {
        params: { brand },
      });
  
      setProducts(response.data);
      setProductCount(response.data.length); 
      setSelectedBrand(brand); 
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.title?.toLowerCase().includes(query.toLowerCase()) ||
      product.brand?.toLowerCase().includes(query.toLowerCase())
    );
  }, [products, query]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setTimeoutReached(false);
  
    try {
      const params = {
        q: query || undefined,
        category: selectedCategory === 'All' ? '' : selectedCategory,
      };
  
      const response = await apiClient.get('/products/search/', { params });
  
      setProducts(response.data);
      setProductCount(response.data.length);
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
    setProductCount(0);
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await apiClient.get('/brands/');
        if (response.data) {
          setBrands(response.data);
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
      }
    };

    fetchBrands();
  }, []);

  return (
    <Container className="py-5">
      <header className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
        <a href="/">
          <img src={require('../assets/images/logo1.png')} alt="Yemberzal6" className="me-3 logo-size" />
        </a>
        </div>
        <div className="d-flex fs-4">
          <Link to="/mission" className="me-3 text-decoration-none">mission</Link>
          <Link to="/about" className="me-3 text-decoration-none">kashmir</Link>
          <Link to="/contact" className="text-decoration-none">contact</Link>
          {/* <Form.Select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              width: '100px',
              fontSize: '14px',
              marginLeft: '10px'
            }}
          >
            <option value="USD">$ USD</option>
            <option value="INR">₹ INR</option>
          </Form.Select> */}
        </div>
      </header>

      <img
        src={require('../assets/images/logo2.png')} 
        alt="Yemberzal"
        className="d-block mx-auto"
        style={{
          margin: 0,
          padding: 0,
          width: '100%', 
          maxWidth: '600px', 
          height: 'auto', 
          maxHeight: '300px', 
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />


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
                onChange={(e) => {
                  const newQuery = e.target.value;
                  setQuery(newQuery);
                  debouncedSearch(newQuery);
                }}
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

      <CategoryFilter 
        onCategorySelect={handleCategorySelect}
        resetSearch={resetSearch}
        fetchProductsByBrand={fetchProductsByBrand}
        brands={brands}
      />

      {searchPerformed && (
        <div className="search-results">
          {error && <div className="alert alert-danger">{error}</div>}
          {timeoutReached && !error && (
            <div className="text-center">
              <p>Search is taking longer than expected. Please try again.</p>
              <Button onClick={resetSearch} variant="outline-secondary">
                Back to Trending
              </Button>
            </div>
          )}
          {filteredProducts.length === 0 && !error && !timeoutReached && (
            <div className="text-center">
              <Button onClick={resetSearch} variant="outline-secondary">
                Back to Trending
              </Button>
            </div>
          )}
          <div className="text-center mb-4">
            <strong>{filteredProducts.length} products found</strong>
          </div>
          <Row>
            {filteredProducts.map((product, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card style={{ height: '650px', width: '90%', align: 'center', borderRadius: '50px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <div style={{ height: '70%', overflow: 'hidden', position: 'relative' }}>
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.title || 'Product Image'} 
                        style={{ 
                          width: '180%', 
                          height: 'auto', 
                          objectFit: 'contain',  
                          objectPosition: 'center',  
                          marginTop: '-30px'  
                        }} 
                      />
                    )}
                  </div>
                  
                  <Card.Body className="d-flex flex-column" style={{ padding: '15px' }}>
                    <Card.Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                      <strong>{product.brand || 'Unknown Brand'}</strong> 
                    </Card.Text>
                    <Card.Title style={{ fontSize: '16px', color: '#566' }}>
                      {product.title || 'Unnamed Product'}
                    </Card.Title>
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
        </div>
      )}

      {!searchPerformed && (
        <>
          <h2 className="text-center mb-4">Trending Kashmiri Outfits</h2>
          <LandingPageTrending />
        </>
      )}
    </Container>
  );
}

export default ProductSearch;