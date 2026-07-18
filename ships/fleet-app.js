(() => {
  const fleet = window.LIDO_FLEET || [];
  const future = window.LIDO_FUTURE_SHIPS || [];
  const grid = document.querySelector('[data-fleet-grid]');
  if (!grid) return;

  const search = document.querySelector('[data-fleet-search]');
  const classFilter = document.querySelector('[data-class-filter]');
  const scaleFilter = document.querySelector('[data-scale-filter]');
  const sort = document.querySelector('[data-fleet-sort]');
  const resultCount = document.querySelector('[data-result-count]');
  const compareTray = document.querySelector('[data-compare-tray]');
  const compareList = document.querySelector('[data-compare-list]');
  const compareButton = document.querySelector('[data-compare-open]');
  const comparePanel = document.querySelector('[data-compare-panel]');
  const compareTable = document.querySelector('[data-compare-table]');
  const compareClose = document.querySelector('[data-compare-close]');
  const futureGrid = document.querySelector('[data-future-grid]');
  const selected = new Set();

  const unique = key => [...new Set(fleet.map(item => item[key]))].sort();
  const addOptions = (select, values) => values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
  addOptions(classFilter, unique('group'));
  addOptions(scaleFilter, unique('scale'));

  const stars = value => '●'.repeat(value) + '○'.repeat(5 - value);

  function card(item) {
    const guideUrl = item.guide || `ship-guide.html?ship=${encodeURIComponent(item.id)}`;
    return `<article class="fleet-card" data-name="${item.name.toLowerCase()}">
      <div class="fleet-card-top">
        <div><span class="fleet-class">${item.group}</span><h2>${item.name}</h2><p>${item.style}</p></div>
        <label class="compare-check"><input type="checkbox" value="${item.id}" data-compare-check aria-label="Compare ${item.name}"><span>Compare</span></label>
      </div>
      <div class="fleet-metrics">
        <span><b>Energy</b>${stars(item.energy)}</span><span><b>Family</b>${stars(item.family)}</span>
        <span><b>Dining</b>${stars(item.dining)}</span><span><b>Easy layout</b>${stars(item.ease)}</span>
      </div>
      <p class="fleet-best"><strong>Best for:</strong> ${item.best}</p>
      <ul class="fleet-feature-list">${item.features.slice(0,3).map(feature => `<li>${feature}</li>`).join('')}</ul>
      <div class="fleet-overview" id="overview-${item.id}" hidden>
        <p><strong>Highlights:</strong> ${item.features.join(', ')}</p>
        <p><strong>Watch for:</strong> ${item.cautions.join(', ')}</p>
        <p><strong>Planning take:</strong> ${item.name} scores ${item.ease}/5 for easy navigation, ${item.family}/5 for family fit, ${item.dining}/5 for dining variety, and ${item.quiet}/5 for quiet options.</p>
      </div>
      <div class="fleet-card-footer"><span>Full insider guide</span><a href="${guideUrl}">Open full guide →</a></div>
    </article>`;
  }

  function filteredFleet() {
    const term = (search.value || '').trim().toLowerCase();
    let items = fleet.filter(item => {
      const haystack = [item.name,item.group,item.scale,item.style,item.best,...item.features,...item.cautions].join(' ').toLowerCase();
      return (!term || haystack.includes(term)) && (!classFilter.value || item.group === classFilter.value) && (!scaleFilter.value || item.scale === scaleFilter.value);
    });
    if (sort.value === 'name') items.sort((a,b) => a.name.localeCompare(b.name));
    if (sort.value === 'family') items.sort((a,b) => b.family - a.family || b.dining - a.dining);
    if (sort.value === 'dining') items.sort((a,b) => b.dining - a.dining || b.energy - a.energy);
    if (sort.value === 'ease') items.sort((a,b) => b.ease - a.ease || a.name.localeCompare(b.name));
    if (sort.value === 'quiet') items.sort((a,b) => b.quiet - a.quiet || a.name.localeCompare(b.name));
    return items;
  }

  function render() {
    const items = filteredFleet();
    resultCount.textContent = `${items.length} ship${items.length === 1 ? '' : 's'} — every ship now has a detailed guide`;
    grid.innerHTML = items.map(card).join('') || '<p class="empty-state">No ships match those filters. Clear a filter or try a broader search.</p>';
    grid.querySelectorAll('[data-compare-check]').forEach(input => {
      input.checked = selected.has(input.value);
      input.addEventListener('change', () => {
        if (input.checked && selected.size >= 3) {
          input.checked = false;
          alert('Compare up to three ships at a time.');
          return;
        }
        input.checked ? selected.add(input.value) : selected.delete(input.value);
        updateTray();
      });
    });
  }

  function updateTray() {
    const items = fleet.filter(item => selected.has(item.id));
    compareTray.hidden = items.length === 0;
    compareList.innerHTML = items.map(item => `<button type="button" data-remove-compare="${item.id}" aria-label="Remove ${item.name}">${item.name} ×</button>`).join('');
    compareButton.disabled = items.length < 2;
    compareButton.textContent = items.length < 2 ? 'Select one more ship' : `Compare ${items.length} ships`;
    compareList.querySelectorAll('[data-remove-compare]').forEach(button => button.addEventListener('click', () => {
      selected.delete(button.dataset.removeCompare);
      render();
      updateTray();
    }));
  }

  function openComparison() {
    const items = fleet.filter(item => selected.has(item.id));
    const rows = [
      ['Class', item => item.group],['Scale', item => item.scale],['Style', item => item.style],['Best for', item => item.best],
      ['Energy', item => stars(item.energy)],['Family fit', item => stars(item.family)],['Dining', item => stars(item.dining)],
      ['Easy layout', item => stars(item.ease)],['Quiet options', item => stars(item.quiet)],
      ['Highlights', item => item.features.join('<br>')],['Watch for', item => item.cautions.join('<br>')]
    ];
    compareTable.innerHTML = `<thead><tr><th>Category</th>${items.map(item => `<th>${item.name}</th>`).join('')}</tr></thead><tbody>${rows.map(([label,format]) => `<tr><th>${label}</th>${items.map(item => `<td>${format(item)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    comparePanel.hidden = false;
    document.body.classList.add('modal-open');
    compareClose.focus();
  }

  [search,classFilter,scaleFilter,sort].forEach(control => control.addEventListener(control === search ? 'input' : 'change', render));
  compareButton.addEventListener('click', openComparison);
  compareClose.addEventListener('click', () => { comparePanel.hidden = true; document.body.classList.remove('modal-open'); });
  comparePanel.addEventListener('click', event => { if (event.target === comparePanel) compareClose.click(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !comparePanel.hidden) compareClose.click(); });
  if (futureGrid) futureGrid.innerHTML = future.map(item => `<article class="future-card"><span>Arriving ${item.year}</span><h3>${item.name}</h3><p><strong>Expected homeport:</strong> ${item.home}</p><p>${item.note}</p></article>`).join('');
  render();
})();