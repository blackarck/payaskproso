/**
 * Payroll by AskProso — Modern Interactive Application Engine
 * Combines Cursor.com's technical responsiveness with Guild.ai's
 * alive generative canvas physics and autonomous simulation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initHeroCanvas();
  initDividerCanvases();
  initWorkbenchSimulator();
  initRoiCalculator();
  initCopilotSimulator();
  initFaqAccordion();
  initConsultationModal();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Light / Dark with LocalStorage & OS Sync)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('askproso_payroll_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('askproso_payroll_theme', isDark ? 'dark' : 'light');
      updateThemeToggleIcons(isDark);
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }));
    });
  });

  updateThemeToggleIcons(document.documentElement.classList.contains('dark'));
}

function updateThemeToggleIcons(isDark) {
  const moonIcons = document.querySelectorAll('.icon-moon');
  const sunIcons = document.querySelectorAll('.icon-sun');

  moonIcons.forEach(el => el.classList.toggle('hidden', isDark));
  sunIcons.forEach(el => el.classList.toggle('hidden', !isDark));
}

/* --------------------------------------------------------------------------
   2. Mobile & Sticky Navigation
   -------------------------------------------------------------------------- */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navbar = document.getElementById('main-nav');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add('shadow-sm', 'backdrop-blur-md');
      } else {
        navbar.classList.remove('shadow-sm');
      }
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. Interactive Hero Canvas (Guild.ai alive physics + Cursor precision)
   -------------------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let isVisible = true;
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  // Pointer tracking
  const mouse = {
    x: -1000,
    y: -1000,
    radius: 180,
    targetX: -1000,
    targetY: -1000
  };

  const nodeLabels = [
    'DAG::GROSS_PAY',
    'EPFO_ECR::OK',
    'TDS_115BAC',
    'BANK_NACH::CLEAR',
    'ATTENDANCE::PRORATE',
    '28_STATE_PT',
    'MAKER_CHECKER',
    'DPDP_PII_MASK',
    'GOTENBERG_SLIP',
    'SALARY_HOLD_SHIELD'
  ];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : (Math.random() > 0.5 ? 0 : width);
      this.y = initial ? Math.random() * height : Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 1.2;
      this.hasLabel = Math.random() < 0.35;
      this.label = this.hasLabel ? nodeLabels[Math.floor(Math.random() * nodeLabels.length)] : null;
      this.alpha = Math.random() * 0.4 + 0.3;
      this.isRuby = Math.random() < 0.22;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around bounds
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Interactive mouse attraction/repulsion
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius && dist > 1) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 1.2;
        this.y -= Math.sin(angle) * force * 1.2;
      }
    }

    draw(isDark) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      if (this.isRuby) {
        ctx.fillStyle = isDark ? `rgba(255, 46, 91, ${this.alpha * 1.2})` : `rgba(226, 14, 60, ${this.alpha * 1.1})`;
      } else {
        ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${this.alpha * 0.8})` : `rgba(15, 23, 42, ${this.alpha * 0.7})`;
      }
      ctx.fill();

      // Render technical label badge for landmark nodes
      if (this.hasLabel) {
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.65)' : 'rgba(75, 85, 99, 0.7)';
        ctx.fillText(this.label, this.x + 6, this.y + 3);
      }
    }
  }

  let particles = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const count = Math.min(Math.floor((width * height) / 14000), 55);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  // Pointer movement listener with soft lerp
  window.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    mouse.targetX = -1000;
    mouse.targetY = -1000;
  });

  // Pause when scrolled off-screen
  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible && !animationFrameId) {
      animate();
    }
  }, { threshold: 0.05 });
  observer.observe(canvas);

  const resizeObserver = new ResizeObserver(() => {
    resize();
  });
  resizeObserver.observe(canvas.parentElement || canvas);

  resize();

  function animate() {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }

    // Soft cursor lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.15;
    mouse.y += (mouse.targetY - mouse.y) * 0.15;

    const isDark = document.documentElement.classList.contains('dark');
    ctx.clearRect(0, 0, width, height);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(isDark);
    }

    // Draw connection lines
    const maxDist = 135;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);

          if (particles[i].isRuby || particles[j].isRuby) {
            ctx.strokeStyle = isDark ? `rgba(255, 46, 91, ${alpha * 1.5})` : `rgba(226, 14, 60, ${alpha * 1.4})`;
          } else {
            ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${alpha})` : `rgba(15, 23, 42, ${alpha * 0.9})`;
          }
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   4. Guild.ai-style Animated Canvas Dividers (Lightweight 60fps)
   -------------------------------------------------------------------------- */
