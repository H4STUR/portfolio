import React, { useState } from 'react';

const NewMessage = () => {
  const [formData, setFormData] = useState({ to: '', subject: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="new-message">
      <h3>New Message</h3>
      <div className="form-group">
        <label>To:</label>
        <input type="text" name="to" value={formData.to} onChange={handleChange} />
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
      <button className="send-button">Send</button>
    </div>
  );
};

export default NewMessage;
