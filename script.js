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

let pokemonData = [];
let potentialCounters = [];
let currentSort = { column: 'score', ascending: false };

const SCARLET_VIOLET_DEX = new Set(["Sprigatito", "Floragato", "Meowscarada", "Fuecoco", "Crocalor", "Skeledirge", "Quaxly", "Quaxwell", "Quaquaval", "Lechonk", "Oinkologne", "Tarountula", "Spidops", "Nymble", "Lokix", "Pawmi", "Pawmo", "Pawmot", "Tandemaus", "Maushold", "Fidough", "Dachsbun", "Smoliv", "Dolliv", "Arboliva", "Squawkabilly", "Nacli", "Naclstack", "Garganacl", "Charcadet", "Armarouge", "Ceruledge", "Tadbulb", "Bellibolt", "Wattrel", "Kilowattrel", "Maschiff", "Mabosstiff", "Shroodle", "Grafaiai", "Bramblin", "Brambleghast", "Toedscool", "Toedscruel", "Klawf", "Capsakid", "Scovillain", "Rellor", "Rabsca", "Flittle", "Espathra", "Tinkatink", "Tinkatuff", "Tinkaton", "Wiglett", "Wugtrio", "Bombirdier", "Finizen", "Palafin", "Varoom", "Revavroom", "Cyclizar", "Orthworm", "Glimmet", "Glimmora", "Greavard", "Houndstone", "Flamigo", "Cetoddle", "Cetitan", "Veluza", "Dondozo", "Tatsugiri", "Annihilape", "Clodsire", "Farigiraf", "Dudunsparce", "Kingambit", "Great Tusk", "Scream Tail", "Brute Bonnet", "Flutter Mane", "Slither Wing", "Sandy Shocks", "Iron Treads", "Iron Bundle", "Iron Hands", "Iron Jugulis", "Iron Moth", "Iron Thorns", "Iron Valiant", "Frigibax", "Arctibax", "Baxcalibur", "Gimmighoul", "Gholdengo", "Wo-Chien", "Chien-Pao", "Ting-Lu", "Chi-Yu", "Roaring Moon", "Koraidon", "Miraidon", "Walking Wake", "Iron Leaves"]);

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  pokemonData = POKEMON_DATA.filter(p => p && p.name && p.types);
  populateDatalist(pokemonData);
  populateTeraTypeSelect();
  document.getElementById('find-counters-btn').addEventListener('click', findTeraRaidCounters);
});

function populateDatalist(list) {
  const datalist = document.getElementById('pokemon-list');
  const options = list.map(pokemon => `<option value="${pokemon.name}"></option>`);
  datalist.innerHTML = options.join('');
}

function populateTeraTypeSelect() {
  const select = document.getElementById('tera-type-select');
  select.innerHTML = ALL_TYPES.map(type => `<option value="${type}">Tera ${type}</option>`).join('');
}

function getPokemonByName(name) {
  if (!name) return null;
  return pokemonData.find(p => p.name.toLowerCase() === name.toLowerCase());
}