function initDividerCanvases() {
  const dividerCanvases = document.querySelectorAll('.divider-canvas');
  if (!dividerCanvases.length) return;

  dividerCanvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let step = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);
    resize();

    function renderDivider() {
      const isDark = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, width, height);

      step += 0.02;
      const centerY = height / 2;

      // Draw subtle grid line
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw animated rhythm points
      const pointGap = 36;
      for (let x = 0; x < width; x += pointGap) {
        const offset = Math.sin((x / 120) + step) * 6;
        ctx.beginPath();
        ctx.arc(x, centerY + offset, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(255, 46, 91, 0.45)' : 'rgba(226, 14, 60, 0.35)';
        ctx.fill();
      }

      requestAnimationFrame(renderDivider);
    }

    renderDivider();
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Workbench Simulator (Tabs, Terminal & Logs)
   -------------------------------------------------------------------------- */
function initWorkbenchSimulator() {
  const tabButtons = document.querySelectorAll('.workbench-tab-btn');
  const panels = document.querySelectorAll('.workbench-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      panels.forEach(p => {
        if (p.id === `panel-${targetView}`) {
          p.classList.remove('hidden');
        } else {
          p.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Interactive ROI & Savings Calculator
   -------------------------------------------------------------------------- */
function initRoiCalculator() {
  const headcountSlider = document.getElementById('calc-headcount');
  const inhouseCostSlider = document.getElementById('calc-inhouse-cost');

  const headcountVal = document.getElementById('val-headcount');
  const inhouseVal = document.getElementById('val-inhouse');

  const annualSavingsEl = document.getElementById('roi-annual-savings');
  const hoursSavedEl = document.getElementById('roi-hours-saved');
  const currentSpendEl = document.getElementById('roi-current-spend');
  const prosoSpendEl = document.getElementById('roi-proso-spend');

  if (!headcountSlider || !inhouseCostSlider) return;

  function calculate() {
    const headcount = parseInt(headcountSlider.value, 10);
    const inhouseCostPerHead = parseInt(inhouseCostSlider.value, 10);

    headcountVal.textContent = headcount >= 1500 ? '1,500+' : headcount.toLocaleString('en-IN');
    inhouseVal.textContent = `₹${inhouseCostPerHead.toLocaleString('en-IN')}`;

    let prosoFeePerHead = 190;
    if (headcount < 50) prosoFeePerHead = 240;
    else if (headcount < 250) prosoFeePerHead = 190;
    else prosoFeePerHead = 150;

    const monthlyCurrentSpend = headcount * inhouseCostPerHead;
    const monthlyProsoSpend = headcount * prosoFeePerHead;
    const monthlyNetSavings = monthlyCurrentSpend - monthlyProsoSpend;
    const annualNetSavings = monthlyNetSavings * 12;

    const hoursSavedMonthly = Math.round(headcount * 0.55);

    annualSavingsEl.textContent = `₹${annualNetSavings.toLocaleString('en-IN')}`;
    hoursSavedEl.textContent = `${hoursSavedMonthly} hrs`;
    currentSpendEl.textContent = `₹${monthlyCurrentSpend.toLocaleString('en-IN')}`;
    prosoSpendEl.textContent = `₹${monthlyProsoSpend.toLocaleString('en-IN')}`;
  }

  headcountSlider.addEventListener('input', calculate);
  inhouseCostSlider.addEventListener('input', calculate);
  calculate();
}

/* --------------------------------------------------------------------------
   8. Copilot Q&A Simulator
   -------------------------------------------------------------------------- */
function initCopilotSimulator() {
  const queryButtons = document.querySelectorAll('.copilot-query-btn');
  const chatOutput = document.getElementById('copilot-chat-output');

  if (!chatOutput) return;

  const responses = {
    'q-diff': `
      <div class="space-y-2">
        <div class="text-xs text-slate-700 dark:text-slate-300">
          <p><strong>Rahul Sharma (E1001) Net Pay Breakdown:</strong></p>
          <div class="mt-1 font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
            <div>• Basic Increment: +₹5,000</div>
            <div>• PF Deduction: ₹1,800 (Statutory Capped)</div>
            <div>• TDS Bracket Adjustment: -₹900</div>
          </div>
          <p class="mt-2 font-bold text-emerald-600 dark:text-emerald-400 font-mono">Net Credit: +₹4,100 exactly.</p>
        </div>
      </div>
    `,
    'q-tax': `
      <div class="space-y-2">
        <div class="text-xs text-slate-700 dark:text-slate-300">
          <p><strong>Tax Regime Optimization (Section 115BAC):</strong></p>
          <div class="mt-1 font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
            <div>• New Regime Tax Liability: ₹38,400/yr</div>
            <div>• Old Regime Tax Liability: ₹54,200/yr</div>
            <div>• Declared 80C Proofs: ₹95,000 only</div>
          </div>
          <p class="mt-2 font-bold text-emerald-600 dark:text-emerald-400 font-mono">Recommendation: New Regime saves employee ₹15,800 net.</p>
        </div>
      </div>
    `,
    'q-hold': `
      <div class="space-y-2">
        <div class="text-xs text-slate-700 dark:text-slate-300">
          <p><strong>Anomaly Audit: Imran Qureshi (E1007)</strong></p>
          <div class="mt-1 font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
            <div>• Trigger: Mid-month resignation with 18 LOP days</div>
            <div>• Result: Negative calculated net pay (-₹3,200)</div>
            <div>• Action: Proactively quarantined to <code>HOLD_SALARY</code></div>
          </div>
          <p class="mt-2 font-bold text-amber-600 dark:text-amber-400 font-mono">Protected ICICI Batch file from bank rejection.</p>
        </div>
      </div>
    `
  };

  queryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const queryType = btn.getAttribute('data-query');
      queryButtons.forEach(b => {
        b.classList.remove('border-brand-ruby', 'bg-rose-50/50', 'dark:bg-rose-950/20', 'text-brand-ruby', 'dark:text-rose-400');
      });
      btn.classList.add('border-brand-ruby', 'bg-rose-50/50', 'dark:bg-rose-950/20', 'text-brand-ruby', 'dark:text-rose-400');

      chatOutput.innerHTML = `
        <div class="flex items-start gap-2.5 animate-fadeIn">
          <div class="w-6 h-6 rounded-full bg-brand-ruby flex items-center justify-center text-[10px] font-bold text-white shrink-0">✦</div>
          <div>
            ${responses[queryType] || responses['q-diff']}
            <p class="mt-2 text-[10px] font-mono text-slate-500">Answered from the calculation trace &middot; AI explains, engine calculates.</p>
          </div>
        </div>
      `;
    });
  });
}

/* --------------------------------------------------------------------------
   9. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        // Close other open accordions for clean accordion behavior
        faqItems.forEach(other => {
          const otherContent = other.querySelector('.faq-content');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherContent && otherContent !== content) {
            otherContent.classList.add('hidden');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        content.classList.toggle('hidden', isOpen);
        if (icon) {
          icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   10. Consultation & Migration Modal
   -------------------------------------------------------------------------- */
function initConsultationModal() {
  const modal = document.getElementById('consultation-modal');
  const openButtons = document.querySelectorAll('.open-consultation-modal');
  const closeButton = document.querySelector('.close-consultation-modal');
  const form = document.getElementById('consultation-form');
  const successState = document.getElementById('modal-success-state');

  if (!modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeButton) closeButton.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.add('hidden');
      if (successState) successState.classList.remove('hidden');

      setTimeout(() => {
        closeModal();
        setTimeout(() => {
          form.classList.remove('hidden');
          if (successState) successState.classList.add('hidden');
          form.reset();
        }, 300);
      }, 2500);
    });
  }
}
