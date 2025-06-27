// script.js - Logic for Tera Raid Counter Finder

console.log("Tera Raid Counter Finder script loaded.");

const TYPE_CHART = {
  "Normal": {"Rock": 0.5, "Ghost": 0, "Steel": 0.5},
  "Fire": {"Fire": 0.5, "Water": 0.5, "Grass": 2, "Ice": 2, "Bug": 2, "Rock": 0.5, "Dragon": 0.5, "Steel": 2},
  "Water": {"Fire": 2, "Water": 0.5, "Grass": 0.5, "Ground": 2, "Rock": 2, "Dragon": 0.5},
  "Electric": {"Water": 2, "Electric": 0.5, "Grass": 0.5, "Ground": 0, "Flying": 2, "Dragon": 0.5},
  "Grass": {"Fire": 0.5, "Water": 2, "Grass": 0.5, "Poison": 0.5, "Ground": 2, "Flying": 0.5, "Bug": 0.5, "Rock": 2, "Dragon": 0.5, "Steel": 0.5},
  "Ice": {"Fire": 0.5, "Water": 0.5, "Grass": 2, "Ice": 0.5, "Ground": 2, "Flying": 2, "Dragon": 2, "Steel": 0.5},
  "Fighting": {"Normal": 2, "Ice": 2, "Poison": 0.5, "Flying": 0.5, "Psychic": 0.5, "Bug": 0.5, "Rock": 2, "Ghost": 0, "Dark": 2, "Steel": 2, "Fairy": 0.5},
  "Poison": {"Grass": 2, "Poison": 0.5, "Ground": 0.5, "Rock": 0.5, "Ghost": 0.5, "Steel": 0, "Fairy": 2},
  "Ground": {"Fire": 2, "Electric": 2, "Grass": 0.5, "Poison": 2, "Flying": 0, "Bug": 0.5, "Rock": 2, "Steel": 2},
  "Flying": {"Electric": 0.5, "Grass": 2, "Fighting": 2, "Bug": 2, "Rock": 0.5, "Steel": 0.5},
  "Psychic": {"Fighting": 2, "Poison": 2, "Psychic": 0.5, "Dark": 0, "Steel": 0.5},
  "Bug": {"Fire": 0.5, "Grass": 2, "Fighting": 0.5, "Poison": 0.5, "Flying": 0.5, "Psychic": 2, "Ghost": 0.5, "Dark": 2, "Steel": 0.5, "Fairy": 0.5},
  "Rock": {"Fire": 2, "Ice": 2, "Fighting": 0.5, "Ground": 0.5, "Flying": 2, "Bug": 2, "Steel": 0.5},
  "Ghost": {"Normal": 0, "Psychic": 2, "Ghost": 2, "Dark": 0.5},
  "Dragon": {"Dragon": 2, "Steel": 0.5, "Fairy": 0},
  "Dark": {"Fighting": 0.5, "Psychic": 2, "Ghost": 2, "Dark": 0.5, "Fairy": 0.5},
  "Steel": {"Fire": 0.5, "Water": 0.5, "Electric": 0.5, "Ice": 2, "Rock": 2, "Steel": 0.5, "Fairy": 2},
  "Fairy": {"Fire": 0.5, "Fighting": 2, "Poison": 0.5, "Dragon": 2, "Dark": 2, "Steel": 0.5}
};

