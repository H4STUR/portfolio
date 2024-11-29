import React, { useState } from 'react';
import Window from '../Window';
import '../../styles/email.css';

const EmailApp = ({ id, title, onClose, position }) => {
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');

    try {
      const response = await fetch('http://your-laravel-backend.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setResponseMessage('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setResponseMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      setResponseMessage('An error occurred. Please try again later.');
    }

    setLoading(false);
  };

  return (
    <Window id={id} title={title} onClose={onClose} position={position} size={size} className="window email-window">
      <div className="email-container">
        <h2 className="email-title">Contact Us</h2>
        <form onSubmit={handleSubmit} className="email-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message" className="form-label">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              required
            />
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className={`submit-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
          {responseMessage && <p className="response-message">{responseMessage}</p>}
        </form>
      </div>
    </Window>
  );
};

export default EmailApp;