// --- ANALYSIS & SORTING LOGIC ---
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
    errorMessage.textContent = 'Please enter a valid Pokémon name for the Raid Boss.';
    return;
  }

  let bossAttackerType = 'Mixed';
  if (raidBoss.baseStats.atk > raidBoss.baseStats.spa + 15) bossAttackerType = 'Physical';
  else if (raidBoss.baseStats.spa > raidBoss.baseStats.atk + 15) bossAttackerType = 'Special';

  let bossDefenderType = 'Mixed Wall';
  if (raidBoss.baseStats.def > raidBoss.baseStats.spd + 15) bossDefenderType = 'Physical Wall';
  else if (raidBoss.baseStats.spd > raidBoss.baseStats.def + 15) bossDefenderType = 'Special Wall';

  const bossOriginalTypes = raidBoss.types;
  potentialCounters = [];
  let sourceData = filterSV ? pokemonData.filter(p => SCARLET_VIOLET_DEX.has(p.name)) : pokemonData;

  sourceData.forEach(counter => {
    let score = 0;
    let offensiveReasons = [];
    let defensiveReasons = [];

    // Offensive Score
    counter.types.forEach(counterAttackType => {
      const multiplier = TYPE_CHART[counterAttackType]?.[teraType] ?? 1;
      if (multiplier === 2) {
        score += 3;
        if (!offensiveReasons.includes(`Hits ${teraType} Super-Effectively`)) offensiveReasons.push(`Hits ${teraType} Super-Effectively`);
      }
    });

    // Defensive Score
    bossOriginalTypes.forEach(bossAttackType => {
      let defensiveMultiplier = 1;
      counter.types.forEach(counterDefendType => {
        defensiveMultiplier *= (TYPE_CHART[bossAttackType]?.[counterDefendType] ?? 1);
      });

      if (defensiveMultiplier === 0) { score += 2; defensiveReasons.push(`Immune to ${bossAttackType}`); }
      else if (defensiveMultiplier <= 0.25) { score += 1.5; defensiveReasons.push(`Resists ${bossAttackType} (x0.25)`); }
      else if (defensiveMultiplier <= 0.5) { score += 1; defensiveReasons.push(`Resists ${bossAttackType} (x0.5)`); }
      else if (defensiveMultiplier >= 2) { score -= 4; }
    });

    const counterStats = counter.baseStats;
    const bossStats = raidBoss.baseStats;

    if (bossAttackerType === 'Physical' && counterStats.def > 100) {
      score += 1;
      defensiveReasons.push('High Defense');
    }
    if (bossAttackerType === 'Special' && counterStats.spd > 100) {
      score += 1;
      defensiveReasons.push('High Sp. Defense');
    }
    if (bossStats.def < bossStats.spd && counterStats.atk > counterStats.spa + 15) {
      score += 1.5;
      offensiveReasons.push('Targets weaker Defense');
    }
    if (bossStats.spd < bossStats.def && counterStats.spa > counterStats.atk + 15) {
      score += 1.5;
      offensiveReasons.push('Targets weaker Sp. Defense');
    }
    const moveList = MOVESETS_DATA[counter.name] || [];

const hasEffectiveSTAB = counter.types.some(type =>
  moveList.some(move => {
    const moveType = MOVE_TYPE_LOOKUP[move];
    const effectiveness = TYPE_CHART[moveType]?.[teraType] ?? 1;
    return moveType === type && effectiveness > 1;
  })
);

if (hasEffectiveSTAB) {
  score += 2;
  offensiveReasons.push("Has STAB move that's super effective vs Tera type");
}


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
  sortAndRenderCounters(raidBoss, bossAttackerType, bossDefenderType);
}

function sortAndRenderCounters(raidBoss, bossAttackerType, bossDefenderType) {
  const { column, ascending } = currentSort;

  potentialCounters.sort((a, b) => {
    let valA, valB;
    if (column.startsWith('stat-')) {
      const stat = column.split('-')[1];
      valA = a.pokemon.baseStats[stat];
      valB = b.pokemon.baseStats[stat];
    } else if (column === 'name') {
      valA = a.pokemon.name;
      valB = b.pokemon.name;
    } else {
      valA = a.score;
      valB = b.score;
    }

    if (typeof valA === 'string') return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    return ascending ? valA - valB : valB - valA;
  });

  renderRaidCounters(raidBoss, potentialCounters, bossAttackerType, bossDefenderType);
}

function renderRaidCounters(boss, counters, bossAttackerType, bossDefenderType) {
  const resultsOutput = document.getElementById('results-output');

  let bossInfoHTML = `
    <div class="boss-info-container">
      <h2>Raid Boss: ${boss.name}</h2>
      <div class="stats-grid">
        <span>HP: <span class="stat-value ${getStatClass(boss.baseStats.hp)}">${boss.baseStats.hp}</span></span>
        <span>Atk: <span class="stat-value ${getStatClass(boss.baseStats.atk)}">${boss.baseStats.atk}</span></span>
        <span>Def: <span class="stat-value ${getStatClass(boss.baseStats.def)}">${boss.baseStats.def}</span></span>
        <span>SpA: <span class="stat-value ${getStatClass(boss.baseStats.spa)}">${boss.baseStats.spa}</span></span>
        <span>SpD: <span class="stat-value ${getStatClass(boss.baseStats.spd)}">${boss.baseStats.spd}</span></span>
        <span>Spe: <span class="stat-value ${getStatClass(boss.baseStats.spe)}">${boss.baseStats.spe}</span></span>
      </div>
      <p class="boss-info">
        Detected as a <strong>${bossAttackerType} Attacker</strong> and a <strong>${bossDefenderType}</strong>.
      </p>
    </div>
  `;

  let tableHTML = `
    ${bossInfoHTML}
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
    tableHTML += '<tr><td colspan="11">No ideal counters found. Consider Pokémon with neutral matchups.</td></tr>';
  } else {
    counters.slice(0, 15).forEach(counter => {
      tableHTML += `
        <tr>
          <td>
            <strong>${counter.pokemon.name}</strong><br>
            ${counter.pokemon.types.map(t => `<span class="type-badge-small" style="background-color:${TYPE_COLORS[t]}">${t}</span>`).join(' ')}
          </td>
          <td>${counter.score.toFixed(1)}</td>
          <td><span class="reason">${Object.values(counter.pokemon.abilities).join(' / ')}</span></td>
          <td><span class="reason">${counter.offensiveReason || 'None'}</span></td>
          <td><span class="reason">${counter.defensiveReason || 'None'}</span></td>
          <td><span class="stat-value ${getStatClass(counter.pokemon.baseStats.hp)}">${counter.pokemon.baseStats.hp}</span></td>
          <td><span class="stat-value ${getStatClass(counter.pokemon.baseStats.atk)}">${counter.pokemon.baseStats.atk}</span></td>
          <td><span class="stat-value ${getStatClass(counter.pokemon.baseStats.def)}">${counter.pokemon.baseStats.def}</span></td>
          <td><span class="stat-value ${getStatClass(counter.pokemon.baseStats.spa)}">${counter.pokemon.baseStats.spa}</span></td>
          <td><span class="stat-value ${getStatClass(counter.pokemon.baseStats.spd)}">${counter.pokemon.baseStats.spd}</span></td>
          <td><span class="stat-value ${getStatClass(counter.pokemon.baseStats.spe)}">${counter.pokemon.baseStats.spe}</span></td>
        </tr>
      `;
    });
  }

  tableHTML += '</tbody></table></div>';
  resultsOutput.innerHTML = tableHTML;

  const tableHead = document.getElementById('raid-table-head');
  if (tableHead) {
    tableHead.addEventListener('click', event => {
      const header = event.target.closest('th');
      if (!header || !header.dataset.sort) return;

      const column = header.dataset.sort;
      if (currentSort.column === column) {
        currentSort.ascending = !currentSort.ascending;
      } else {
        currentSort.column = column;
        currentSort.ascending = column !== 'score';
      }
      sortAndRenderCounters(boss, bossAttackerType, bossDefenderType);
    });
  }
}

function getStatClass(statValue) {
  if (statValue >= 120) return 'stat-excellent';
  if (statValue >= 100) return 'stat-great';
  if (statValue >= 80) return 'stat-good';
  if (statValue >= 60) return 'stat-average';
  return 'stat-low';
}
