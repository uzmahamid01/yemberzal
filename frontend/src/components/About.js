import React from 'react';
import '../assets/css/about.css';

function About() {
  return (
    <div className="container mt-4">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <img src="/logo1.png" alt="Yemberzal" className="me-3 logo-size" />
        </div>
        <div className="d-flex fs-4">
          <a href="/" className="me-3 text-decoration-none">Home</a>
          <a href="/mission" className="me-3 text-decoration-none">Mission</a>
          <a href="/contact" className="text-decoration-none">Contact</a>
        </div>
      </header>
      
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
            Afetr living ouside of Kashmir, I realized just how difficult it is to connect with authentic Kashmiri fashion. It isn't just about the clothes—it is about preserving the stories and traditions they represent. This inspired me to create Yemberzal, a platform that bridges the gap between Kashmir’s timeless fashion and the world.
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
      </section>
    </div>
  );
}

export default About;

// import React from 'react';
// import '../assets/css/about.css';

// function About() {
//   return (
//     <div className="container mt-4">
//       {/* Header */}
//       <header className="d-flex justify-content-between align-items-center mb-4">
//         <div className="d-flex align-items-center">
//           <img src="/logo1.png" alt="Yemberzal" className="me-3 logo-size" />
//         </div>
//         <nav className="d-flex fs-4">
//           <a href="/" className="me-3 text-decoration-none">Home</a>
//           <a href="/mission" className="me-3 text-decoration-none">Mission</a>
//           <a href="/contact" className="text-decoration-none">Contact</a>
//         </nav>
//       </header>

//       {/* About Section */}
//       <section id="about" className="py-5">
//         <header className="text-center mb-5">
//           <h2 className="display-4">The Fashion History of Kashmiri Clothes</h2>
//           <p className="lead">A journey through the centuries of tradition, culture, and craftsmanship.</p>
//         </header>

//         <article>
//           <h3>Discovering the Legacy of Kashmiri Fashion</h3>
//           <p>
//             Kashmiri fashion is deeply intertwined with the region's culture, history, and heritage. The rich textiles, intricate embroideries, and vibrant colors found in Kashmiri clothing reflect centuries of artistic development, influenced by diverse cultures and civilizations.
//           </p>
//           <p>
//             The history of Kashmiri clothing dates back to ancient times when the region was a significant center for weaving, dyeing, and tailoring. The famous Kashmiri Pashmina shawls, which gained global recognition, have been cherished for centuries for their softness and warmth. The art of weaving Pashmina wool, handed down through generations, remains an iconic symbol of Kashmiri fashion.
//           </p>
//           <p>
//             Over the centuries, Kashmiri clothing evolved to include beautiful hand-embroidered garments, including the traditional 'Pheran,' a long robe worn by both men and women. The intricate Kashmiri embroidery, known as 'Kashida,' is a signature element of the region's clothing. These delicate threads form stunning patterns of flowers, birds, and geometric shapes, showcasing the artistry of skilled Kashmiri artisans.
//           </p>

//           <h3>Reviving Kashmiri Heritage: Tradition Meets Modernity</h3>
//           <p>
//             As the world changes, so do fashion trends. Kashmiri clothing, while deeply rooted in tradition, has seen a fusion with modern styles. This blend of old and new has not only helped preserve the heritage but also made Kashmiri fashion more accessible to global markets.
//           </p>
//           <p>
//             At Yemberzal, we aim to bridge the gap between Kashmir's rich fashion heritage and the global fashion scene. Our platform promotes the work of local artisans, showcasing their craftsmanship while providing a modern touch to traditional Kashmiri clothing. This is our way of preserving the cultural legacy of Kashmir and keeping the people of Kashmir connected to their roots while ensuring their artistry reaches the world.
//           </p>

//           <h3>Our Mission: Bringing Kashmir's Tradition to the World</h3>
//           <p>
//             Yemberzal was born from a vision to celebrate Kashmiri fashion by placing it at the forefront of both tradition and modernity. We believe that the timeless beauty of Kashmiri clothing should not only remain a cultural treasure but also evolve in a way that resonates with contemporary fashion lovers. We aim to make Kashmiri clothing a part of everyday life, while preserving its rich heritage and craftsmanship.
//           </p>
//           <p>
//             But our mission goes beyond fashion. We are committed to promoting sustainability by supporting eco-friendly practices in the production of Kashmiri textiles. By partnering with artisans who follow traditional methods, we aim to reduce the environmental impact of modern manufacturing processes. We support sustainable fashion by promoting slow fashion practices and the use of natural materials.
//           </p>

//           <h3>Why We Started Yemberzal</h3>
//           <p>
//             The journey of Yemberzal began with a deep respect for the people of Kashmir and their incredible talent. We wanted to provide a platform where the artisans of Kashmir could showcase their creations while promoting the values of sustainability, cultural preservation, and innovation. Through our platform, we aim to bring the beauty of Kashmiri clothing into the modern world, where tradition and culture are celebrated alongside contemporary fashion.
//           </p>
//           <p>
//             Our commitment to sustainability means that we source and produce clothing that respects the environment. By promoting traditional Kashmiri craftsmanship, we also ensure that we are protecting the jobs of local artisans and maintaining the traditional methods that have defined Kashmiri fashion for centuries. We believe that by supporting the artisans of Kashmir, we are helping to preserve not just the clothing but the region's rich cultural heritage for future generations.
//           </p>

//           <h3>Promoting Sustainable Fashion</h3>
//           <p>
//             As part of our mission, we advocate for sustainable fashion practices. Kashmiri textiles, known for their intricate designs and use of natural fibers, offer an opportunity to create eco-friendly garments that are both beautiful and sustainable. The slow, hand-crafted process ensures that each piece is unique and timeless, standing in contrast to the mass-produced fashion that dominates the modern industry.
//           </p>
//           <p>
//             At Yemberzal, we are proud to be part of a movement that brings attention to sustainable, ethical fashion. Through our collaboration with Kashmiri artisans, we not only promote environmentally conscious fashion but also support the livelihoods of those who keep the tradition alive.
//           </p>
//         </article>
//       </section>
//     </div>
//   );
// }

// export default About;