const ALL_TYPES = Object.keys(TYPE_CHART);
const TYPE_COLORS = { "Normal": "#A8A77A", "Fire": "#EE8130", "Water": "#6390F0", "Electric": "#F7D02C", "Grass": "#7AC74C", "Ice": "#96D9D6", "Fighting": "#C22E28", "Poison": "#A33EA1", "Ground": "#E2BF65", "Flying": "#A98FF3", "Psychic": "#F95587", "Bug": "#A6B91A", "Rock": "#B6A136", "Ghost": "#735797", "Dragon": "#6F35FC", "Dark": "#705746", "Steel": "#B7B7CE", "Fairy": "#D685AD" };
const SCARLET_VIOLET_DEX = new Set(["Sprigatito", "Floragato", "Meowscarada", "Fuecoco", "Crocalor", "Skeledirge", "Quaxly", "Quaxwell", "Quaquaval", "Lechonk", "Oinkologne", "Tarountula", "Spidops", "Nymble", "Lokix", "Pawmi", "Pawmo", "Pawmot", "Tandemaus", "Maushold", "Fidough", "Dachsbun", "Smoliv", "Dolliv", "Arboliva", "Squawkabilly", "Nacli", "Naclstack", "Garganacl", "Charcadet", "Armarouge", "Ceruledge", "Tadbulb", "Bellibolt", "Wattrel", "Kilowattrel", "Maschiff", "Mabosstiff", "Shroodle", "Grafaiai", "Bramblin", "Brambleghast", "Toedscool", "Toedscruel", "Klawf", "Capsakid", "Scovillain", "Rellor", "Rabsca", "Flittle", "Espathra", "Tinkatink", "Tinkatuff", "Tinkaton", "Wiglett", "Wugtrio", "Bombirdier", "Finizen", "Palafin", "Varoom", "Revavroom", "Cyclizar", "Orthworm", "Glimmet", "Glimmora", "Greavard", "Houndstone", "Flamigo", "Cetoddle", "Cetitan", "Veluza", "Dondozo", "Tatsugiri", "Annihilape", "Clodsire", "Farigiraf", "Dudunsparce", "Kingambit", "Great Tusk", "Scream Tail", "Brute Bonnet", "Flutter Mane", "Slither Wing", "Sandy Shocks", "Iron Treads", "Iron Bundle", "Iron Hands", "Iron Jugulis", "Iron Moth", "Iron Thorns", "Iron Valiant", "Frigibax", "Arctibax", "Baxcalibur", "Gimmighoul", "Gholdengo", "Wo-Chien", "Chien-Pao", "Ting-Lu", "Chi-Yu", "Roaring Moon", "Koraidon", "Miraidon", "Walking Wake", "Iron Leaves"]);

let pokemonData = [];
let potentialCounters = [];
let currentSort = { column: 'score', ascending: false };

const TYPE_EMOJIS = {
  Normal: '🔘', Fire: '🔥', Water: '💧', Electric: '⚡', Grass: '🍃', Ice: '❄️',
  Fighting: '🥊', Poison: '☠️', Ground: '🌎', Flying: '🌬️', Psychic: '🧠',
  Bug: '🐛', Rock: '🪨', Ghost: '👻', Dragon: '🐉', Dark: '🌑', Steel: '⚙️', Fairy: '✨'
};

function getMoveBadge(move) {
  const normalized = normalizeMoveName(move);
  const type = MOVE_TYPE_LOOKUP[normalized];
  if (!type) return move;
  const capType = type.charAt(0).toUpperCase() + type.slice(1);
  const emoji = TYPE_EMOJIS[capType] || '';
  const color = TYPE_COLORS[capType] || '#ccc';
  return `<span class="type-badge-small" style="background-color:${color}" title="${capType}">${emoji} ${move}</span>`};

function getStatColorClass(value) {
  if (value >= 120) return 'stat-high';
  if (value >= 90) return 'stat-mid';
  if (value <= 50) return 'stat-low';
  return '';
}

document.addEventListener('DOMContentLoaded', () => {
  pokemonData = POKEMON_DATA.filter(p => p && p.name && p.types);
  populateDatalist(pokemonData);
  populateTeraTypeSelect();
  document.getElementById('find-counters-btn').addEventListener('click', findTeraRaidCounters);
});

function populateDatalist(list) {
  const datalist = document.getElementById('pokemon-list');
  datalist.innerHTML = list.map(p => `<option value="${p.name}"></option>`).join('');
}

function populateTeraTypeSelect() {
  const select = document.getElementById('tera-type-select');
  select.innerHTML = ALL_TYPES.map(type => `<option value="${type}">Tera ${type}</option>`).join('');
}

function getPokemonByName(name) {
  return pokemonData.find(p => p.name.toLowerCase() === name.toLowerCase());
}

