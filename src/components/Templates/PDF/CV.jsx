import React from "react";

const PDFTemplate = () => {
  return (
    <div>
      <style>
        {`
          :root{
            --ink:#333;
            --muted:#555;
            --heading:#3d3d3d;
            --rule:#ccc;
            --bg-header:#4a4a4a;
          }

          .pdf-container{
            font-family: 'Segoe UI', Arial, sans-serif;
            color: var(--ink);
            margin: -10px;
            background: #fff;
          }

          /* Page wrapper */
          .page{
            padding: 0;
          }

          /* Header */
          .header{
            background: var(--bg-header);
            color: #fff;
            text-align: center;
            padding: 30px 30px 25px 30px;
          }
          .header .name{
            margin: 0;
            font-size: 42px;
            letter-spacing: 8px;
            font-weight: 700;
            text-transform: uppercase;
            line-height: 1.1;
          }
          .header .role{
            margin-top: 10px;
            font-size: 13px;
            letter-spacing: 8px;
            font-weight: 400;
            text-transform: uppercase;
            color: #ccc;
          }

          /* Layout: 2 columns */
          .content{
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 0;
            align-items: start;
            padding: 25px 30px 20px 30px;
          }

          /* Left column */
          .left{
            padding-right: 25px;
            border-right: 1px solid var(--rule);
            position: relative;
            text-align: left;
          }

          /* Decorative circles */
          
          /* Contact info with icons */
          .contact{
            font-size: 13px;
            line-height: 1.7;
            color: var(--ink);
            margin-bottom: 5px;
          }
          .contact .item{
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 8px 0;
          }
          .contact .icon{
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--muted);
          }
          .contact a{
            color: var(--ink);
            text-decoration: none;
          }
          .contact a:hover{ text-decoration: underline; }

          /* Right column */
          .right{
            min-width: 0;
            padding-left: 25px;
            text-align: left;
          }

          /* Section titles */
          .section-title{
            margin: 20px 0 12px 0;
            font-size: 18px;
            letter-spacing: 6px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--heading);
          }
          .section-title:first-child{
            margin-top: 0;
          }

          /* blocks */
          .block{
            font-size: 13px;
            line-height: 1.65;
            color: var(--muted);
          }

          /* Skill/Lang/Project lists on left */
          .left-list{
            margin: 8px 0 0 0;
            padding: 0 0 0 18px;
            color: var(--ink);
            font-size: 13px;
            line-height: 1.7;
          }
          .left-list li{
            margin: 5px 0;
          }

          /* Projects in left column */
          .project{
            margin-top: 12px;
          }
          .project:first-of-type{
            margin-top: 8px;
          }
          .project-title{
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            margin-bottom: 4px;
            letter-spacing: .5px;
            color: var(--ink);
          }
          .project .block{
            font-size: 12.5px;
          }

          /* Experience entries */
          .exp{
            margin-top: 18px;
          }
          .exp:first-of-type{
            margin-top: 10px;
          }

          .exp-role{
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: .5px;
            color: var(--ink);
            margin-bottom: 2px;
          }
          .exp-meta{
            font-size: 13px;
            color: var(--muted);
            margin-bottom: 8px;
          }

          /* Clean bullet lists */
          .bullets{
            margin: 0;
            padding-left: 18px;
            font-size: 13px;
            line-height: 1.65;
            color: var(--muted);
          }
          .bullets li{
            margin: 5px 0;
          }

          /* GDPR note */
          .gdpr{
            margin: 20px 30px 20px 30px;
            padding-top: 15px;
            border-top: 1px solid var(--rule);
            font-size: 11px;
            color: var(--muted);
            line-height: 1.4;
          }
        `}
      </style>

      <div className="pdf-container">
        <div className="page">
          {/* Header */}
          <div className="header">
            <div className="name">LUCAS MAJERSKI</div>
            <div className="role">FULL-STACK WEB DEVELOPER</div>
          </div>

          <div className="content">
            {/* LEFT */}
            <aside className="left">
              <div className="contact">
              
                <div className="item">
                  <span className="icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </span>
                  Poland, Wroclaw
                </div>
                <div className="item">
                  <span className="icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </span>
                  <a href="https://portfolio.agares.co.uk" target="_blank" rel="noreferrer">
                    portfolio.agares.co.uk
                  </a>
                </div>
              </div>

              <hr />

              <div className="section-title">SKILLS</div>
              <ul className="left-list">
                <li>PHP, JavaScript, TypeScript, SQL</li>
                <li>Bootstrap, Vue.js, jQuery</li>
                <li>Laravel, React, Wordpress</li>
                <li>REST APIs, Authentication</li>
                <li>C, C++, C#, .NET</li>
                <li>Git, Docker</li>
                <li>Server administration</li>
              </ul>
              
              <hr />

              <div className="section-title">LANGUAGES</div>
              <ul className="left-list">
                <li>Polish - Native</li>
                <li>English - C1</li>
              </ul>

              <hr />

              <div className="section-title">PROJECTS</div>

              <section className="project">
                <div className="project-title">CONTENT MANAGEMENT SYSTEM</div>
                <div className="block">
                  Designed and developed a custom, multi-purpose content management system in Laravel, focused on
                  flexibility, security, performance, and extensibility.
                </div>
              </section>

              <section className="project">
                <div className="project-title">PORTFOLIO</div>
                <div className="block">
                  I invite you to explore my portfolio website, a personal project showcasing my skills and selected
                  projects in greater detail.
                </div>
              </section>
            </aside>

            {/* RIGHT */}
            <main className="right">
              <div className="section-title">PROFILE</div>
              <div className="block">
                Full-stack Web Developer with over three years of professional experience, focused on building modern
                and scalable web applications. Working across both frontend and backend, I love bringing ideas to life
                through code.
              </div>

              <div className="section-title">EXPERIENCE</div>

              <section className="exp">
                <div className="exp-role">FULL STACK WEB DEVELOPER</div>
                <div className="exp-meta"><a href="https://id-design.pl" target="_blank"> id Design | 2022 - Present</a></div>
                <ul className="bullets">
                  <li>Developed and maintained responsive web applications</li>
                  <li>Managed server configurations and deployments</li>
                  <li>Administered databases, designing schemas, optimizing queries, and ensuring data integrity and backups.</li>
                  <li>Led the migration of a legacy CMS to Laravel, improving code maintainability, security, and performance.</li>
                </ul>
              </section>

              <section className="exp">
                <div className="exp-role">E-COMMERCE</div>
                <div className="exp-meta"><a href="https://agares.co.uk" target="_blank">Agares | 2021 (self employed)</a></div>
                <ul className="bullets">
                  <li>Built e-commerce websites</li>
                  <li>Customer Service and sales</li>
                  <li>Managed online sales platforms, including product listings, inventory management, and order fulfillment.</li>
                  <li>Social Media and advertisement</li>
                </ul>
              </section>

              <section className="exp">
                <div className="exp-role">COMPUTER TECHNICIAN / SALES</div>
                <div className="exp-meta"><a href="https://xeox.pl" target="_blank"> Xeox.pl | 2020 - 2022</a></div>
                <ul className="bullets">
                  <li>Diagnostics and repairs on a variety of computer hardware and software issues</li>
                  <li>Computer Assembly</li>
                  <li>Customer Service, sales and E-commerce</li>
                  <li>Troubleshot and resolved network connectivity issues</li>
                </ul>
              </section>
            </main>
          </div>

          <div className="gdpr">
            I consent to the processing of my personal data included in this CV for the purposes of the recruitment
            process, in accordance with applicable laws.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFTemplate;
