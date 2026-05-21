const PERF_KEY = 'mjr-performance-mode'
const MODES = [
  { id: 'max', label: 'Visual máximo', note: 'Forja viva' },
  { id: 'balanced', label: 'Equilibrado', note: 'Bonito e leve' },
  { id: 'performance', label: 'Performance', note: 'Mais rápido' },
]

function applyMode(mode) {
  const safeMode = MODES.some(item => item.id === mode) ? mode : 'balanced'
  document.documentElement.dataset.performance = safeMode
  localStorage.setItem(PERF_KEY, safeMode)
}

function buildPanel() {
  const current = document.documentElement.dataset.performance || 'balanced'
  const panel = document.createElement('div')
  panel.className = 'mjr-performance-panel'
  panel.innerHTML = `
    <div class="mjr-performance-head">
      <span>Performance</span>
      <small>Background / efeitos</small>
    </div>
    <div class="mjr-performance-options">
      ${MODES.map(mode => `
        <button type="button" class="mjr-performance-option ${mode.id === current ? 'is-active' : ''}" data-performance-mode="${mode.id}">
          <strong>${mode.label}</strong>
          <small>${mode.note}</small>
        </button>
      `).join('')}
    </div>
  `

  panel.querySelectorAll('[data-performance-mode]').forEach(button => {
    button.addEventListener('click', () => {
      applyMode(button.dataset.performanceMode)
      panel.querySelectorAll('.mjr-performance-option').forEach(item => item.classList.remove('is-active'))
      button.classList.add('is-active')
    })
  })

  return panel
}

function attachPanel() {
  const menu = Array.from(document.querySelectorAll('header > div')).find(node => {
    if (node.querySelector('.mjr-performance-panel')) return false
    const rect = node.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0 && node.querySelector('a[href="#work"], a[href="#about"], a[href="#stack"]')
  })

  if (!menu) return
  menu.appendChild(buildPanel())
}

function bootPerformanceMenu() {
  applyMode(localStorage.getItem(PERF_KEY) || 'balanced')
  const observer = new MutationObserver(() => requestAnimationFrame(attachPanel))
  observer.observe(document.body, { childList: true, subtree: true })
  requestAnimationFrame(attachPanel)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootPerformanceMenu)
} else {
  bootPerformanceMenu()
}