function normalizeMoveName(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[.’']/g, '');
}

function getDangerousMoveMatches(counter, bossMoves) {
  const weaknesses = new Set();

  counter.pokemon.types.forEach(counterType => {
    bossMoves.forEach(moveName => {
      const normalized = normalizeMoveName(moveName);
      const moveType = MOVE_TYPE_LOOKUP[normalized];
      if (!moveType) return;

      const chart = TYPE_CHART[moveType.charAt(0).toUpperCase() + moveType.slice(1)];
      if (chart && chart[counterType] > 1) {
        weaknesses.add(moveType);
      }
    });
  });

  return weaknesses.size > 0 ? Array.from(weaknesses) : null;
}

function findTeraRaidCounters() {
  const errorMessage = document.getElementById('error-message');
  const resultsOutput = document.getElementById('results-output');
  errorMessage.textContent = '';
  resultsOutput.innerHTML = '';

  const bossName = document.getElementById('raid-boss-name').value;
  const teraType = document.getElementById('tera-type-select').value;
  const filterSV = document.getElementById('filter-sv').checked;

  const raidBoss = getPokemonByName(bossName);
  if (!raidBoss) {
    errorMessage.textContent = 'Please enter a valid Raid Boss name.';
    return;
  }

  const bossAttackerType = raidBoss.baseStats.atk > raidBoss.baseStats.spa + 15 ? 'Physical' :
                           raidBoss.baseStats.spa > raidBoss.baseStats.atk + 15 ? 'Special' : 'Mixed';
  const bossDefenderType = raidBoss.baseStats.def > raidBoss.baseStats.spd + 15 ? 'Physical Wall' :
                            raidBoss.baseStats.spd > raidBoss.baseStats.def + 15 ? 'Special Wall' : 'Mixed Wall';

  const bossOriginalTypes = raidBoss.types;
  potentialCounters = [];
  const sourceData = filterSV ? pokemonData.filter(p => SCARLET_VIOLET_DEX.has(p.name)) : pokemonData;

  sourceData.forEach(counter => {
    let score = 0;
    const offensiveReasons = [];
    const defensiveReasons = [];

    counter.types.forEach(counterAttackType => {
      const multiplier = TYPE_CHART[counterAttackType]?.[teraType] ?? 1;
      if (multiplier === 2) {
        score += 3;
        offensiveReasons.push(`Hits ${teraType} super-effectively`);
      }
    });

    bossOriginalTypes.forEach(bossAttackType => {
      let multiplier = 1;
      counter.types.forEach(counterDefType => {
        multiplier *= TYPE_CHART[bossAttackType]?.[counterDefType] ?? 1;
      });

      if (multiplier === 0) { score += 2; defensiveReasons.push(`Immune to ${bossAttackType}`); }
      else if (multiplier <= 0.25) { score += 1.5; defensiveReasons.push(`Resists ${bossAttackType} (x0.25)`); }
      else if (multiplier <= 0.5) { score += 1; defensiveReasons.push(`Resists ${bossAttackType} (x0.5)`); }
      else if (multiplier >= 2) { score -= 4; }
    });

    const counterStats = counter.baseStats;
    const bossStats = raidBoss.baseStats;
    if (bossAttackerType === 'Physical' && counterStats.def > 100) score += 1;
    if (bossAttackerType === 'Special' && counterStats.spd > 100) score += 1;
    if (bossStats.def < bossStats.spd && counterStats.atk > counterStats.spa + 15) score += 1.5;
    if (bossStats.spd < bossStats.def && counterStats.spa > counterStats.atk + 15) score += 1.5;

    if (score > 2) {
      potentialCounters.push({
        pokemon: counter,
        score,
        offensiveReason: offensiveReasons.join(', '),
        defensiveReason: defensiveReasons.join(', ')
      });
    }
  });

 currentSort = { column: 'score', ascending: false };
renderRaidCounters(raidBoss, potentialCounters, bossAttackerType, bossDefenderType);
console.log("🔎 Boss name:", raidBoss.name);
console.log("📦 Boss data from RAID_BOSS_DATA:", RAID_BOSS_DATA[raidBoss.name]);
}

currentSort = { column: 'score', ascending: false };
renderRaidCounters(raidBoss, potentialCounters, bossAttackerType, bossDefenderType);
console.log("🔎 Boss name:", raidBoss.name);
console.log("📦 Boss data from RAID_BOSS_DATA:", RAID_BOSS_DATA[raidBoss.name]);
}

