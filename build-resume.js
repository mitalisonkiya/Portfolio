const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const photoPath = path.join(__dirname, 'assets', 'mitali_sonkiya.jpg');
const photoBase64 = fs.existsSync(photoPath) ? fs.readFileSync(photoPath).toString('base64') : '';
const photoMime = 'image/jpeg';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mitali Sonkiya - Resume</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 210mm;
      height: 297mm;
      max-width: 210mm;
      max-height: 297mm;
      background: #ffffff;
      color: #1a1a1a;
      font-family: Arial, Helvetica, 'Liberation Sans', sans-serif;
      font-size: 9.3pt;
      line-height: 1.34;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      overflow: hidden;
    }

    .resume-sheet {
      padding: 13mm 15mm 12mm 15mm;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    /* Top Header */
    .header-box {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
    }
    .header-left {
      flex: 1;
    }
    .name-title {
      font-size: 28pt;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #14213d;
      text-transform: uppercase;
      line-height: 1;
      margin-bottom: 5px;
    }
    .designation {
      font-size: 11pt;
      font-weight: 700;
      color: #14213d;
      margin-bottom: 7px;
    }
    .title-rule {
      height: 2.8px;
      background-color: #14213d;
      width: 100%;
      margin-bottom: 8px;
    }
    .summary-para {
      font-size: 8.6pt;
      color: #333333;
      line-height: 1.36;
      text-align: justify;
    }
    .photo-frame {
      width: 98px;
      height: 118px;
      border: 1.8px solid #14213d;
      padding: 0;
      flex-shrink: 0;
      overflow: hidden;
      background: #eee;
    }
    .photo-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* 2 Columns Layout */
    .columns-row {
      display: flex;
      gap: 18px;
      margin-top: 10px;
      flex: 1;
    }
    .left-pane {
      flex: 1;
    }
    .right-pane {
      width: 59mm;
      flex-shrink: 0;
    }

    /* Section Banner */
    .section-header {
      border: 1.4px solid #14213d;
      padding: 3px 0;
      text-align: center;
      font-size: 8.8pt;
      font-weight: 800;
      letter-spacing: 1.4px;
      color: #14213d;
      text-transform: uppercase;
      margin-bottom: 9px;
      margin-top: 6px;
      background-color: #ffffff;
    }
    .section-header:first-of-type {
      margin-top: 0;
    }

    /* Work Experience */
    .exp-container {
      display: flex;
      gap: 10px;
      align-items: stretch;
      margin-bottom: 6px;
    }
    .exp-date-box {
      border: 1.2px solid #14213d;
      padding: 8px 3px;
      font-size: 7.2pt;
      font-weight: 700;
      color: #14213d;
      display: flex;
      align-items: center;
      justify-content: center;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }
    .exp-details {
      flex: 1;
    }
    .exp-company {
      font-size: 8.6pt;
      color: #555555;
      font-weight: 600;
    }
    .exp-role {
      font-size: 8.8pt;
      font-weight: 800;
      color: #14213d;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    /* Bullets */
    .custom-bullet-list {
      list-style-type: none;
      padding-left: 0;
    }
    .custom-bullet-list li {
      position: relative;
      padding-left: 12px;
      margin-bottom: 3.5px;
      font-size: 8.2pt;
      color: #2b2b2b;
      line-height: 1.32;
    }
    .custom-bullet-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      top: -0.5px;
      color: #14213d;
      font-size: 9pt;
      font-weight: bold;
    }

    /* Projects */
    .project-block {
      margin-bottom: 7px;
    }
    .project-url {
      font-size: 7.5pt;
      color: #1d4ed8;
      text-decoration: underline;
      display: block;
      margin-bottom: 1px;
    }
    .project-headline {
      font-size: 8.3pt;
      font-weight: 800;
      color: #14213d;
      text-transform: uppercase;
      margin-bottom: 3px;
      line-height: 1.25;
    }

    /* Contact Details */
    .contact-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 7.9pt;
      color: #2b2b2b;
    }
    .contact-circle {
      width: 18px;
      height: 18px;
      background: #14213d;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      flex-shrink: 0;
    }
    .contact-circle svg {
      width: 10px;
      height: 10px;
      fill: currentColor;
    }
    .contact-row a {
      color: #2b2b2b;
      text-decoration: none;
      word-break: break-all;
    }
    .contact-row a:hover {
      text-decoration: underline;
    }

    /* Education */
    .edu-block {
      margin-bottom: 8px;
      font-size: 7.9pt;
    }
    .edu-year {
      color: #555555;
      font-weight: 700;
      font-size: 7.8pt;
    }
    .edu-school {
      font-weight: 600;
      color: #222222;
    }
    .edu-degree-title {
      font-weight: 800;
      color: #14213d;
      text-transform: uppercase;
      line-height: 1.2;
    }
    .edu-extra {
      color: #555555;
      font-size: 7.5pt;
    }

    /* Skills */
    .skill-section-item {
      margin-bottom: 6px;
    }
    .skill-cat-title {
      font-weight: 800;
      color: #14213d;
      font-size: 7.9pt;
      margin-bottom: 1.5px;
    }
    .skill-cat-desc {
      color: #333333;
      font-size: 7.7pt;
      line-height: 1.28;
    }

    /* Languages */
    .lang-text {
      font-size: 8.1pt;
      color: #333333;
      font-weight: 500;
    }
  </style>
