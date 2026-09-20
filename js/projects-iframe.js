/**
 * Projects Showcase & Interactive Iframe Controller for Mitali Sonkiya
 * Supports loading live GitHub Pages / Vercel deployments & responsive local mirrors in iframes.
 */

(function () {
  const modalBackdrop = document.getElementById('iframeModal');
  const iframeEl = document.getElementById('liveProjectIframe');
  const modalTitle = document.getElementById('iframeModalTitle');
  const modalGithubLink = document.getElementById('iframeGithubLink');
  const modalExternalLink = document.getElementById('iframeExternalLink');
  const viewportContainer = document.getElementById('iframeViewportContainer');
  const projectsGrid = document.getElementById('projectsGrid');
  const filterButtons = document.querySelectorAll('.filter-btn');

  let currentProject = null;
  let useExternalDeployment = false;

  function init() {
    renderProjects('all');
    setupFilterListeners();
    setupModalListeners();
  }

  function renderProjects(filterCategory) {
    if (!projectsGrid || !window.PORTFOLIO_PROJECTS) return;

    const filtered = filterCategory === 'all' 
      ? window.PORTFOLIO_PROJECTS 
      : window.PORTFOLIO_PROJECTS.filter(p => p.category === filterCategory);

    projectsGrid.innerHTML = filtered.map(project => `
      <article class="project-card reveal delay-1" data-category="${project.category}">
        <div class="project-thumb-wrapper">
          <img src="${project.image}" alt="${project.title} Mockup Preview" class="project-thumb" loading="lazy" />
          <span class="project-badge-tag">${project.badge}</span>
          <div class="project-overlay-actions">
            <button class="btn-preview-trigger" onclick="window.openProjectIframe('${project.id}')">
              <i class="fa-solid fa-play"></i> Live Iframe Preview
            </button>
            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-github-link" title="View Source on GitHub">
              <i class="fa-brands fa-github"></i> GitHub
            </a>
          </div>
        </div>

        <div class="project-body">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem;">
            <h3 class="project-title">${project.title}</h3>
            ${project.liveExternalUrl ? `<a href="${project.liveExternalUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 0.75rem; color: var(--emerald-light); font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live URL</a>` : ''}
          </div>
          <p class="project-desc">${project.description}</p>
          
          <div class="project-tech-stack">
            ${project.techStack.map(tech => `<span class="tech-pill">${tech}</span>`).join('')}
          </div>

          <div class="project-footer-links">
            <button class="link-live" onclick="window.openProjectIframe('${project.id}')">
              <i class="fa-solid fa-laptop-code"></i> Interactive Frame & Live View
            </button>
            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--text-muted); font-size: 0.85rem;" title="View Source on GitHub">
              <i class="fa-brands fa-github" style="font-size: 1.15rem;"></i>
            </a>
          </div>
        </div>
      </article>
    `).join('');

    if (window.initScrollReveal) {
      window.initScrollReveal();
    }
  }

  function setupFilterListeners() {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-filter');
        renderProjects(cat);
      });
    });
  }

  window.openProjectIframe = function (projectId, preferExternal = false) {
    const project = window.PORTFOLIO_PROJECTS.find(p => p.id === projectId);
    if (!project || !modalBackdrop) return;

    currentProject = project;
    useExternalDeployment = preferExternal;

    modalTitle.innerHTML = `<i class="fa-solid fa-circle-play" style="color: var(--cyan);"></i> ${project.title} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted); margin-left: 0.5rem;">— ${project.subtitle}</span>`;
    
    if (modalGithubLink) modalGithubLink.href = project.githubUrl;
    if (modalExternalLink) modalExternalLink.href = project.liveExternalUrl || project.liveUrl;

    setViewport('desktop');

    // Load iframe target
    const targetUrl = (preferExternal && project.liveExternalUrl) ? project.liveExternalUrl : project.iframeUrl;
    iframeEl.src = targetUrl;

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectIframe = function () {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    iframeEl.src = 'about:blank';
    document.body.style.overflow = '';
  };

  window.reloadProjectIframe = function () {
    if (currentProject && iframeEl) {
      const targetUrl = (useExternalDeployment && currentProject.liveExternalUrl) ? currentProject.liveExternalUrl : currentProject.iframeUrl;
      iframeEl.src = targetUrl;
    }
  };

  window.toggleDeploymentSource = function () {
    if (!currentProject) return;
    useExternalDeployment = !useExternalDeployment;
    window.openProjectIframe(currentProject.id, useExternalDeployment);
  };

  window.setViewport = function (mode) {
    if (!viewportContainer) return;
    viewportContainer.classList.remove('viewport-desktop', 'viewport-tablet', 'viewport-mobile');
    viewportContainer.classList.add(`viewport-${mode}`);

    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });
  };

  function setupModalListeners() {
    if (!modalBackdrop) return;

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        window.closeProjectIframe();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
        window.closeProjectIframe();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