function renderRaidCounters(raidBoss, counters, bossAttackerType, bossDefenderType) {
  const resultsOutput = document.getElementById('results-output');
  const bossRaidInfo = RAID_BOSS_DATA[raidBoss.name];
  const bossMoves = bossRaidInfo ? [...(bossRaidInfo.base_moves || []), ...(bossRaidInfo.additional_moves || [])] : [];

  // Sort counters based on currentSort setting
  if (currentSort.column === 'score') {
    counters.sort((a, b) => currentSort.ascending ? a.score - b.score : b.score - a.score);
  }

  const moveSummary = bossRaidInfo && (
    bossRaidInfo.base_moves.length || bossRaidInfo.additional_moves.length || bossRaidInfo.actions.length
  ) ? `
    <details class="moveset-details">
      <summary><strong>📜 Known Raid Moves</strong></summary>
      <div class="move-section">
        ${bossRaidInfo.base_moves.length ? `<p><strong>Base:</strong> ${bossRaidInfo.base_moves.map(getMoveBadge).join(' ')}</p>` : ''}
        ${bossRaidInfo.additional_moves.length ? `<p><strong>Additional:</strong> ${bossRaidInfo.additional_moves.map(getMoveBadge).join(' ')}</p>` : ''}
        ${bossRaidInfo.actions.length ? `<p><strong>Actions:</strong><br>${bossRaidInfo.actions.map(a => `• ${a}`).join('<br>')}</p>` : ''}
      </div>
    </details>
  ` : '';

  const bossInfoHTML = `
    <div class="boss-info-container">
      <h2>Raid Boss: ${raidBoss.name}</h2>
      <div class="stats-grid">
        ${Object.entries(raidBoss.baseStats).map(([stat, val]) => {
          return `<span>${stat.toUpperCase()}: <span class="stat-value">${val}</span></span>`;
        }).join('')}
      </div>
      <p class="boss-info">
        Detected as a <strong>${bossAttackerType} Attacker</strong> and a <strong>${bossDefenderType}</strong>.
      </p>
      ${moveSummary}
    </div>`;

  let tableHTML = `
    <h2>Top Recommended Counters</h2>
    <div class="pokedex-table-container">
      <table class="pokedex-table">
        <thead id="raid-table-head">
          <tr>
            <th data-sort="name">Name</th>
            <th data-sort="score">Score</th>
            <th>Abilities</th>
            <th>Offensive Advantage</th>
            <th>Defensive Advantage</th>
            <th>Matchup Alert</th>
            <th data-sort="stat-hp">HP</th>
            <th data-sort="stat-atk">Atk</th>
            <th data-sort="stat-def">Def</th>
            <th data-sort="stat-spa">SpA</th>
            <th data-sort="stat-spd">SpD</th>
            <th data-sort="stat-spe">Spe</th>
          </tr>
        </thead>
        <tbody>
  `;

  if (counters.length === 0) {
    tableHTML += '<tr><td colspan="12">No ideal counters found. Consider Pokémon with neutral matchups.</td></tr>';
  } else {
    counters.slice(0, 15).forEach(counter => {
      const riskyMoves = bossMoves.length > 0 ? getDangerousMoveMatches(counter, bossMoves) : null;

      tableHTML += `
        <tr>
          <td><strong>${counter.pokemon.name}</strong><br>
            ${counter.pokemon.types.map(t => `<span class="type-badge-small" style="background-color:${TYPE_COLORS[t]}">${t}</span>`).join(' ')}</td>
          <td>${counter.score.toFixed(1)}</td>
          <td><span class="reason">${Object.values(counter.pokemon.abilities).join(' / ')}</span></td>
          <td><span class="reason">${counter.offensiveReason || 'None'}</span></td>
          <td><span class="reason">${counter.defensiveReason || 'None'}</span></td>
          <td><span class="matchup-warning">${riskyMoves ? `⚠️ Weak to ${riskyMoves.join(', ')}` : '—'}</span></td>
          <td><span class="stat-value ${getStatColorClass(counter.pokemon.baseStats.hp)}">${counter.pokemon.baseStats.hp}</span></td>
          <td><span class="stat-value ${getStatColorClass(counter.pokemon.baseStats.atk)}">${counter.pokemon.baseStats.atk}</span></td>
          <td><span class="stat-value ${getStatColorClass(counter.pokemon.baseStats.def)}">${counter.pokemon.baseStats.def}</span></td>
          <td><span class="stat-value ${getStatColorClass(counter.pokemon.baseStats.spa)}">${counter.pokemon.baseStats.spa}</span></td>
          <td><span class="stat-value ${getStatColorClass(counter.pokemon.baseStats.spd)}">${counter.pokemon.baseStats.spd}</span></td>
          <td><span class="stat-value ${getStatColorClass(counter.pokemon.baseStats.spe)}">${counter.pokemon.baseStats.spe}</span></td>
        </tr>
      `;
    });
  }

  tableHTML += '</tbody></table></div>';
  resultsOutput.innerHTML = bossInfoHTML + tableHTML;
} 
