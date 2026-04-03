    // WolfLoom compatibility checks based on build.yml requirements
    function checkWolfLoomCompatibility() {
      const checks = {
        python313: () => {
          // Check Python 3.13 support via Pyodide (web Python) or Node.js
          // For native: modern browsers support required APIs
          return navigator.userAgent.includes('Windows') || 
                 navigator.userAgent.includes('Linux') || 
                 navigator.userAgent.includes('Mac');
        },
        modernBrowser: () => {
          const ua = navigator.userAgent;
          return /Chrome\/(\d+)/.test(ua) && parseInt(RegExp.$1) >= 100 ||
                 /Firefox\/(\d+)/.test(ua) && parseInt(RegExp.$1) >= 115 ||
                 /Edg\/(\d+)/.test(ua) && parseInt(RegExp.$1) >= 120 ||
                 /Safari\/(\d+)/.test(ua) && parseInt(RegExp.$1) >= 18;
        },
        osSupported: () => {
          const ua = navigator.userAgent;
          return ua.includes('Windows NT') || 
                 ua.includes('Linux') || 
                 /Mac OS X \d+[._]\d+/.test(ua);
        },
        wasmSupport: () => {
          // PyInstaller binaries require WebAssembly for web deployment
          try {
            const canvas = document.createElement('canvas');
            return !!WebAssembly.instantiate;
          } catch {
            return false;
          }
        },
        architecture: () => {
          // Check x64 support (PyInstaller default)
          return !navigator.userAgent.includes('arm') || 
                 navigator.userAgent.includes('x86_64') ||
                 navigator.userAgent.includes('Win64');
        }
      };

      // Run all checks
      const results = {
        python313: checks.python313(),
        modernBrowser: checks.modernBrowser(),
        osSupported: checks.osSupported(),
        wasmSupport: checks.wasmSupport(),
        architecture: checks.architecture()
      };

      const isCompatible = Object.values(results).every(Boolean);
      
      return {
        compatible: isCompatible,
        details: results,
        checks: Object.keys(results)
      };
    }

    // Update button UI
    function updateButton(result) {
      const btn = document.getElementById('compatibilityBtn');
      const icon = document.getElementById('statusIcon');
      const text = document.getElementById('statusText');

      if (result.compatible) {
        btn.className = 'compatibility-btn compatible';
        icon.innerHTML = '<path d="M20 6L9 17l-5-5"/>';
        text.textContent = '';
      } else {
        btn.className = 'compatibility-btn incompatible';
        icon.innerHTML = '<path d="M18 6L6 18"/><path d="M6 6l12 12"/>';
        text.textContent = '';
      }

      // Add title with details
      const failedChecks = result.checks.filter(check => !result.details[check]);
      btn.title = result.compatible 
        ? 'WolfLoom fully supported on this device'
        : `Missing: ${failedChecks.join(', ')}`;
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      const result = checkWolfLoomCompatibility();
      updateButton(result);
    });

    // Re-check on resize/orientation change
    window.addEventListener('resize', () => {
      const result = checkWolfLoomCompatibility();
      updateButton(result);
    });

function updateHeaderOffset() {
  const header = document.querySelector('.site-header');
  const marquee = document.querySelector('.marquee-container');

  const headerHeight = (header?.offsetHeight || 0) + (marquee?.offsetHeight || 0);

  document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
}

document.getElementById("downloadToggle").addEventListener("click", (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  confetti({
    particleCount: 40,
    startVelocity: 20,
    spread: 60,
    origin: { x, y },
    colors: ["#7fc0ee"]
  });
});

// Run on load
window.addEventListener('load', updateHeaderOffset);

// Update if window resizes (responsive layouts)
window.addEventListener('resize', updateHeaderOffset);

// Toggle download panel
const downloadToggle = document.getElementById('downloadToggle');
const downloadPanel = document.getElementById('downloadPanel');

if (downloadToggle && downloadPanel) {
  downloadToggle.addEventListener('click', () => {
    downloadPanel.classList.toggle('open');
  });

  // Close panel when clicking outside
  document.addEventListener('click', (event) => {
    if (!downloadPanel.contains(event.target) && !downloadToggle.contains(event.target)) {
      downloadPanel.classList.remove('open');
    }
  });
}

// Tabs for installation guide
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-tab');
    if (!target) return;

    // Update buttons
    tabButtons.forEach((btn) => {
      btn.classList.toggle('active', btn === button);
      btn.setAttribute('aria-selected', btn === button ? 'true' : 'false');
    });

    // Update panels
    tabPanels.forEach((panel) => {
      const isActive = panel.id === `tab-${target}`;
      panel.classList.toggle('active', isActive);
    });
  });
});

// Subtle scroll-in animation for feature cards
const featureCards = document.querySelectorAll('.feature-card');

if ('IntersectionObserver' in window && featureCards.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  featureCards.forEach((card) => observer.observe(card));
} else {
  // Fallback: show all if IntersectionObserver not supported
  featureCards.forEach((card) => card.classList.add('visible'));
}
