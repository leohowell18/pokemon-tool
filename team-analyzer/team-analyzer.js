// --- DATA AND CONFIGURATION ---

// The POKEMON_DATA constant is now loaded from the 'pokedex-data.js' file.

const TYPE_CHART = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: {
    Fire: 0.5,
    Water: 0.5,
    Grass: 2,
    Ice: 2,
    Bug: 2,
    Rock: 0.5,
    Dragon: 0.5,
    Steel: 2,
  },
  Water: {
    Fire: 2,
    Water: 0.5,
    Grass: 0.5,
    Ground: 2,
    Rock: 2,
    Dragon: 0.5,
  },
  Electric: {
    Water: 2,
    Electric: 0.5,
    Grass: 0.5,
    Ground: 0,
    Flying: 2,
    Dragon: 0.5,
  },
  Grass: {
    Fire: 0.5,
    Water: 2,
    Grass: 0.5,
    Poison: 0.5,
    Ground: 2,
    Flying: 0.5,
    Bug: 0.5,
    Rock: 2,
    Dragon: 0.5,
    Steel: 0.5,
  },
  Ice: {
    Fire: 0.5,
    Water: 0.5,
    Grass: 2,
    Ice: 0.5,
    Ground: 2,
    Flying: 2,
    Dragon: 2,
    Steel: 0.5,
  },
  Fighting: {
    Normal: 2,
    Ice: 2,
    Poison: 0.5,
    Flying: 0.5,
    Psychic: 0.5,
    Bug: 0.5,
    Rock: 2,
    Ghost: 0,
    Dark: 2,
    Steel: 2,
    Fairy: 0.5,
  },
  Poison: {
    Grass: 2,
    Poison: 0.5,
    Ground: 0.5,
    Rock: 0.5,
    Ghost: 0.5,
    Steel: 0,
    Fairy: 2,
  },
  Ground: {
    Fire: 2,
    Electric: 2,
    Grass: 0.5,
    Poison: 2,
    Flying: 0,
    Bug: 0.5,
    Rock: 2,
    Steel: 2,
  },
  Flying: {
    Electric: 0.5,
    Grass: 2,
    Fighting: 2,
    Bug: 2,
    Rock: 0.5,
    Steel: 0.5,
  },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: {
    Fire: 0.5,
    Grass: 2,
    Fighting: 0.5,
    Poison: 0.5,
    Flying: 0.5,
    Psychic: 2,
    Ghost: 0.5,
    Dark: 2,
    Steel: 0.5,
    Fairy: 0.5,
  },
  Rock: {
    Fire: 2,
    Ice: 2,
    Fighting: 0.5,
    Ground: 0.5,
    Flying: 2,
    Bug: 2,
    Steel: 0.5,
  },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel: {
    Fire: 0.5,
    Water: 0.5,
    Electric: 0.5,
    Ice: 2,
    Rock: 2,
    Steel: 0.5,
    Fairy: 2,
  },
  Fairy: {
    Fire: 0.5,
    Fighting: 2,
    Poison: 0.5,
    Dragon: 2,
    Dark: 2,
    Steel: 0.5,
  },
};
const ALL_TYPES = Object.keys(TYPE_CHART);
const TYPE_COLORS = {
  Normal: "#A8A77A",
  Fire: "#EE8130",
  Water: "#6390F0",
  Electric: "#F7D02C",
  Grass: "#7AC74C",
  Ice: "#96D9D6",
  Fighting: "#C22E28",
  Poison: "#A33EA1",
  Ground: "#E2BF65",
  Flying: "#A98FF3",
  Psychic: "#F95587",
  Bug: "#A6B91A",
  Rock: "#B6A136",
  Ghost: "#735797",
  Dragon: "#6F35FC",
  Dark: "#705746",
  Steel: "#B7B7CE",
  Fairy: "#D685AD",
};
let pokemonData = [];

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  pokemonData = POKEMON_DATA.filter((p) => p && p.name && p.types);
  setupTeamInputs();
  populateDatalist(pokemonData);
  document.getElementById("analyze-btn").addEventListener("click", analyzeTeam);
});

function setupTeamInputs() {
  const grid = document.getElementById("team-input-grid");
  for (let i = 1; i <= 6; i++) {
    const slot = document.createElement("div");
    slot.className = "team-slot";
    slot.innerHTML = `<input type="text" id="pokemon-${i}" list="pokemon-list" placeholder="Pokémon ${i} (start typing)">`;
    grid.appendChild(slot);
  }
}

