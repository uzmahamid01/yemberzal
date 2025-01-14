import React, { useState } from 'react';
import '../assets/css/contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bugReport: '',
    productRequest: '',
    generalQuery: ''
  });
  
  const [activeForm, setActiveForm] = useState(null); // Track which form is active
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e, formType) => {
    e.preventDefault();
    alert(`${formType} form submitted!`);
  };

  const toggleForm = (formName) => {
    setActiveForm(activeForm === formName ? null : formName); // Toggle active form
  };

  return (
    <div className="container mt-5">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <img src="/logo1.png" alt="Yemberzal" className="me-3 logo-size" />
        </div>
        <div className="d-flex fs-4">
          <a href="/" className="me-3 text-decoration-none">home</a>
          <a href="/about" className="me-3 text-decoration-none">about</a>
          <a href="/mission" className="text-decoration-none">mission</a>
        </div>
      </header>
      
      {/* Header Section */}
      <section id="contact" className="py-5">
        <h2 className="text-center mb-4">contact us</h2>
        <p className="text-center">
          Have questions or want to collaborate? Reach out to us at:
          <br />
          <a href="mailto:contact@yemberzal.com">yemberzal@morel.com</a>
        </p>

        {/* Contact Forms */}
        <div className="container">
          <div className="row">
            {/* Toggle Buttons for Forms */}
            <div className="col-12 mb-3">
              <button 
                className="btn btn-secondary w-100" 
                onClick={() => toggleForm('bugReport')}>
                Report a Bug
              </button>
            </div>
            <div className="col-12 mb-3">
              <button 
                className="btn btn-secondary w-100" 
                onClick={() => toggleForm('productRequest')}>
                Add Your Products
              </button>
            </div>
            <div className="col-12 mb-3">
              <button 
                className="btn btn-secondary w-100" 
                onClick={() => toggleForm('generalQuery')}>
                General Questions
              </button>
            </div>

            {/* Bug Report Form */}
            {activeForm === 'bugReport' && (
              <div className="col-12">
                <h3 className="form-heading">Report a Bug</h3>
                <form onSubmit={(e) => handleSubmit(e, 'Bug Report')}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bugReport" className="form-label">Describe the Bug</label>
                    <textarea
                      name="bugReport"
                      value={formData.bugReport}
                      onChange={handleChange}
                      className="form-control"
                      rows="4"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Submit Bug Report</button>
                </form>
              </div>
            )}

            {/* Product Request Form */}
            {activeForm === 'productRequest' && (
              <div className="col-12">
                <h3 className="form-heading">Add Your Products</h3>
                <form onSubmit={(e) => handleSubmit(e, 'Product Addition')}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productRequest" className="form-label">Product Details</label>
                    <textarea
                      name="productRequest"
                      value={formData.productRequest}
                      onChange={handleChange}
                      className="form-control"
                      rows="4"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Submit Product</button>
                </form>
              </div>
            )}

            {/* General Query Form */}
            {activeForm === 'generalQuery' && (
              <div className="col-12">
                <h3 className="form-heading">General Questions</h3>
                <form onSubmit={(e) => handleSubmit(e, 'General Query')}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="generalQuery" className="form-label">Your Question/Message</label>
                    <textarea
                      name="generalQuery"
                      value={formData.generalQuery}
                      onChange={handleChange}
                      className="form-control"
                      rows="4"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Submit Message</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
