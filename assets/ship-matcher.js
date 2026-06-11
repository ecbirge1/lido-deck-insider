(() => {
  const root = document.getElementById('ship-matcher');
  const fleet = window.LIDO_FLEET || [];
  if (!root || !fleet.length) return;

  const style = document.createElement('style');
  style.textContent = `.matcher-shell{padding:30px 0 80px}.matcher-panel{background:#fff;border:1px solid #d9e3e5;border-radius:24px;padding:28px;box-shadow:0 18px 45px rgba(5,43,62,.08)}.matcher-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.matcher-field label{display:block;font-size:12px;font-weight:800;margin-bottom:7px}.matcher-field select{width:100%;padding:13px 14px;border:1px solid #cbd8dc;border-radius:13px;background:#fff;font:inherit}.matcher-actions{margin-top:24px;display:flex;gap:12px;flex-wrap:wrap}.matcher-results{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:30px}.match-card{background:#fff;border:1px solid #d9e3e5;border-radius:20px;padding:22px}.match-card .rank{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#ff6b4a;font-weight:800}.match-card h2{font:700 28px/1.05 'Fraunces',serif;margin:7px 0}.match-card .score{font-weight:800;color:#0b7a75;margin:8px 0}.match-card ul{padding-left:18px}.match-card li{margin:6px 0;color:#4d626c}.match-card a{display:inline-block;margin-top:10px;font-weight:800;color:#0b7a75}.matcher-note{font-size:13px;color:#5f6f79;margin-top:18px}@media(max-width:800px){.matcher-results{grid-template-columns:1fr}.matcher-grid{grid-template-columns:1fr}}@media(max-width:620px){.matcher-panel{padding:20px}.matcher-actions .button{width:100%}}`;
  document.head.appendChild(style);

  root.innerHTML = `<section class="matcher-shell"><div class="matcher-panel">
    <div class="matcher-grid">
      <div class="matcher-field"><label for="priority">Top vacation priority</label><select id="priority"><option value="family">Family attractions</option><option value="dining">Dining variety</option><option value="quiet">Quiet relaxation</option><option value="energy">Nightlife and energy</option><option value="ease">Easy navigation</option></select></div>
      <div class="matcher-field"><label for="size">Preferred ship size</label><select id="size"><option value="any">No preference</option><option value="Mega ship">Mega ship</option><option value="Large ship">Large ship</option><option value="Mid-large ship">Mid-large ship</option><option value="Mid-size ship">Mid-size ship</option><option value="Classic compact ship">Classic compact ship</option></select></div>
      <div class="matcher-field"><label for="group">Travel group</label><select id="group"><option value="family">Family with children</option><option value="couple">Couple</option><option value="friends">Adult friends</option><option value="multi">Multigenerational group</option></select></div>
      <div class="matcher-field"><label for="planning">Planning tolerance</label><select id="planning"><option value="low">I want simple and easy</option><option value="medium">Some planning is fine</option><option value="high">I enjoy large ships and planning</option></select></div>
    </div>
    <div class="matcher-actions"><button class="button button-primary" type="button" id="run-match">Find my ships</button><a class="button button-ghost" href="ships/fleet.html">Browse the full fleet</a></div>
    <p class="matcher-note">Recommendations are editorial guidance, not official cruise-line rankings.</p>
  </div><div class="matcher-results" id="matcher-results"></div></section>`;

  const scoreShip = (ship, answers) => {
    let score = 0;
    const reasons = [];
    score += ship[answers.priority] * 4;
    if (ship[answers.priority] >= 4) reasons.push(`Strong ${answers.priority === 'ease' ? 'navigation' : answers.priority} fit`);
    if (answers.size !== 'any' && ship.scale === answers.size) { score += 8; reasons.push(`Matches your preferred ship size`); }
    if (answers.group === 'family') { score += ship.family * 3; if (ship.family >= 4) reasons.push('Strong family fit'); }
    if (answers.group === 'couple') { score += ship.quiet * 2 + ship.dining * 2; if (ship.quiet >= 4) reasons.push('Good quiet-space options'); }
    if (answers.group === 'friends') { score += ship.energy * 3 + ship.dining; if (ship.energy >= 4) reasons.push('Strong social and nightlife energy'); }
    if (answers.group === 'multi') { score += ship.family * 2 + ship.dining * 2 + ship.ease; if (ship.dining >= 4) reasons.push('Broad dining variety for mixed tastes'); }
    if (answers.planning === 'low') { score += ship.ease * 4; if (ship.ease >= 4) reasons.push('Easier layout and lower learning curve'); }
    if (answers.planning === 'medium') score += ship.ease * 2 + ship.dining;
    if (answers.planning === 'high') { score += ship.energy * 2 + ship.dining * 2; if (ship.scale === 'Mega ship') reasons.push('Rewards advance planning'); }
    return { ship, score, reasons: [...new Set(reasons)].slice(0,4) };
  };

  const results = document.getElementById('matcher-results');
  document.getElementById('run-match').addEventListener('click', () => {
    const answers = {
      priority: document.getElementById('priority').value,
      size: document.getElementById('size').value,
      group: document.getElementById('group').value,
      planning: document.getElementById('planning').value
    };
    const matches = fleet.map(ship => scoreShip(ship, answers)).sort((a,b) => b.score - a.score).slice(0,3);
    results.innerHTML = matches.map((match,index) => {
      const link = match.ship.guide ? `ships/${match.ship.guide}` : `ships/fleet.html`;
      return `<article class="match-card"><span class="rank">#${index+1} match</span><h2>${match.ship.name}</h2><p class="score">Fit score: ${match.score}</p><ul>${match.reasons.map(reason => `<li>${reason}</li>`).join('')}</ul><a href="${link}">${match.ship.guide ? 'Open full guide' : 'View in fleet directory'} →</a></article>`;
    }).join('');
    results.scrollIntoView({behavior:'smooth',block:'start'});
  });
})();