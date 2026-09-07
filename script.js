/**
 * Vishnu Irappa Sangammanavar - Portfolio & Web Resume Logic
 * Vanilla JavaScript with High Interaction Polish
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Theme Management (Light / Dark Theme)
  // =========================================================================
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'dark' ? '#09090b' : '#fafafa');
    }
  }

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (prefersDark) {
    applyTheme('dark');
  } else {
    applyTheme('dark');
  }

  function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // =========================================================================
  // 2. Real-Time Live Clock (Header & Footer)
  // =========================================================================
  const headerTimeStr = document.getElementById('live-time-str');
  const footerClock = document.getElementById('footer-live-clock');

  function updateLiveClocks() {
    const now = new Date();
    // Format options for header: 03:38:00 AM
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    };
    const formattedHeaderTime = now.toLocaleTimeString('en-US', timeOptions);
    if (headerTimeStr) {
      headerTimeStr.textContent = formattedHeaderTime;
    }

    // Format for footer: 03:38:00 IST
    const time24Options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    };
    const formattedFooterTime = now.toLocaleTimeString('en-GB', time24Options);
    if (footerClock) {
      footerClock.textContent = `${formattedFooterTime} IST`;
    }
  }

  updateLiveClocks();
  setInterval(updateLiveClocks, 1000);

  // Update footer year dynamically
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 3. Mouse Spotlight Tracker for Cards
  // =========================================================================
  const spotlightCards = document.querySelectorAll('.spotlight-card');

  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // =========================================================================
  // 4. Design & Dev Activity Heatmap Generation (52 weeks x 7 days)
  // =========================================================================
  const activityGrid = document.getElementById('activity-grid');

  if (activityGrid) {
    const totalWeeks = 52;
    const daysPerWeek = 7;
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    
    for (let w = 0; w < totalWeeks; w++) {
      for (let d = 0; d < daysPerWeek; d++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';

        let lvl = 0;
        const progress = w / totalWeeks;
        const rand = Math.random();

        if (progress < 0.8) {
          // Sparse period (Aug to May)
          if (rand > 0.98) lvl = 4;
          else if (rand > 0.95) lvl = 3;
          else if (rand > 0.90) lvl = 2;
          else if (rand > 0.85) lvl = 1;
          else lvl = 0;
        } else {
          // Dense period (Jun to Aug)
          if (rand > 0.85) lvl = 4;
          else if (rand > 0.60) lvl = 3;
          else if (rand > 0.35) lvl = 2;
          else if (rand > 0.15) lvl = 1;
          else lvl = 0;
        }

        cell.classList.add(`lvl-${lvl}`);

        const approxMonth = months[Math.floor(progress * (months.length - 1))];
        const approxDay = ((w * 7 + d) % 28) + 1;
        const iterations = lvl === 0 ? 'No commits' : `${lvl * 3 + Math.floor(rand * 3)} commits & design updates`;
        cell.title = `${iterations} on ${approxMonth} ${approxDay}`;

        activityGrid.appendChild(cell);
      }
    }
  }

  // =========================================================================
  // 5. Interactive SVG Analytics Area Chart
  // =========================================================================
  const chartDatasets = {
    '24h': {
      xLabels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
      views: [45, 28, 95, 230, 310, 210, 140],
      visitors: [18, 10, 38, 92, 120, 78, 52]
    },
    '7d': {
      xLabels: ['Aug 12', 'Aug 13', 'Aug 14', 'Aug 15', 'Aug 16', 'Aug 17', 'Aug 18'],
      views: [160, 100, 110, 248, 230, 130, 90],
      visitors: [50, 35, 42, 72, 85, 40, 30]
    },
    '30d': {
      xLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      views: [480, 620, 890, 1100, 780],
      visitors: [180, 240, 340, 420, 290]
    }
  };

  let currentTf = '7d';
  const chartSvg = document.getElementById('interactive-chart');
  const lineRose = document.getElementById('chart-line-rose');
  const lineCyan = document.getElementById('chart-line-cyan');
  const areaRose = document.getElementById('chart-area-rose');
  const areaCyan = document.getElementById('chart-area-cyan');
  const crosshair = document.getElementById('chart-crosshair');
  const pointRose = document.getElementById('chart-point-rose');
  const pointCyan = document.getElementById('chart-point-cyan');
  const chartTooltip = document.getElementById('chart-tooltip');
  const tooltipDate = document.getElementById('tooltip-date');
  const tooltipViews = document.getElementById('tooltip-views');
  const tooltipVisitors = document.getElementById('tooltip-visitors');
  const chartXDates = document.getElementById('chart-x-dates');
  const tfButtons = document.querySelectorAll('.tf-btn');

  const chartBounds = { left: 40, right: 730, top: 40, bottom: 230 };

  function renderChart(timeframe) {
    const data = chartDatasets[timeframe];
    if (!data) return;

    if (chartXDates) {
      chartXDates.innerHTML = data.xLabels.map(l => `<span>${l}</span>`).join('');
    }

    const n = data.views.length;
    const maxVal = Math.max(...data.views) * 1.15 || 300;
    const stepX = (chartBounds.right - chartBounds.left) / (n - 1);

    const rosePoints = data.views.map((val, i) => {
      const x = chartBounds.left + i * stepX;
      const y = chartBounds.bottom - (val / maxVal) * (chartBounds.bottom - chartBounds.top);
      return { x, y, val };
    });

    const cyanPoints = data.visitors.map((val, i) => {
      const x = chartBounds.left + i * stepX;
      const y = chartBounds.bottom - (val / maxVal) * (chartBounds.bottom - chartBounds.top);
      return { x, y, val };
    });

    function getCurvedPath(points) {
      if (points.length === 0) return '';
      let d = `M ${points[0].x},${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cx1 = p0.x + (p1.x - p0.x) / 2;
        const cy1 = p0.y;
        const cx2 = p0.x + (p1.x - p0.x) / 2;
        const cy2 = p1.y;
        d += ` C ${cx1},${cy1} ${cx2},${cy2} ${p1.x},${p1.y}`;
      }
      return d;
    }

    const roseLinePath = getCurvedPath(rosePoints);
    const cyanLinePath = getCurvedPath(cyanPoints);

    if (lineRose) lineRose.setAttribute('d', roseLinePath);
    if (lineCyan) lineCyan.setAttribute('d', cyanLinePath);

    if (areaRose) {
      const roseArea = `${roseLinePath} L ${rosePoints[rosePoints.length - 1].x},${chartBounds.bottom} L ${rosePoints[0].x},${chartBounds.bottom} Z`;
      areaRose.setAttribute('d', roseArea);
    }

    if (areaCyan) {
      const cyanArea = `${cyanLinePath} L ${cyanPoints[cyanPoints.length - 1].x},${chartBounds.bottom} L ${cyanPoints[0].x},${chartBounds.bottom} Z`;
      areaCyan.setAttribute('d', cyanArea);
    }
  }

  renderChart(currentTf);

  tfButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tfButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTf = btn.dataset.tf;
      renderChart(currentTf);
    });
  });

  if (chartSvg) {
    chartSvg.addEventListener('mousemove', (e) => {
      const rect = chartSvg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 760;

      if (mouseX < chartBounds.left || mouseX > chartBounds.right) {
        hideChartTooltip();
        return;
      }

      const data = chartDatasets[currentTf];
      const n = data.views.length;
      const stepX = (chartBounds.right - chartBounds.left) / (n - 1);
      const index = Math.round((mouseX - chartBounds.left) / stepX);

      if (index >= 0 && index < n) {
        const clampedIndex = Math.max(0, Math.min(n - 1, index));
        const currentX = chartBounds.left + clampedIndex * stepX;
        const maxVal = Math.max(...data.views) * 1.15 || 300;

        const valViews = data.views[clampedIndex];
        const valVisitors = data.visitors[clampedIndex];
        const yViews = chartBounds.bottom - (valViews / maxVal) * (chartBounds.bottom - chartBounds.top);
        const yVisitors = chartBounds.bottom - (valVisitors / maxVal) * (chartBounds.bottom - chartBounds.top);

        if (crosshair) {
          crosshair.setAttribute('x1', currentX);
          crosshair.setAttribute('x2', currentX);
          crosshair.style.display = 'block';
        }

        if (pointRose) {
          pointRose.setAttribute('cx', currentX);
          pointRose.setAttribute('cy', yViews);
          pointRose.style.display = 'block';
        }

        if (pointCyan) {
          pointCyan.setAttribute('cx', currentX);
          pointCyan.setAttribute('cy', yVisitors);
          pointCyan.style.display = 'block';
        }

        if (chartTooltip) {
          tooltipDate.textContent = data.xLabels[clampedIndex];
          tooltipViews.textContent = valViews.toLocaleString();
          tooltipVisitors.textContent = valVisitors.toLocaleString();
          
          const tooltipLeftPercent = (currentX / 760) * 100;
          chartTooltip.style.left = `${tooltipLeftPercent}%`;
          chartTooltip.style.display = 'flex';
        }
      }
    });

    chartSvg.addEventListener('mouseleave', hideChartTooltip);
  }

  function hideChartTooltip() {
    if (crosshair) crosshair.style.display = 'none';
    if (pointRose) pointRose.style.display = 'none';
    if (pointCyan) pointCyan.style.display = 'none';
    if (chartTooltip) chartTooltip.style.display = 'none';
  }

  // =========================================================================
  // 6. Modals (/uses Setup & Real Project Case Studies)
  // =========================================================================
  const usesModal = document.getElementById('uses-modal');
  const openUsesModalBtn = document.getElementById('open-uses-modal');
  const openUsesNavBtn = document.getElementById('open-uses-nav');
  const closeUsesModalBtn = document.getElementById('close-uses-modal');

  function openUses() {
    if (usesModal) {
      usesModal.classList.add('open');
      usesModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeUses() {
    if (usesModal) {
      usesModal.classList.remove('open');
      usesModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (openUsesModalBtn) openUsesModalBtn.addEventListener('click', openUses);
  if (openUsesNavBtn) openUsesNavBtn.addEventListener('click', openUses);
  if (closeUsesModalBtn) closeUsesModalBtn.addEventListener('click', closeUses);

  // Case Study Details Modal (From Vishnu's Real Projects)
  const csModal = document.getElementById('case-study-modal');
  const csModalTitle = document.getElementById('cs-modal-title');
  const csBadge = document.getElementById('cs-badge');
  const csModalBody = document.getElementById('cs-modal-body');
  const closeCsModalBtn = document.getElementById('close-cs-modal');
  const csButtons = document.querySelectorAll('.open-case-study');

  const projectCaseStudies = {
    defensedashboard: {
      title: 'Defense Command Dashboard — Command-Center Layout & Telemetry',
      badge: 'React.js & Chart.js (Apr 2026)',
      content: `
        <div class="cs-content">
          <p class="cs-lead">A high-density command-center web portal engineered with real-time data visualization panels and adaptable tactical layouts for operational status tracking and system monitoring.</p>
          <div class="cs-section">
            <h4 style="color:#f4f4f5; margin-bottom:6px;">✦ Architecture &amp; Command-Center Layout</h4>
            <p style="color:#a1a1aa; font-size:0.86rem;">Designed a dashboard-style web portal featuring <strong>7 navigation sections</strong> and <strong>4 data visualization panels</strong>, exploring command-center-inspired layouts for status tracking and system monitoring.</p>
          </div>
          <div class="cs-section" style="margin-top:12px;">
            <h4 style="color:#f4f4f5; margin-bottom:6px;">✦ Reusable Components &amp; Adaptability</h4>
            <p style="color:#a1a1aa; font-size:0.86rem;">Developed reusable <strong>React components</strong> integrated with <strong>Chart.js</strong> to power intuitive navigation, theme switching, and a layout that smoothly adapts across diverse screen sizes.</p>
          </div>
          <div class="cs-section" style="margin-top:12px;">
            <h4 style="color:#f4f4f5; margin-bottom:6px;">✦ Military-Inspired Theming &amp; UI</h4>
            <p style="color:#a1a1aa; font-size:0.86rem;">Crafted a military-inspired interface with custom CSS themes, ensuring critical dashboard metrics and telemetry signals are effortless to scan at a glance.</p>
          </div>
        </div>
      `
    },
    graminseva: {
      title: 'Gramin Seva — Complaint Management System',
      badge: 'React.js & MongoDB (Feb 2026)',
      content: `
        <div class="cs-content">
          <p class="cs-lead">A full-stack civic complaint platform built specifically for rural communities to streamline issue reporting, governance tracking, and rapid administrative resolution.</p>
          <div class="cs-section">
            <h4 style="color:#f4f4f5; margin-bottom:6px;">✦ Multi-Role Lifecycle Management</h4>
            <p style="color:#a1a1aa; font-size:0.86rem;">Built a complaint platform for rural communities, supporting <strong>2 user roles</strong> across submission, tracking, and administration, with a structured 3-stage lifecycle: <strong>Pending, In Progress, Resolved</strong>.</p>
          </div>
          <div class="cs-section" style="margin-top:12px;">
            <h4 style="color:#f4f4f5; margin-bottom:6px;">✦ RBAC &amp; Scalable REST APIs</h4>
            <p style="color:#a1a1aa; font-size:0.86rem;">Engineered robust <strong>CRUD APIs</strong> with role-based access control (RBAC), seamlessly connecting the React frontend to <strong>MongoDB</strong> to store and securely manage complaint records.</p>
          </div>
          <div class="cs-section" style="margin-top:12px;">
            <h4 style="color:#f4f4f5; margin-bottom:6px;">✦ Low-Bandwidth Optimization</h4>
            <p style="color:#a1a1aa; font-size:0.86rem;">Optimized the entire interface with <strong>Tailwind CSS</strong> to deliver an ultra-streamlined, low-bandwidth-friendly experience tailored for rural network environments.</p>
          </div>
        </div>
      `
    },
    ybtdigital: {
      title: 'YBT Digital — Digital Product Marketplace',
      badge: 'Next.js, TypeScript & Payments (May 2026)',
      content: `
        <div class="cs-content">
          <p class="cs-lead">An enterprise-grade, full-stack digital product marketplace architected with Next.js, TypeScript, and multi-gateway payment processing.</p>
          <div class="cs-section">
            <h4 style="color:#f4f4f5; margin-bottom:6px;">✦ Modular Marketplace Architecture</h4>
            <p style="color:#a1a1aa; font-size:0.86rem;">Architected a full-stack digital marketplace integrating <strong>10+ core modules</strong>, including product discovery, search and filtering, cart, coupons, checkout, payments, orders, invoices, and secure downloads.</p>
          </div>
          <div class="cs-section" style="margin-top:12px;">
            <h4 style="color:#f4f4f5; margin-bottom:6px;">✦ Role-Based Admin &amp; Data Models</h4>
            <p style="color:#a1a1aa; font-size:0.86rem;">Established a role-based admin system supporting <strong>3 user roles</strong> with <strong>10+ database models</strong> (MongoDB/Mongoose) for managing products, users, orders, coupons, support, FAQs, settings, and sales analytics.</p>
          </div>
          <div class="cs-section" style="margin-top:12px;">
            <h4 style="color:#f4f4f5; margin-bottom:6px;">✦ Payment Gateways &amp; Dual Themes</h4>
            <p style="color:#a1a1aa; font-size:0.86rem;">Implemented <strong>3 payment gateways</strong> (including Razorpay and Stripe), secure authentication, and <strong>2 UI themes</strong> with responsive, mobile-first design using Next.js and Tailwind CSS.</p>
          </div>
        </div>
      `
    }
  };

  csButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.dataset.project;
      const data = projectCaseStudies[projId];
      if (data && csModal) {
        csModalTitle.textContent = data.title;
        csBadge.textContent = data.badge;
        csModalBody.innerHTML = data.content;
        csModal.classList.add('open');
        csModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  if (closeCsModalBtn) {
    closeCsModalBtn.addEventListener('click', () => {
      if (csModal) {
        csModal.classList.remove('open');
        csModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Close modals on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === usesModal) closeUses();
    if (e.target === csModal && csModal) {
      csModal.classList.remove('open');
      csModal.setAttribute('aria-hidden', 'true');
    }
  });

  // =========================================================================
  // 7. Command Palette System (Cmd+K / Ctrl+K)
  // =========================================================================
  const cmdBackdrop = document.getElementById('cmd-palette-backdrop');
  const cmdTrigger = document.getElementById('cmd-k-trigger');
  const cmdCloseBtn = document.getElementById('cmd-close-btn');
  const cmdInput = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');
  const cmdItems = document.querySelectorAll('.cmd-item');

  let selectedCmdIndex = 0;

  function openCommandPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.add('open');
    cmdBackdrop.setAttribute('aria-hidden', 'false');
    if (cmdInput) {
      cmdInput.value = '';
      filterCommands('');
      cmdInput.focus();
    }
  }

  function closeCommandPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.remove('open');
    cmdBackdrop.setAttribute('aria-hidden', 'true');
  }

  if (cmdTrigger) cmdTrigger.addEventListener('click', openCommandPalette);
  if (cmdCloseBtn) cmdCloseBtn.addEventListener('click', closeCommandPalette);

  if (cmdBackdrop) {
    cmdBackdrop.addEventListener('click', (e) => {
      if (e.target === cmdBackdrop) closeCommandPalette();
    });
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdBackdrop && cmdBackdrop.classList.contains('open')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    }

    // Escape
    if (e.key === 'Escape') {
      closeCommandPalette();
      closeUses();
      if (csModal) csModal.classList.remove('open');
    }

    // Theme toggle shortcut ('T' when no inputs are focused)
    if (e.key.toLowerCase() === 't' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      toggleTheme();
    }

    // Print / View Resume shortcut ('P' when no inputs are focused)
    if (e.key.toLowerCase() === 'p' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      window.open('https://drive.google.com/file/d/1H_tA4dpXtifIm5RCT636yzcjDgoBYSZv/view?usp=drive_link', '_blank', 'noopener,noreferrer');
    }

    // Command palette arrow navigation
    if (cmdBackdrop && cmdBackdrop.classList.contains('open')) {
      const visibleItems = Array.from(cmdItems).filter(item => item.style.display !== 'none');
      if (visibleItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedCmdIndex = (selectedCmdIndex + 1) % visibleItems.length;
        updateSelectedCommand(visibleItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedCmdIndex = (selectedCmdIndex - 1 + visibleItems.length) % visibleItems.length;
        updateSelectedCommand(visibleItems);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (visibleItems[selectedCmdIndex]) {
          executeCommand(visibleItems[selectedCmdIndex]);
        }
      }
    }
  });

  function updateSelectedCommand(visibleItems) {
    cmdItems.forEach(item => item.classList.remove('selected'));
    if (visibleItems[selectedCmdIndex]) {
      visibleItems[selectedCmdIndex].classList.add('selected');
      visibleItems[selectedCmdIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function filterCommands(query) {
    const q = query.toLowerCase().trim();
    selectedCmdIndex = 0;
    const visibleItems = [];

    cmdItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(q)) {
        item.style.display = 'flex';
        visibleItems.push(item);
      } else {
        item.style.display = 'none';
      }
    });

    updateSelectedCommand(visibleItems);
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      filterCommands(e.target.value);
    });
  }

  function executeCommand(item) {
    const action = item.dataset.action;
    const target = item.dataset.target;

    closeCommandPalette();

    if (action === 'navigate' && target) {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'toggle-theme') {
      toggleTheme();
    } else if (action === 'open-uses') {
      openUses();
    } else if (action === 'print-resume') {
      window.open('https://drive.google.com/file/d/1H_tA4dpXtifIm5RCT636yzcjDgoBYSZv/view?usp=drive_link', '_blank', 'noopener,noreferrer');
    } else if (action === 'copy-email') {
      copyText('vishnuirappasangammanavar@gmail.com');
    } else if (action === 'copy-phone') {
      copyText('+918147737260');
    }
  }

  cmdItems.forEach(item => {
    item.addEventListener('click', () => executeCommand(item));
  });

  // =========================================================================
  // 8. Toast & Copy to Clipboard
  // =========================================================================
  const toast = document.getElementById('toast');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    const msgSpan = toast.querySelector('.toast-msg') || toast;
    msgSpan.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  const copyButtons = document.querySelectorAll('.copy-trigger');

  async function copyText(text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied to clipboard: ${text}`);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(`Copied: ${text}`);
    }
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy || btn.textContent.trim();
      copyText(textToCopy);
    });
  });

  // =========================================================================
  // 9. Floating Back-to-Top Button
  // =========================================================================
  const backToTopBtn = document.getElementById('back-to-top');

  function updateScrollState() {
    const currentScroll = window.scrollY;

    if (backToTopBtn) {
      if (currentScroll > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 10. Scroll Reveal Animations (IntersectionObserver)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.06,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // =========================================================================
  // 11. Magnetic Dock Magnification & Scrollspy Active States
  // ===========================================================================================
  function initMagneticDock() {
    const navContainer = document.querySelector('.nav-pill-container');
    if (!navContainer) return;

    const dockItems = navContainer.querySelectorAll('.nav-dock-item');
    const sections = document.querySelectorAll('main section[id], header#hero');

    // Magnetic Proximity Distance Magnification Physics
    const maxScale = 1.38;
    const maxTranslateY = -5; // px upward lift
    const influenceRadius = 70; // px proximity radius

    navContainer.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;

      dockItems.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(mouseX - itemCenterX);

        if (distance < influenceRadius) {
          const proximity = Math.cos((distance / influenceRadius) * (Math.PI / 2));
          const scale = 1 + (maxScale - 1) * Math.pow(proximity, 2);
          const translateY = maxTranslateY * Math.pow(proximity, 2);

          item.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        } else {
          item.style.transform = 'scale(1) translateY(0px)';
        }
      });
    });

    // Reset items to standard size when mouse leaves the dock
    navContainer.addEventListener('mouseleave', () => {
      dockItems.forEach((item) => {
        item.style.transform = 'scale(1) translateY(0px)';
      });
    });

    // ScrollSpy to update active state dot as user scrolls
    function updateScrollSpy() {
      const scrollY = window.scrollY + 120;
      let currentSectionId = '';

      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      if (currentSectionId) {
        dockItems.forEach((item) => {
          const href = item.getAttribute('href');
          if (href && href === `#${currentSectionId}`) {
            dockItems.forEach((d) => d.classList.remove('active'));
            item.classList.add('active');
          }
        });
      }
    }

    window.addEventListener('scroll', updateScrollSpy, { passive: true });
    updateScrollSpy();

    dockItems.forEach((item) => {
      item.addEventListener('click', () => {
        const href = item.getAttribute('href');
        if (href && href.startsWith('#')) {
          dockItems.forEach((d) => d.classList.remove('active'));
          item.classList.add('active');
        }
      });
    });
  }

  initMagneticDock();
});