function populateDatalist(list) {
  const datalist = document.getElementById("pokemon-list");
  const options = list.map(
    (pokemon) => `<option value="${pokemon.name}"></option>`
  );
  datalist.innerHTML = options.join("");
}

// --- ANALYSIS LOGIC ---
function getPokemonByName(name) {
  if (!name) return null;
  return pokemonData.find((p) => p.name.toLowerCase() === name.toLowerCase());
}

function getStatClass(statValue) {
  if (statValue >= 120) return "stat-excellent";
  if (statValue >= 100) return "stat-great";
  if (statValue >= 80) return "stat-good";
  if (statValue >= 60) return "stat-average";
  return "stat-low";
}

function calculateDefensiveProfile(types) {
  const profile = { weaknesses: [], resistances: [], immunities: [] };
  if (!types || types.length === 0) return profile;

  ALL_TYPES.forEach((attackingType) => {
    let multiplier = 1;
    types.forEach((defendingType) => {
      multiplier *= TYPE_CHART[attackingType]?.[defendingType] ?? 1;
    });

    if (multiplier >= 2)
      profile.weaknesses.push({ type: attackingType, multiplier });
    else if (multiplier > 0 && multiplier < 1)
      profile.resistances.push({ type: attackingType, multiplier });
    else if (multiplier === 0) profile.immunities.push({ type: attackingType });
  });
  return profile;
}

function calculateOffensiveProfile(attackingType) {
  const profile = { super: [], not_very: [], immune: [] };
  const attackChart = TYPE_CHART[attackingType] || {};

  ALL_TYPES.forEach((defendingType) => {
    const multiplier = attackChart[defendingType] ?? 1;
    if (multiplier === 2) profile.super.push(defendingType);
    else if (multiplier === 0.5) profile.not_very.push(defendingType);
    else if (multiplier === 0) profile.immune.push(defendingType);
  });
  return profile;
}

function analyzeTeam() {
  const team = [];
  for (let i = 1; i <= 6; i++) {
    const input = document.getElementById(`pokemon-${i}`);
    const pokemon = getPokemonByName(input.value);
    if (pokemon) {
      team.push(pokemon);
    }
  }

  const output = document.getElementById("results-output");
  if (team.length === 0) {
    output.innerHTML = `<p style="text-align:center;">Please enter at least one valid Pokémon to analyze.</p>`;
    return;
  }
  renderResults(team);
}

