import React from 'react';
import '../assets/css/about.css';

function About() {
  const brands = [
    {
      logo: 'https://tulpalav.com/wp-content/uploads/2024/07/WEB-LOGO-TP.png',
      description: "Specializing in traditional Kashmiri Kani shawls",
      website: "https://www.tulpalav.com/",
      // bgColor: "bg-light"
    },
    // {
    //   logo: 'https://global.kashmirbox.com/cdn/shop/files/2.png?height=140&v=1701627437',
    //   description: "Authentic Pashmina shawls and accessories",
    //   website: "https://www.kashmirshop.com/",
    //   bgColor: "bg-white"
    // },
    {
      logo: 'https://cdn.baraqah.in/wp-content/uploads/2024/03/baraqah-logo-white.png',
      description: "Handcrafted traditional Kashmiri clothing and textiles",
      website: "https://baraqah.in/",
      bgColor: "bg-dark"
    },
    {
      logo: 'https://www.pashmina.com/_next/image/?url=%2Fimages%2Flogo.png&w=640&q=75',
      description: "Intricate embroidery and traditional Kashmiri garments",
      website: "https://www.pashmina.com/",
      bgColor: "bg-black"
    },
    {
      logo: 'https://koshurindia.shop/cdn/shop/files/Koshur-logo.png?v=1727457230&width=212',
      description: "Handcrafted traditional Kashmiri clothing and textiles",
      website: "https://koshurindia.shop/",
      // bgColor: "bg-light"
    }
  ];

  const fashionArticles = [
    {
      title: "Kashmiri Pheran",
      excerpt: "The Timeless Elegance of Kashmiri Pherans: A Journey Through History and Culture",
      link: "https://www.kashmiripheran.com/blogs/news/the-timeless-elegance-of-kashmiri-pherans-a-journey-through-history-and-culture?srsltid=AfmBOorK8PvH_t9-MV57J5NB5M5EqhMXBdadpjShgb-nCW9u-eu04Ymb"
    },
    {
      title: "Kashmiri State Of Mind",
      excerpt: "New York City Pheran: A Kashmiri State of Mind",
      link: "https://mamanushka.com/kashmiri-state-of-mind-new-york-city-pheran/"
    },
    {
      title: "The Enduring Legacy of Kashmiri Sozni Kari",
      excerpt: "An in-depth look at Kashmir's embroidery styles and their cultural significance.",
      link: "https://www.pashmina.com/editorial/enduring-legacy-of-kashmiri-sozni-kari/"
    }
  ];

  return (
    <div className="container py-5 font-raleway">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
        <a href="/">
          <img src={require('../assets/images/logo1.png')} alt="Yemberzal6" className="me-3 logo-size" />
        </a>
        </div>
        <nav className="d-flex fs-4">
          <a href="/" className="me-3 text-decoration-none">home</a>
          <a href="/mission" className="me-3 text-decoration-none">mission</a>
          <a href="/contact" className="text-decoration-none">contact</a>
        </nav>
      </header>

      {/* Brands Section */}
      <section id="brands" className="py-5 ">
        <div className="text-center mb-5">
          <h2 className="display-6 mb-3">Featured Brands</h2>
          <p className="text-muted">Discover Authentic Kashmiri Fashion</p>
        </div>
        <div className="row g-4">
          {brands.map((brand, index) => (
            <div key={index} className="col-6 col-md-3">
              <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                <div className={`text-center p-4 rounded ${brand.bgColor}`}>
                  <img 
                    src={brand.logo} 
                    alt={`Brand logo`} 
                    className="img-fluid mb-3 brand-logo" 
                    style={{ 
                      maxHeight: '150px', 
                      maxWidth: '150px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Fashion Articles Section */}
      <section id="articles" className="py-5 ">
        <div className="text-center mb-5">
          <p className="text-muted">Discovering Kashmiri Fashion</p>
        </div>
        <div className="row g-4">
          {fashionArticles.map((article, index) => (
            <div key={index} className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h3 className="h5 mb-3">{article.title}</h3>
                  <p className="text-muted small">{article.excerpt}</p>
                  <a href={article.link} className="text-decoration-none text-primary fw-bold">
                    Read More →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;