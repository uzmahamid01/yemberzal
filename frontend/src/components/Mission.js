import '../assets/css/mission.css'; 
import ReactGA from 'react-ga';

ReactGA.initialize('G-SW7M3XVNPW'); 
ReactGA.pageview(window.location.pathname + window.location.search);

function CombinedPage() {
  return (
    <div className="container py-5">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <a href="/">
            <img src={require('../assets/images/logo1.png')} alt="Yemberzal6" className="me-3 logo-size" />
          </a>
        </div>
        <div className="d-flex fs-4">
          <a href="/" className="me-3 text-decoration-none">home</a>
          <a href="/about" className="me-3 text-decoration-none">kashmir</a>
          <a href="/contact" className="text-decoration-none">contact</a>
        </div>
      </header>

      <div className="quote-container mt-1 py-5">
        <div className="quote-text">
          <blockquote className="blockquote">
          <h4 className="section-title">
              <span style={{fontSize: '1rem'}}>یمبرزل کیہ چھُ؟</span>  Why YEMBERZAL?
            </h4>            <p className="section-paragraph">
            Yemberzal (Kashmiri for crocus flower) symbolizes resilience and hope, mirroring Kashmir’s artisans thriving amid adversity. The name reflects the platform’s mission: bridging their timeless craftsmanship with modern technology, like the crocus bridging winter’s harshness with fleeting beauty.
            </p>
            <hr />
            <h4 className="section-title">MISSION</h4>
            
            <p className="section-paragraph">
              Yemberzal's mission is to connect people with authentic Kashmiri clothing, crafted by talented Kashmiri designers, artisans, and small businesses. Through a seamless search experience, we aim to celebrate and share the rich culture and craftsmanship of Kashmir with audiences both within the region and around the globe.
              Bridging <em>Kasheer</em> with <em>Duniya</em>
            </p>
            <hr />
            <h4 className="section-title">Story Behind YEMBERZAL</h4>
            <p className="section-paragraph">
              Yemberzal was born out of a simple idea: to make authentic Kashmiri clothing and accessories accessible to people across the globe. <br/>
              Yemberzal is a labor of love, created and managed by one person with a passion for Kashmiri culture and technology. With this platform, I aim to celebrate the work of Kashmiri artisans while making their creations easily accessible. My goal is to ensure that the beauty and craftsmanship of Kashmiri clothing resonate with people everywhere.
            </p>
            <footer className="blockquote-footer mt-4">
              <cite className="footer-text">My Love Letter to Kashmir 💌</cite>
            </footer>
          </blockquote>
        </div>
        <img
          src="https://www.pashwrap.com/cdn/shop/articles/2024-11-15_11.43.20_-_An_intricate_close-up_image_of_a_Kashmiri_artisan_s_hands_working_on_a_pashmina_shawl._The_artisan_is_stitching_fine_embroidery_with_vibrant_threads_i.webp?v=1731651914"
          alt="Kashmiri Craftsmanship"
          className="quote-img"
        />
      </div>
      {/* Footer Section with disclaimer */}
      <footer className="text-center mt-5">
        <cite className="footer-text">
          Disclaimer: I do not earn money of this. Neither do I sell any products. <br/>This is a search engine to help you find your next Kashmiri outfit seamlessly. 
        </cite>
      </footer>

    </div>
  );
}

export default CombinedPage;
