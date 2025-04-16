import React from 'react';

const EmailList = ({ emails, onSelect }) => {
  return (
    <div className="email-list">
      {emails.map((email) => (
        <div key={email.id} className="email-item" onClick={() => onSelect(email)}>
          <strong>{email.subject}</strong> – <span>{email.preview}</span>
        </div>
      ))}
    </div>
  );
};

export default EmailList;