// --- RENDERING RESULTS ---
function renderResults(team) {
  const output = document.getElementById("results-output");
  output.innerHTML = ""; // Clear previous results

  // 1. Team-wide defensive analysis
  const teamWeaknessCounts = {};
  const teamResistanceCounts = {};
  ALL_TYPES.forEach((t) => {
    teamWeaknessCounts[t] = 0;
    teamResistanceCounts[t] = 0;
  });

  team.forEach((pokemon) => {
    const profile = calculateDefensiveProfile(pokemon.types);
    profile.weaknesses.forEach((w) => teamWeaknessCounts[w.type]++);
    profile.resistances.forEach((r) => teamResistanceCounts[r.type]++);
    profile.immunities.forEach((i) => teamResistanceCounts[i.type]++);
  });

  let teamSummaryHTML = `
        <h2>Team-Wide Defensive Analysis</h2>
        <div id="team-summary">
            <div class="summary-column">
                <h3>Common Weaknesses (2+ members)</h3>
                <ul class="matchup-list">${generateSummaryList(
                  teamWeaknessCounts,
                  "weak"
                )}</ul>
            </div>
            <div class="summary-column">
                <h3>Common Resistances (3+ members)</h3>
                <ul class="matchup-list">${generateSummaryList(
                  teamResistanceCounts,
                  "resist"
                )}</ul>
            </div>
        </div>
    `;
  output.innerHTML += teamSummaryHTML;

  // 2. Individual analysis
  let individualResultsHTML =
    '<h2>Individual Pokémon Analysis</h2><div id="individual-results">';
  team.forEach((pokemon) => {
    const defensiveProfile = calculateDefensiveProfile(pokemon.types);

    individualResultsHTML += `
            <div class="pokemon-card">
                <h3>${pokemon.name}</h3>
                <p>${pokemon.types
                  .map(
                    (t) =>
                      `<span class="type-badge" style="background-color:${TYPE_COLORS[t]}">${t}</span>`
                  )
                  .join(" ")}</p>
                
                <p class="abilities-list"><strong>Abilities:</strong> ${Object.values(
                  pokemon.abilities
                ).join(" / ")}</p>

                <h4>Base Stats</h4>
                <div class="stats-grid">
                    <span>HP: <span class="stat-value ${getStatClass(
                      pokemon.baseStats.hp
                    )}">${pokemon.baseStats.hp}</span></span>
                    <span>Atk: <span class="stat-value ${getStatClass(
                      pokemon.baseStats.atk
                    )}">${pokemon.baseStats.atk}</span></span>
                    <span>Def: <span class="stat-value ${getStatClass(
                      pokemon.baseStats.def
                    )}">${pokemon.baseStats.def}</span></span>
                    <span>SpA: <span class="stat-value ${getStatClass(
                      pokemon.baseStats.spa
                    )}">${pokemon.baseStats.spa}</span></span>
                    <span>SpD: <span class="stat-value ${getStatClass(
                      pokemon.baseStats.spd
                    )}">${pokemon.baseStats.spd}</span></span>
                    <span>Spe: <span class="stat-value ${getStatClass(
                      pokemon.baseStats.spe
                    )}">${pokemon.baseStats.spe}</span></span>
                </div>
                
                <h4>Defensive Matchups</h4>
                <ul class="matchup-list">
                    ${defensiveProfile.weaknesses
                      .sort((a, b) => b.multiplier - a.multiplier)
                      .map(
                        (w) =>
                          `<li class="weak-${
                            w.multiplier === 4 ? "4x" : "2x"
                          }">${w.type} (x${w.multiplier})</li>`
                      )
                      .join("")}
                    ${defensiveProfile.resistances
                      .sort((a, b) => a.multiplier - b.multiplier)
                      .map(
                        (r) =>
                          `<li class="resist-${
                            r.multiplier === 0.25 ? "25x" : "50x"
                          }">${r.type} (x${r.multiplier})</li>`
                      )
                      .join("")}
                    ${defensiveProfile.immunities
                      .map((i) => `<li class="immune-0x">${i.type} (x0)</li>`)
                      .join("")}
                </ul>

                <h4>Offensive Matchups (STAB)</h4>
                ${pokemon.types
                  .map((type) => {
                    const offensiveProfile = calculateOffensiveProfile(type);
                    return `
                    <div class="offensive-matchup-group">
                        <strong>${type} Attacks Hit...</strong>
                        <p>Super Effectively (2x): ${
                          offensiveProfile.super.length > 0
                            ? offensiveProfile.super
                                .map(
                                  (t) =>
                                    `<span class="type-badge-small super-effective">${t}</span>`
                                )
                                .join(" ")
                            : "None"
                        }</p>
                        <p>Not Very Effectively (0.5x): ${
                          offensiveProfile.not_very.length > 0
                            ? offensiveProfile.not_very
                                .map(
                                  (t) =>
                                    `<span class="type-badge-small not-very-effective">${t}</span>`
                                )
                                .join(" ")
                            : "None"
                        }</p>
                        <p>Ineffectively (0x): ${
                          offensiveProfile.immune.length > 0
                            ? offensiveProfile.immune
                                .map(
                                  (t) =>
                                    `<span class="type-badge-small immune">${t}</span>`
                                )
                                .join(" ")
                            : "None"
                        }</p>
                    </div>
                    `;
                  })
                  .join("")}
            </div>
        `;
  });
  individualResultsHTML += "</div>";
  output.innerHTML += individualResultsHTML;
}

function generateSummaryList(counts, mode) {
  const threshold = mode === "weak" ? 2 : 3;
  const filtered = Object.entries(counts)
    .filter(([, count]) => count >= threshold)
    .sort(([, countA], [, countB]) => countB - countA);

  if (filtered.length === 0) {
    return `<li>None</li>`;
  }

  return filtered
    .map(([type, count]) => {
      const className = mode === "weak" ? "weak-2x" : "resist-50x";
      return `<li class="${className}">${type} (${count} members)</li>`;
    })
    .join("");
}
