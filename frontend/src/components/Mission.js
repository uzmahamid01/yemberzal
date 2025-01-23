import React, { useState, useEffect } from 'react';
import '../assets/css/mission.css'; // Make sure you have a single CSS file for both components
import { supabase } from '../supabaseClient';

function CombinedPage() {
    const [visitCount, setVisitCount] = useState(0);

    useEffect(() => {
        // Fetch initial visit count from Supabase
        async function fetchVisitCount() {
            try {
                const { data, error } = await supabase
                    .from('visit_counts')
                    .select('count')
                    .single();
                
                if (error) throw error;
                
                setVisitCount(data.count);
            } catch (error) {
                console.error('Error fetching visit count:', error);
            }
        }

        // Increment visit count
        async function incrementVisitCount() {
            try {
                const response = await fetch('/api/increment-visit-count/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to increment visit count');
                }
                
                const data = await response.json();
                setVisitCount(data.count);
            } catch (error) {
                console.error('Error incrementing visit count:', error);
            }
        }

        fetchVisitCount();
        incrementVisitCount();
    }, []);

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

      {/* Mission Section */}
      <section id="mission" className="py-5 text-center">
        <h2 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
          Our Mission <span style={{fontSize: '1.5rem', fontWeight: 'lighter'}}>{visitCount.toLocaleString()}</span>
        </h2>
        <p className="mb-4" style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.8' }}>
          Yemberzal's mission is to connect people with authentic Kashmiri clothing, crafted by talented Kashmiri designers, artisans, and small businesses. Through a seamless search experience, we aim to celebrate and share the rich culture and craftsmanship of Kashmir with audiences both within the region and around the globe.
        </p>
        {/* Add any additional content like quotes or highlights here */}
        
      </section>

      {/* About Section */}
      <section id="about" className="py-5">
        <header className="text-center mb-5">
          <h2 className="display-4">The Story Behind Yemberzal</h2>
          <p className="lead">Where tradition meets innovation in Kashmiri fashion.</p>
        </header>

        <article>
          <h3>Bridging Tradition and Modernity</h3>
          <p>
            Yemberzal was born out of a simple idea: to make authentic Kashmiri clothing and accessories accessible to people across the globe. Growing up in Kashmir, I witnessed firsthand the artistry and craftsmanship of local designers and artisans. Their work reflects the rich cultural heritage of the region, yet finding these unique creations online was often a challenge.
          </p>
          <p>
            After living outside of Kashmir, I realized just how difficult it is to connect with authentic Kashmiri fashion. It isn't just about the clothes—it is about preserving the stories and traditions they represent. This inspired me to create Yemberzal, a platform that bridges the gap between Kashmir’s timeless fashion and the world.
          </p>

          <h3>A One-Person Journey</h3>
          <p>
            Yemberzal is a labor of love, created and managed by one person with a passion for Kashmiri culture and technology. With this platform, I aim to celebrate the work of Kashmiri artisans while making their creations easily accessible. My goal is to ensure that the beauty and craftsmanship of Kashmiri clothing resonate with people everywhere.
          </p>

          <h3>Preserving Kashmiri Heritage</h3>
          <p>
            At Yemberzal, we are committed to showcasing the intricate artistry of Kashmiri clothing while embracing modern design. From the elegant Pashmina shawls to the traditional embroidered 'Pheran,' every piece reflects centuries of cultural heritage. By connecting artisans directly with a global audience, Yemberzal helps preserve these traditions for future generations.
          </p>

          <h3>Promoting Sustainability and Ethical Fashion</h3>
          <p>
            Sustainability is at the heart of Yemberzal. By promoting slow fashion and eco-friendly practices, we aim to reduce the environmental impact of modern fashion. Each item featured on Yemberzal is crafted with care, ensuring that it stands as a timeless piece of art while supporting the livelihoods of Kashmiri artisans.
          </p>

          <h3>Our Vision</h3>
          <p>
            Yemberzal is more than just a platform; it’s a celebration of culture, tradition, and craftsmanship. My hope is that through this initiative, I can contribute to keeping Kashmiri heritage alive while inspiring a deeper appreciation for the artistry behind every garment. Whether you're from Kashmir or halfway across the world, Yemberzal invites you to discover and cherish the magic of Kashmiri fashion.
          </p>
        </article>
        <div className="quote-container mt-5 py-5">
            <div className="quote-text">
                <blockquote className="blockquote">
                    <p style={{ fontSize: '2rem', fontStyle: 'italic', color: '#333', lineHeight: '1.5' }}>
                        "The art of Kashmir is the soul of the valley woven into every thread.."
                    </p>
                    <footer className="blockquote-footer mt-4">
                        <cite style={{ fontSize: '1.2rem', color: '#555' }}>YT</cite>
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

export default CombinedPage;



