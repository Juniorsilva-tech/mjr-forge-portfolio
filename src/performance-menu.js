const PERF_KEY = 'mjr-performance-mode'
const MODES = [
  { id: 'max', label: 'Alto FX', note: 'Forja viva' },
  { id: 'balanced', label: 'Médio FX', note: 'Bonito e leve' },
  { id: 'performance', label: 'Baixo FX', note: 'Mais rápido' },
]

function injectStyles() {
  if (document.getElementById('mjr-performance-styles')) return
  const style = document.createElement('style')
  style.id = 'mjr-performance-styles'
  style.textContent = `
    .mjr-performance-panel{display:block;width:100%;margin-top:.85rem;border:1px solid rgba(255,255,255,.1);border-radius:1.25rem;background:rgba(255,255,255,.035);padding:.8rem;box-sizing:border-box;clear:both;overflow:hidden}
    .mjr-performance-head{display:block;color:#f6efe8;font-size:.72rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
    .mjr-performance-head small{display:block;margin-top:.25rem;color:#a89d92;font-size:.64rem;font-weight:700;letter-spacing:.08em;text-transform:none}
    .mjr-performance-options{display:grid;grid-template-columns:1fr;gap:.55rem;margin-top:.75rem;width:100%}
    .mjr-performance-option{display:flex;align-items:center;justify-content:space-between;gap:.8rem;width:100%;border:1px solid rgba(255,255,255,.09);border-radius:1rem;background:rgba(0,0,0,.24);color:#f6efe8;padding:.82rem .9rem;text-align:left;box-sizing:border-box}
    .mjr-performance-option strong{font-size:.86rem}.mjr-performance-option small{color:#a89d92;font-size:.7rem;white-space:nowrap}
    .mjr-performance-option.is-active{border-color:rgba(232,132,46,.62);background:rgba(232,132,46,.13);box-shadow:0 0 34px rgba(232,132,46,.08)}
    @media (min-width:768px){.mjr-performance-panel{display:none!important}}
    html[data-performance='balanced'] main:before,html[data-performance='balanced'] main:after{opacity:.72!important;animation-duration:16s!important}
    html[data-performance='balanced'] main section:before{opacity:.28!important;animation-duration:13s!important}
    html[data-performance='balanced'] main section:after{opacity:.14!important;animation-duration:12s!important}
    html[data-performance='performance'] main,html[data-performance='performance'] main:before,html[data-performance='performance'] main:after,html[data-performance='performance'] main section:before,html[data-performance='performance'] main section:after{animation:none!important}
    html[data-performance='performance'] main:before{opacity:.25!important}html[data-performance='performance'] main:after{opacity:.34!important}
    html[data-performance='performance'] main section:before,html[data-performance='performance'] main section:after{opacity:.08!important}
  `
  document.head.appendChild(style)
}

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
    <div class="mjr-performance-head"><span>Performance FX</span><small>Controle do background e efeitos</small></div>
    <div class="mjr-performance-options">
      ${MODES.map(mode => `
        <button type="button" class="mjr-performance-option ${mode.id === current ? 'is-active' : ''}" data-performance-mode="${mode.id}">
          <strong>${mode.label}</strong><small>${mode.note}</small>
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

function findMobileDropdown() {
  const header = document.querySelector('header')
  if (!header) return null

  const candidates = Array.from(header.children).filter(node => {
    if (!(node instanceof HTMLElement)) return false
    if (node.querySelector('.mjr-performance-panel')) return false
    const links = node.querySelectorAll('a[href="#work"], a[href="#about"], a[href="#stack"], a[href="#contact"]')
    const isDropdown = links.length >= 3 && node.className.includes('mb-4')
    const rect = node.getBoundingClientRect()
    return isDropdown && rect.width > 0 && rect.height > 0
  })

  return candidates[0] || null
}

function attachPanel() {
  if (window.innerWidth >= 768) return
  const menu = findMobileDropdown()
  if (!menu) return
  menu.appendChild(buildPanel())
}

function bootPerformanceMenu() {
  injectStyles()
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
