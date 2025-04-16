import React from 'react';

const EmailViewer = ({ email, onBack }) => {
  return (
    <div className="email-viewer">
      <button className='mail-button' onClick={onBack} style={{ marginBottom: '10px' }}>← Back</button>
      <h3>{email.subject}</h3>
      <p><strong>From:</strong> {email.from}<br/>
      <strong>Date:</strong> {email.date}</p>
      <hr />
      <div className="email-body" dangerouslySetInnerHTML={{ __html: email.body }}></div>

    </div>
  );
};

export default EmailViewer;