// import React, { useState, useEffect } from 'react';
// import '../assets/css/mission.css';
// import { supabase } from '../supabaseClient';

// function Mission() {
//     const [visitCount, setVisitCount] = useState(0);

//     useEffect(() => {
//         // Fetch initial visit count from Supabase
//         async function fetchVisitCount() {
//             try {
//                 const { data, error } = await supabase
//                     .from('visit_counts')
//                     .select('count')
//                     .single();
                
//                 if (error) throw error;
                
//                 setVisitCount(data.count);
//             } catch (error) {
//                 console.error('Error fetching visit count:', error);
//             }
//         }

//         // Increment visit count
//         async function incrementVisitCount() {
//             try {
//                 const response = await fetch('/api/increment-visit-count/', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 });
                
//                 if (!response.ok) {
//                     throw new Error('Failed to increment visit count');
//                 }
                
//                 const data = await response.json();
//                 setVisitCount(data.count);
//             } catch (error) {
//                 console.error('Error incrementing visit count:', error);
//             }
//         }

//         fetchVisitCount();
//         incrementVisitCount();
//     }, []);

//   return (
//     <div className="container py-5">
//       {/* Header */}
//       <header className="d-flex justify-content-between align-items-center mb-4">
//         <div className="d-flex align-items-center">
//         <img src={require('../assets/images/logo1.png')} alt="Yemberzal6" className="me-3 logo-size" />
//         </div>
//         <div className="d-flex fs-4">
//           <a href="/" className="me-3 text-decoration-none">home</a>
//           <a href="/about" className="me-3 text-decoration-none">about</a>
//           <a href="/contact" className="text-decoration-none">contact</a>
//         </div>
//       </header>

//       {/* Mission Section */}
//       <section id="mission" className="py-5 text-center">
//         <h2 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Our Mission <span style={{fontSize: '1.5rem', fontWeight: 'lighter'}}>{visitCount.toLocaleString()}</span></h2> 
//             {/* span role="img" aria-label="visitors"></span> {visitCount.toLocaleString()} */}
//         <p className="mb-4" style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.8' }}>
//         Yemberzal's mission is to connect people with authentic Kashmiri clothing, crafted by talented Kashmiri designers, artisans, and small businesses. Through a seamless search experience, we aim to celebrate and share the rich culture and craftsmanship of Kashmir with audiences both within the region and around the globe.
//         </p>
        
//         {/* Key Highlights */}
//         {/* <div className="d-flex justify-content-center align-items-center flex-wrap mt-5">
//             <div className="highlight-container">
//                 <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/c/c4/Pheran2.jpg"
//                     alt="Cultural Heritage"
//                     className="highlight-img"
//                 />
//                 <div className="highlight-text">
//                     <h4>Preserving Heritage</h4>
//                     <p>Showcasing the timeless beauty of Kashmiri art and tradition.</p>
//                 </div>
//             </div>
//             <div className="highlight-container row-reverse">
//                 <img
//                     src="https://theindiancouture.com/cdn/shop/articles/c522a51f-4ae9-44ac-8fb2-63de054b118f.jpg?v=1673457625"
//                     alt="Empowering Artisans"
//                     className="highlight-img"
//                 />
//                 <div className="highlight-text">
//                     <h4>Empowering Artisans</h4>
//                     <p>Supporting local artisans by providing a platform for their work.</p>
//                 </div>
//             </div>
//             <div className="highlight-container">
//                 <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Kashmiri.jpg"
//                     alt="Global Platform"
//                     className="highlight-img"
//                 />
//                 <div className="highlight-text">
//                     <h4>Global Reach</h4>
//                     <p>Bridging the gap between Kashmiri craftsmanship and the global audience.</p>
//                 </div>
//             </div>
//         </div> */}

//         {/* Quote */}
//         <div className="quote-container mt-5 py-5">
//             <div className="quote-text">
//                 <blockquote className="blockquote">
//                     <p style={{ fontSize: '2rem', fontStyle: 'italic', color: '#333', lineHeight: '1.5' }}>
//                         "The art of Kashmir is the soul of the valley woven into every thread.."
//                     </p>
//                     <footer className="blockquote-footer mt-4">
//                         <cite style={{ fontSize: '1.2rem', color: '#555' }}>YT</cite>
//                     </footer>
//                 </blockquote>
//             </div>
//             <img
//                 src="https://www.pashwrap.com/cdn/shop/articles/2024-11-15_11.43.20_-_An_intricate_close-up_image_of_a_Kashmiri_artisan_s_hands_working_on_a_pashmina_shawl._The_artisan_is_stitching_fine_embroidery_with_vibrant_threads_i.webp?v=1731651914"
//                 alt="Kashmiri Craftsmanship"
//                 className="quote-img"
//             />
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Mission;