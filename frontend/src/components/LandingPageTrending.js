import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Button } from 'react-bootstrap';
import '../assets/css/psearch.css';

function LandingPageTrending() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Make sure to use http:// not https:// and include the full URL
        const response = await axios.get('http://127.0.0.1:8000/api/products/trending/', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (response.data) {
          setTrendingProducts(response.data);
        }
      } catch (err) {
        console.error('Detailed error:', err);
        setError('Failed to fetch trending products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="text-center">Loading trending products...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div>
          <Row className="justify-content-center">
            {trendingProducts.map((product, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card
                  style={{
                    height: '650px',
                    width: '90%',
                    align: 'center',
                    borderRadius: '50px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Image Container */}
                  <div
                    style={{
                      height: '70%',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.title || 'Product Image'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
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

                    {/* View Product Button */}
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
    </div>
  );
}

export default LandingPageTrending;
