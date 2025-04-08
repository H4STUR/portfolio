import React, { useState } from 'react';
import axios from 'axios';

const NewMessage = () => {
  const [formData, setFormData] = useState({ from: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      
      setStatus('Message sent!');
      setFormData({ from: '', subject: '', message: '' });
    } catch (error) {
      if (error.response?.status === 422) {
        console.log('Validation errors:', error.response.data.errors);
        const errors = error.response.data.errors;
        const messages = Object.values(errors).flat().join('\n');
        setStatus(`Validation error:\n${messages}`);
      } else {
        console.error(error);
        setStatus('Failed to send message.');
      }
    }
  };

  return (
    <div className="new-message">
      <h3>New Message</h3>
      <div className="form-group">
        <label>From:</label>
        <input type="email" name="from" value={formData.from} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Subject:</label>
        <input type="text" name="subject" value={formData.subject} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Message:</label>
        <textarea
          name="message"
          rows="8"
          value={formData.message}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="send-row">
        <button className="send-button" onClick={handleSubmit}>Send</button>
        {status && <span className={`inline-status ${status.includes('Failed') ? 'error' : 'success'}`}>{status}</span>}
      </div>

    </div>
  );
};

export default NewMessage;
