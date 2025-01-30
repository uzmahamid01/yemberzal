import React, { useState } from 'react';
import '../assets/css/contact.css';


function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bugReport: '',
    productRequest: '',
    generalQuery: '',
    anonymousQuery: ''
  });
  
  const [activeForm, setActiveForm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const API_URL = process.env.REACT_APP_API_URL || 'https://api.apispreadsheets.com/data/f3wYvYFoCfw2XxoV/';
  console.log('API URL:', API_URL);  
  console.log('Process Env:', process.env);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const submitToSpreadsheet = async (formType) => {
    try {
      const submissionData = {
        Name: formData.name,
        Email: formData.email,
        "Report Bug": formType === 'Bug Report' ? formData.bugReport : "",
        "Collab": formType === 'Product Addition' ? formData.productRequest : "",
        "General question": formType === 'General Query' ? formData.generalQuery : "",
        "Anonymous Question": formType === 'Anonymous Query' ? formData.anonymousQuery : ""
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: submissionData
        }),
      });

      if (response.status === 201) {
        return true;
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    }
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await submitToSpreadsheet(formType);
      if (success) {
        alert(`${formType} submitted successfully!`);
        setFormData({
          name: '',
          email: '',
          bugReport: '',
          productRequest: '',
          generalQuery: '',
          anonymousQuery: ''
        });
        setActiveForm(null);
      } else {
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForm = (formName) => {
    setActiveForm(activeForm === formName ? null : formName);
  };

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
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
                  </button>
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
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Product'}
                  </button>
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
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Message'}
                  </button>
                </form>
              </div>
            )}


            {/* Anonymous Form */}
            <form onSubmit={(e) => handleSubmit(e, 'Anonymous Query')}>
              <div className="mb-3">
                <label htmlFor="anonymousQuery" className="form-label">Anonymous Question</label>
                <textarea
                  name="anonymousQuery"
                  value={formData.anonymousQuery}
                  placeholder='Your message here...'
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Message'}
              </button>
            </form>



          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;