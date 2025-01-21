import React from 'react';
import '../assets/css/mission.css';

function Mission() {
  return (
    <div className="container mt-4">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
        <img src="https://uzmah.netlify.app/p2_files/50.png" alt="Yemberzal4" className="me-3 logo-size" />
        </div>
        <div className="d-flex fs-4">
          <a href="/" className="me-3 text-decoration-none">home</a>
          <a href="/about" className="me-3 text-decoration-none">about</a>
          <a href="/contact" className="text-decoration-none">contact</a>
        </div>
      </header>

      {/* Mission Section */}
      <section id="mission" className="py-5 text-center">
        <h2 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Our Mission</h2>
        <p className="mb-4" style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.8' }}>
        Yemberzal's mission is to connect people with authentic Kashmiri clothing, crafted by talented Kashmiri designers, artisans, and small businesses. Through a seamless search experience, we aim to celebrate and share the rich culture and craftsmanship of Kashmir with audiences both within the region and around the globe.
        </p>
        
        {/* Key Highlights */}
        {/* <div className="d-flex justify-content-center align-items-center flex-wrap mt-5">
            <div className="highlight-container">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c4/Pheran2.jpg"
                    alt="Cultural Heritage"
                    className="highlight-img"
                />
                <div className="highlight-text">
                    <h4>Preserving Heritage</h4>
                    <p>Showcasing the timeless beauty of Kashmiri art and tradition.</p>
                </div>
            </div>
            <div className="highlight-container row-reverse">
                <img
                    src="https://theindiancouture.com/cdn/shop/articles/c522a51f-4ae9-44ac-8fb2-63de054b118f.jpg?v=1673457625"
                    alt="Empowering Artisans"
                    className="highlight-img"
                />
                <div className="highlight-text">
                    <h4>Empowering Artisans</h4>
                    <p>Supporting local artisans by providing a platform for their work.</p>
                </div>
            </div>
            <div className="highlight-container">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Kashmiri.jpg"
                    alt="Global Platform"
                    className="highlight-img"
                />
                <div className="highlight-text">
                    <h4>Global Reach</h4>
                    <p>Bridging the gap between Kashmiri craftsmanship and the global audience.</p>
                </div>
            </div>
        </div> */}

        {/* Quote */}
        <div className="quote-container mt-5 py-5">
            <div className="quote-text">
                <blockquote className="blockquote">
                    <p style={{ fontSize: '2rem', fontStyle: 'italic', color: '#333', lineHeight: '1.5' }}>
                        "The art of Kashmir is the soul of the valley woven into every thread."
                    </p>
                    <footer className="blockquote-footer mt-4">
                        <cite style={{ fontSize: '1.2rem', color: '#555' }}>Yemberzal Team</cite>
                    </footer>
                </blockquote>
            </div>
            <img
                src="https://www.pashwrap.com/cdn/shop/articles/2024-11-15_11.43.20_-_An_intricate_close-up_image_of_a_Kashmiri_artisan_s_hands_working_on_a_pashmina_shawl._The_artisan_is_stitching_fine_embroidery_with_vibrant_threads_i.webp?v=1731651914"
                alt="Kashmiri Craftsmanship"
                className="quote-img"
            />
        </div>
      </section>
    </div>
  );
}

export default Mission;