</head>
<body>

<div class="resume-sheet">

  <!-- Header -->
  <header class="header-box">
    <div class="header-left">
      <h1 class="name-title">MITALI SONKIYA</h1>
      <div class="designation">Front-End Developer</div>
      <div class="title-rule"></div>
      <p class="summary-para">
        Front-End Developer with a BCA from JECRC University (2023-2026), a web development internship and 4 live projects deployed on Vercel, Netlify and GitHub Pages. Built a multi-page website, a task manager, an expense-splitting app and a React showcase site using HTML5, CSS3, JavaScript ES6, Bootstrap and React. Seeking a Front-End Developer internship or fresher role at a product company or startup.
      </p>
    </div>
    <div class="photo-frame">
      <img src="data:${photoMime};base64,${photoBase64}" alt="Mitali Sonkiya">
    </div>
  </header>

  <!-- Body 2 Columns -->
  <div class="columns-row">
    
    <!-- Left Column -->
    <div class="left-pane">
      
      <!-- Work Experience -->
      <div class="section-header">WORK EXPERIENCE</div>
      <div class="exp-container">
        <div class="exp-date-box">02/2026-06/2026</div>
        <div class="exp-details">
          <div class="exp-company">Fineoutput Technologies Pvt Ltd, Jaipur</div>
          <div class="exp-role">WEB DEVELOPMENT AND DESIGN INTERN</div>
          <ul class="custom-bullet-list">
            <li>Learned Bootstrap by building 2-3 sample websites, then designed and developed Chefer, a multi-page responsive website, using HTML, CSS and Bootstrap.</li>
            <li>Implemented the Bootstrap grid and components for a layout that adapts to screen size; tested on 3 screen sizes: desktop full screen, desktop half screen and mobile.</li>
            <li>Achieved Lighthouse Performance scores between 85 and 90+ when tested from 6 countries.</li>
            <li>Deployed the site live on GitHub Pages: <a href="https://mitalisonkiya.github.io/Chefer" target="_blank" style="color:#1d4ed8; text-decoration:none;">mitalisonkiya.github.io/Chefer</a></li>
          </ul>
        </div>
      </div>

      <!-- Projects -->
      <div class="section-header" style="margin-top: 10px;">PROJECTS</div>
      
      <!-- FairShare -->
      <div class="project-block">
        <a href="https://fair-share-puce.vercel.app/" target="_blank" class="project-url">https://fair-share-puce.vercel.app/</a>
        <div class="project-headline">FAIRSHARE, EXPENSE-SPLITTING WEB APP | JAVASCRIPT | LIVE ON VERCEL</div>
        <ul class="custom-bullet-list">
          <li>Built and deployed a Splitwise-style web app where users create groups for trips, homes or shared bills, record who paid, and split costs equally among members.</li>
          <li>Implemented the app logic in JavaScript, including a Settle Up feature that reduces many debts to the fewest direct payments; used AI assistance for the logic code and tested and debugged it myself.</li>
          <li>Added sign-in and sign-up screens and local browser storage so data stays on the user's device.</li>
        </ul>
      </div>

      <!-- Mino -->
      <div class="project-block">
        <a href="https://mino-folio.netlify.app/" target="_blank" class="project-url">https://mino-folio.netlify.app/</a>
        <div class="project-headline">MINO, TO-DO LIST AND FOCUS TIMER | HTML, CSS, JAVASCRIPT</div>
        <ul class="custom-bullet-list">
          <li>Developed a task manager with priorities, categories, due dates and filters, deployed live on Netlify.</li>
          <li>Added a Pomodoro focus timer, daily notes and a weekly activity view, and saved tasks on the user's device so data persists between visits.</li>
        </ul>
      </div>

      <!-- Radhe Radhe -->
      <div class="project-block">
        <a href="https://radhe-radhe-tau.vercel.app/" target="_blank" class="project-url">https://radhe-radhe-tau.vercel.app/</a>
        <div class="project-headline">RADHE RADHE, GEMSTONE AND JEWELLERY SHOWCASE | REACT, BOOTSTRAP, CSS ANIMATIONS</div>
        <ul class="custom-bullet-list">
          <li>Built a showcase site for a jewellery business using Google Antigravity (AI coding tool), where each gemstone appears on scroll and the page colour theme changes with it.</li>
          <li>Planned the concept, colour theme and scroll animation for each gemstone, directed the AI through the build, then tested and deployed the site on Vercel.</li>
          <li>Replaced an initial spiral animation with a lighter one after it slowed the site, reaching Lighthouse Performance scores of 90+ on desktop and 80+ on mobile.</li>
        </ul>
      </div>

    </div>

    <!-- Right Column -->
    <div class="right-pane">
      
      <!-- Contact -->
      <div class="section-header">CONTACT</div>
      
      <div class="contact-row">
        <div class="contact-circle">
          <svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/></svg>
        </div>
        <span>+91 6376021390</span>
      </div>
      
      <div class="contact-row">
        <div class="contact-circle">
          <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
        </div>
        <span>Jaipur, India</span>
      </div>

      <div class="contact-row">
        <div class="contact-circle">
          <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        </div>
        <a href="mailto:sonkiyamitali@gmail.com">sonkiyamitali@gmail.com</a>
      </div>

      <div class="contact-row">
        <div class="contact-circle">
          <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        </div>
        <a href="https://github.com/mitalisonkiya" target="_blank">github.com/mitalisonkiya</a>
      </div>

      <div class="contact-row">
        <div class="contact-circle">
          <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
        </div>
        <a href="https://linkedin.com/in/mitali-sonkiya-3a8bab247" target="_blank">linkedin.com/in/mitali-sonkiya-3a8bab247</a>
      </div>

      <div class="contact-row">
        <div class="contact-circle">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
        </div>
        <a href="https://mitalisonkiyaportfolio.vercel.app" target="_blank">mitalisonkiyaportfolio.vercel.app</a>
      </div>

      <!-- Education -->
      <div class="section-header" style="margin-top: 10px;">EDUCATION</div>
      
      <div class="edu-block">
        <div class="edu-year">2023 - 2026 | CGPA: 7.59</div>
        <div class="edu-school">JECRC University, Jaipur</div>
        <div class="edu-degree-title">BACHELOR OF COMPUTER APPLICATIONS</div>
        <div class="edu-extra">Completed; degree certificate awaited</div>
      </div>

      <div class="edu-block">
        <div class="edu-year">2023 | 71.8%</div>
        <div class="edu-school">St. Xavier's Sr. Sec. School, Jaipur</div>
        <div class="edu-degree-title">CLASS 12</div>
      </div>

      <!-- Skills -->
      <div class="section-header" style="margin-top: 10px;">SKILLS</div>
      
      <div class="skill-section-item">
        <div class="skill-cat-title">Languages</div>
        <div class="skill-cat-desc">HTML5, CSS3, JavaScript (ES6)</div>
      </div>

      <div class="skill-section-item">
        <div class="skill-cat-title">Frameworks and libraries</div>
        <div class="skill-cat-desc">React (basic), Bootstrap</div>
      </div>

      <div class="skill-section-item">
        <div class="skill-cat-title">Tools and deployment</div>
        <div class="skill-cat-desc">GitHub, Vercel, Netlify, GitHub Pages, AI coding assistants such as Google Antigravity (code reviewed, tested and debugged by me)</div>
      </div>

      <div class="skill-section-item">
        <div class="skill-cat-title">Design and UX</div>
        <div class="skill-cat-desc">Responsive web design, CSS animations</div>
      </div>

      <!-- Languages -->
      <div class="section-header" style="margin-top: 10px;">LANGUAGES</div>
      <div class="lang-text">Hindi, English</div>

    </div>

  </div>

</div>

</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'resume-print.html'), htmlContent);
console.log('Updated resume-print.html successfully.');
