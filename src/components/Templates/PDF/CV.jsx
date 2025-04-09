import React from 'react';

const PDFTemplate = () => {
  return (
    <div>
      <style>
        {`
          .pdf-container {
            font-family: Arial, sans-serif;
            color: #464a4e;
            height: 100%;
            text-align: left;
            margin: -10px;
          }

          .header {
            margin-bottom: 20px;
            background-color: #f4f4f4;
            padding: 20px;
          }

          .header h1 {
            margin: 0;
          }

          .header h3 {
            margin: 0;
          }
          h2
          {
              letter-spacing: 5px;
          }
          .section {
            margin-bottom: 20px;
            margin-left: 20px;
          }

          .section ul {
            padding-left: 20px;
          }

          .section ul li {
            margin-bottom: 5px;
          }

          a {
            color: #007bff;
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }

          .pdf-body {
            padding: 0px 20px 20px 20px;
          }
        `}
      </style>
      <div className="pdf-container">
        <div className="header">
          <h1>LUCAS MAJERSKI</h1>
          <h3>WEB DEVELOPER</h3>
        </div>
        <div className="pdf-body">

        <h2>PROFILE</h2>
          <div className="section">
            <p>Web and Game Developer passionate about crafting engaging digital experiences. With expertise in web technologies and a keen interest in game development using Unity, I love bringing ideas to life through code.</p>
          </div>

          <h2>SKILLS</h2>
          <div className="section">
            <ul>
              <li>PHP, JavaScript, SQL</li>
              <li>Laravel, React</li>
              <li>WordPress, Shopify</li>
              <li>C, C++, C#, .NET</li>
              <li>Unity Engine, Unreal Engine</li>
              <li>Git, Docker</li>
              <li>Server administration</li>
              <li>Task optimization using AI</li>
            </ul>
          </div>

          <h2>EXPERIENCE</h2>
          <div className="section">
            <h3>FULL STACK WEB DEVELOPER</h3>
            <span>id Design</span><br />
            <span>2022 - Present</span>
            <ul>
              <li>Developed and maintained responsive web applications</li>
              <li>Managed server configurations and deployments</li>
              <li>Administered databases, including designing schemas, optimizing queries, and ensuring data integrity and backups</li>
              <li>Led the migration of legacy PHP applications to Laravel, improving code maintainability, security, and performance</li>
            </ul>
            <h3>E-COMMERCE</h3>
            <span>Agares</span><br />
            <span>2021 (Owner)</span>
            <ul>
              <li>Built e-commerce websites</li>
              <li>Customer Service and sales</li>
              <li>Managed online sales platforms, including product listings, inventory management, and order fulfillment</li>
              <li>Social Media and advertisement</li>
            </ul>
            <h3>Computer Technician / Sales</h3>
            <span>Xeox.pl</span><br />
            <span>2020 - 2022</span>
            <ul>
              <li>Diagnostics and repairs on a variety of computer hardware and software issues</li>
              <li>Computer Assembly</li>
              <li>Customer Service and sales</li>
              <li>E-commerce</li>
              <li>Troubleshot and resolved network connectivity issues</li>
            </ul>
          </div>

          <h2>PROJECTS</h2>
          <div className="section">
            <h3>Content Management System</h3>
            <div className="section">
              <p>I rewrote the company's existing CMS from scratch using Laravel, enhancing functionality, security, and user experience.</p>
            </div>
            <h3>Commercial Websites</h3>
            <div className="section">
              <p>I took pride in developing a variety of commercial websites using Laravel and WordPress, delivering tailored solutions for business clients.</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFTemplate;
