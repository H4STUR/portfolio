import React from 'react';

const PDFTemplate = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333', height: '100%', textAlign: 'left', }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>Lucas Majerski</h1>
        <h3>Web Developer</h3>

        {/* <p>+48 730 035 732 | Poland, Dąbrowa Górnicza | majerski@agares.co.uk | <a href="http://portfolio.agares.co.uk" target="_blank" rel="noopener noreferrer">portfolio.agares.co.uk</a></p> */}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Skills</h2>
        <ul>
          <li>PHP, JavaScript, SQL</li>
          <li>Laravel, React</li>
          <li>Wordpress, Shopify</li>
          <li>C, C++, C#, .NET</li>
          <li>Unity Engine, Unreal Engine</li>
          <li>Git, Docker</li>
          <li>Server administration</li>
          <li>Task optimization using AI</li>
          </ul>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Profile</h2>
        <p>Web and Game Developer passionate about crafting engaging digital experiences. With expertise in web technologies and a keen interest in game development using Unity, I love bringing ideas to life through code.</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Experience</h2>
        <h3>FULL STACK WEB DEVELOPER</h3>
        <span>id Design</span><br></br>
        <span>2022 - Present</span>
        <ul>
          <li>Developed and maintained responsive web applications</li>
          <li>Managed server configurations and deployments</li>
          <li>Administered databases, including designing schemas, optimizing queries, and ensuring data integrity and backups</li>
          <li>Led the migration of legacy PHP applications to Laravel, improving code maintainability, security, and performance</li>
        </ul>

        <h3>E-COMMERCE</h3>
        <span>Agares</span><br></br>
        <span>2021 (Owner)</span>
        <ul>
          <li>Built e-commerce websites</li>
          <li>Customer Service and sales</li>
          <li>Managed online sales platforms, including product listings, inventory management, and order fulfillment</li>
          <li>Social Media and advertisement</li>
        </ul>
        <h3>Computer Technician / Sales</h3>
        <span>Xeox.pl</span><br></br>
        <span>2020 - 2022</span>
        <ul>
          <li>Diagnostics and repairs on a variety of computer hardware and software issues</li>
          <li>Computer Assembly</li>
          <li>Customer Service and sales</li>
          <li>E-commerce</li>
          <li>Troubleshot and resolved network connectivity issues</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Projects</h2>
        <h3>Content Management System</h3>
        <p>I rewrote the company's existing CMS from scratch using Laravel, enhancing functionality, security, and user experience.</p>
        <h3>Commercial Websites</h3>
        <p>I took pride in developing a variety of commercial websites using Laravel and WordPress, delivering tailored solutions for business clients.</p>
        <h3>Portfolio</h3>
        <p>I invite you to explore my portfolio website, a fun side project I thoroughly enjoyed creating, showcasing my skills and projects in greater detail. <a href="https://portfolio.agares.co.uk/" target="_blank" rel="noopener noreferrer">Visit my portfolio</a></p>
      </div>
    </div>
  );
};

export default PDFTemplate;
