/* ============================================================
   Resultados oficiales en directo del Mundial 2026.
   ------------------------------------------------------------
   Este archivo arranca VACÍO: mientras no haya nada relleno,
   el ranking muestra a todo el mundo con 0 puntos.
   A medida que vayas escribiendo resultados aquí (orden final
   de un grupo, ganadores de eliminatorias, premios, etc.), la
   app recalcula automáticamente las puntuaciones de cada
   participante. Lo que dejes vacío ("" o []) sigue contando
   como "pendiente" y no resta puntos a nadie.

   Si quieres volver a partir de cero, copia el contenido de
   results-empty.js sobre este archivo.
   ------------------------------------------------------------
   Cambios importantes:
   - YA NO se predicen resultados exactos de partidos: solo el
     ORDEN en que terminan los equipos en cada grupo.
     Por eso este archivo no tiene "groupMatches".
   - "thirdPlace" es la lista de los 8 mejores terceros que
     pasan a dieciseisavos, en el orden 1º-8º.
  - "awards" tiene 6 categorías nuevas y divertidas.
   ============================================================ */

const TEAM_NAME_ES_FALLBACK = {
  'Algeria': 'Argelia',
  'Argentina': 'Argentina',
  'Australia': 'Australia',
  'Austria': 'Austria',
  'Belgium': 'Bélgica',
  'Bosnia & Herzegovina': 'Bosnia y Herzegovina',
  'Brazil': 'Brasil',
  'Canada': 'Canadá',
  'Cape Verde': 'Cabo Verde',
  'Colombia': 'Colombia',
  'Croatia': 'Croacia',
  'Curaçao': 'Curazao',
  'Czech Republic': 'República Checa',
  'DR Congo': 'RD del Congo',
  'Ecuador': 'Ecuador',
  'Egypt': 'Egipto',
  'England': 'Inglaterra',
  'France': 'Francia',
  'Germany': 'Alemania',
  'Ghana': 'Ghana',
  'Haiti': 'Haití',
  'Iran': 'Irán',
  'Iraq': 'Irak',
  'Ivory Coast': 'Costa de Marfil',
  'Japan': 'Japón',
  'Jordan': 'Jordania',
  'Mexico': 'México',
  'Morocco': 'Marruecos',
  'Netherlands': 'Países Bajos',
  'New Zealand': 'Nueva Zelanda',
  'Norway': 'Noruega',
  'Panama': 'Panamá',
  'Paraguay': 'Paraguay',
  'Portugal': 'Portugal',
  'Qatar': 'Catar',
  'Saudi Arabia': 'Arabia Saudí',
  'Scotland': 'Escocia',
  'Senegal': 'Senegal',
  'South Africa': 'Sudáfrica',
  'South Korea': 'Corea del Sur',
  'Spain': 'España',
  'Sweden': 'Suecia',
  'Switzerland': 'Suiza',
  'Tunisia': 'Túnez',
  'Turkey': 'Turquía',
  'USA': 'Estados Unidos',
  'Uruguay': 'Uruguay',
  'Uzbekistan': 'Uzbekistán'
};

function normalizeTeamName(name) {
  if (!name) return '';
  const raw = String(name).trim();
  const dynamicMap = (typeof TEAM_NAME_ES !== 'undefined' && TEAM_NAME_ES) ? TEAM_NAME_ES : null;
  return (dynamicMap && dynamicMap[raw]) || TEAM_NAME_ES_FALLBACK[raw] || raw;
}

function parseFinalScore(ft) {
  if (!ft && ft !== 0) return null;

  if (Array.isArray(ft) && ft.length >= 2) {
    const g1 = Number(ft[0]);
    const g2 = Number(ft[1]);
    return Number.isFinite(g1) && Number.isFinite(g2) ? [g1, g2] : null;
  }

  if (typeof ft === 'string') {
    const parts = ft.split(/[^0-9]+/).filter(Boolean);
    if (parts.length >= 2) {
      const g1 = Number(parts[0]);
      const g2 = Number(parts[1]);
      return Number.isFinite(g1) && Number.isFinite(g2) ? [g1, g2] : null;
    }
  }

  if (typeof ft === 'object') {
    const g1 = Number(ft.team1 ?? ft.home ?? ft[0]);
    const g2 = Number(ft.team2 ?? ft.away ?? ft[1]);
    if (Number.isFinite(g1) && Number.isFinite(g2)) return [g1, g2];
  }

  return null;
}

function getGroupLetter(groupName) {
  if (!groupName || typeof groupName !== 'string') return null;
  if (!groupName.startsWith('Group ')) return null;
  return groupName.replace('Group ', '').trim();
}

function getTeamsByGroupSeed(matches) {
  const source = globalThis.TEAMS_BY_GROUP;
  const seeded = {};

  if (source && typeof source === 'object') {
    Object.keys(source).forEach(group => {
      const teams = Array.isArray(source[group]) ? source[group] : [];
      const mapped = teams
        .map(item => (typeof item === 'string' ? item : item && item.name))
        .map(normalizeTeamName)
        .filter(Boolean);
      if (mapped.length) seeded[group] = mapped;
    });
  }

  if (Object.keys(seeded).length) return seeded;

  (matches || []).forEach(match => {
    const group = getGroupLetter(match && match.group);
    if (!group) return;
    if (!seeded[group]) seeded[group] = [];

    const t1 = normalizeTeamName(match.team1);
    const t2 = normalizeTeamName(match.team2);

    if (t1 && !seeded[group].includes(t1)) seeded[group].push(t1);
    if (t2 && !seeded[group].includes(t2)) seeded[group].push(t2);
  });

  return seeded;
}

function compareStandings(a, b) {
  return (b.points - a.points) ||
    (b.gd - a.gd) ||
    (b.gf - a.gf) ||
    (a.ga - b.ga) ||
    a.team.localeCompare(b.team, 'es');
}

function buildLiveGroupData() {
  const matches = Array.isArray(globalThis.worldCupData && globalThis.worldCupData.matches)
    ? globalThis.worldCupData.matches
    : [];

  const teamsByGroup = getTeamsByGroupSeed(matches);
  const tableByGroup = {};
  const playedByGroup = {};

  Object.keys(teamsByGroup).forEach(group => {
    tableByGroup[group] = {};
    teamsByGroup[group].forEach(team => {
      tableByGroup[group][team] = { team, points: 0, gf: 0, ga: 0, gd: 0 };
    });
  });

  matches.forEach(match => {
    const group = getGroupLetter(match && match.group);
    if (!group) return;

    const score = parseFinalScore(match && match.score && match.score.ft);
    if (!score) return;

    const team1 = normalizeTeamName(match.team1);
    const team2 = normalizeTeamName(match.team2);
    if (!team1 || !team2) return;

    if (!tableByGroup[group]) tableByGroup[group] = {};
    if (!tableByGroup[group][team1]) tableByGroup[group][team1] = { team: team1, points: 0, gf: 0, ga: 0, gd: 0 };
    if (!tableByGroup[group][team2]) tableByGroup[group][team2] = { team: team2, points: 0, gf: 0, ga: 0, gd: 0 };

    const g1 = score[0];
    const g2 = score[1];
    const s1 = tableByGroup[group][team1];
    const s2 = tableByGroup[group][team2];

    s1.gf += g1;
    s1.ga += g2;
    s2.gf += g2;
    s2.ga += g1;

    if (g1 > g2) {
      s1.points += 3;
    } else if (g2 > g1) {
      s2.points += 3;
    } else {
      s1.points += 1;
      s2.points += 1;
    }

    s1.gd = s1.gf - s1.ga;
    s2.gd = s2.gf - s2.ga;
    playedByGroup[group] = true;
  });

  const groups = {};
  const standingsByGroup = {};

  Object.keys(tableByGroup).sort().forEach(group => {
    if (!playedByGroup[group]) {
      groups[group] = [];
      standingsByGroup[group] = [];
      return;
    }

    const standings = Object.values(tableByGroup[group]).sort(compareStandings);
    standingsByGroup[group] = standings;
    groups[group] = standings.map(row => row.team);
  });

  return { groups, standingsByGroup };
}

function buildLiveThirdPlace() {
  const live = buildLiveGroupData();
  const thirds = [];

  Object.keys(live.standingsByGroup).forEach(group => {
    const standings = live.standingsByGroup[group];
    if (standings.length < 4) return;
    const third = standings[2];
    thirds.push({
      group,
      team: third.team,
      points: third.points,
      gd: third.gd,
      gf: third.gf,
      ga: third.ga
    });
  });

  thirds.sort((a, b) => compareStandings(a, b) || a.group.localeCompare(b.group));

  if (thirds.length < 8) return [];
  return thirds.slice(0, 8).map(item => item.team);
}

function uniqueTeamList(items) {
  return items.filter((team, index, array) => team && array.indexOf(team) === index);
}

const KNOCKOUT_ROUND_BY_LABEL = {
  'round of 32': 'round32',
  'round of 16': 'round16',
  'quarter-finals': 'quarterfinals',
  'quarter finals': 'quarterfinals',
  'quarterfinals': 'quarterfinals',
  'semi-finals': 'semifinals',
  'semi finals': 'semifinals',
  semifinals: 'semifinals',
  'match for third place': 'thirdPlace',
  'third-place match': 'thirdPlace',
  'third place': 'thirdPlace',
  final: 'final'
};

const KNOCKOUT_ROUND_RANGES = [
  { start: 73, end: 88, key: 'round32' },
  { start: 89, end: 96, key: 'round16' },
  { start: 97, end: 100, key: 'quarterfinals' },
  { start: 101, end: 102, key: 'semifinals' },
  { start: 103, end: 103, key: 'thirdPlace' },
  { start: 104, end: 104, key: 'final' }
];

function getKnockoutRoundKey(match) {
  const matchNum = Number(match?.num);
  if (Number.isFinite(matchNum)) {
    const range = KNOCKOUT_ROUND_RANGES.find(item => matchNum >= item.start && matchNum <= item.end);
    if (range) return range.key;
  }

  const round = String(match?.round || '').trim().toLowerCase();
  return KNOCKOUT_ROUND_BY_LABEL[round] || null;
}

function isKnockoutPlaceholderTeam(team) {
  return /^(?:[WL]\d+|[1-4][A-L])$/i.test(team);
}

function getConcreteKnockoutTeamName(name) {
  const normalized = normalizeTeamName(name);
  return normalized && !isKnockoutPlaceholderTeam(normalized) ? normalized : '';
}

function getWinnerSideFromScore(score) {
  if (!score || typeof score !== 'object') return null;

  const explicitWinner = score.winner ?? score.result ?? score.outcome;
  if (explicitWinner === 1 || explicitWinner === '1' || explicitWinner === 'team1' || explicitWinner === 'home') return 1;
  if (explicitWinner === 2 || explicitWinner === '2' || explicitWinner === 'team2' || explicitWinner === 'away') return 2;

  const decisiveFields = [
  'ft',
  'et',
  'aet',
  'ot',
  'p',
  'pso',
  'pen',
  'pens',
  'penalties',
  'pk'
];
  for (const field of decisiveFields) {
    const parsed = parseFinalScore(score[field]);
    if (!parsed) continue;
    if (parsed[0] > parsed[1]) return 1;
    if (parsed[1] > parsed[0]) return 2;
  }

  return null;
}

function getKnockoutWinner(match, team1, team2) {
  const explicitWinner = normalizeTeamName(match?.winner || match?.score?.winner);
  if (explicitWinner && (explicitWinner === team1 || explicitWinner === team2)) return explicitWinner;

  const winnerSide = getWinnerSideFromScore(match?.score);
  if (winnerSide === 1) return team1;
  if (winnerSide === 2) return team2;
  return '';
}

function buildLiveKnockoutData() {
  const matches = Array.isArray(globalThis.worldCupData?.matches)
    ? globalThis.worldCupData.matches
    : [];

  const rounds = {
    round32: [],
    round16: [],
    quarterfinals: [],
    semifinals: [],
    thirdPlace: [],
    final: []
  };

  const winners = {
    round32: [],
    round16: [],
    quarterfinals: [],
    semifinals: []
  };

  matches.forEach(match => {
    const roundKey = getKnockoutRoundKey(match);
    if (!roundKey) return;

    const team1 = getConcreteKnockoutTeamName(match.team1);
    const team2 = getConcreteKnockoutTeamName(match.team2);
    const winner = getKnockoutWinner(match, team1, team2);
    const matchNum = Number(match?.num);

    rounds[roundKey].push({
      match: Number.isFinite(matchNum) ? matchNum : match.num,
      team1,
      team2,
      winner
    });

    if (winner && winners[roundKey] && !winners[roundKey].includes(winner)) {
      winners[roundKey].push(winner);
    }
  });

  Object.values(rounds).forEach(roundMatches => {
    roundMatches.sort((a, b) => Number(a.match) - Number(b.match));
  });

  const semifinalists = uniqueTeamList(
    rounds.semifinals.some(match => match.team1 || match.team2)
      ? rounds.semifinals.flatMap(match => [match.team1, match.team2])
      : winners.quarterfinals
  );

  const finalMatch = rounds.final[0] || null;
  const finalists = finalMatch && (finalMatch.team1 || finalMatch.team2)
    ? uniqueTeamList([finalMatch.team1, finalMatch.team2])
    : [...winners.semifinals];
  const champion = finalMatch?.winner || '';
  const runnerUp = champion && finalists.length >= 2
    ? (finalists.find(team => team !== champion) || '')
    : '';

  const thirdPlaceMatch = rounds.thirdPlace[0] || null;
  const thirdPlaceWinner = thirdPlaceMatch?.winner || '';

  return {
    knockout: {
      round32: winners.round32,
      round16: winners.round16,
      quarterfinals: winners.quarterfinals,
      semifinals: winners.semifinals,
      semifinalists,
      champion,
      runnerUp,
      finalists,
      thirdPlaceWinner,
      final: champion,
      thirdPlace: thirdPlaceWinner,
      matches: rounds
    },
    semifinalists,
    finalists,
    champion,
    runnerUp,
    thirdPlaceWinner
  };
}

const STATIC_RESULTS = {
  // groups y thirdPlace son dinamicos (Proxy), pero se mantienen aqui para
  // conservar el shape del objeto esperado por el resto de la app.
  groups: {},
  thirdPlace: [],

  // Quiniela 1X2 - resultados reales de los 3 partidos fijos.
  // Las claves coinciden con [team1, team2].sort().join('__').
  quiniela1x2: { 'Corea del Sur__México': '1', 'Escocia__Marruecos': '2', 'España__Uruguay': '2' },

  knockout: {
    round32: [],
    round16: [],
    quarterfinals: [],
    semifinals: [],

    champion: '',
    runnerUp: '',
    finalists: [],

    thirdPlaceWinner: '',
    final: '',
    thirdPlace: '',

    matches: {
      round32: [
        { match: 73, team1: 'Sudáfrica', team2: 'Canadá', winner: 'Canadá' }
      ],
      round16: [],
      quarterfinals: [],
      semifinals: [],
      thirdPlace: [],
      final: []
    }
  },

  semifinalists: [],
  finalists: [],

  champion: '',
  runnerUp: '',
  thirdPlaceWinner: '',

  // 6 categorias divertidas.
  awards: {
    topScorer: 'Kylian Mbappé',
    mvpTournament: 'Rodri',
    topAssister: 'Michael Olise',
    goldenGlove: 'Unai Simón',
    topScoringTeam: 'Inglaterra',
    mostConcededTeam: 'Túnez'
  }
};

const RESULTS = new Proxy(STATIC_RESULTS, {
  get(target, prop, receiver) {
    if (prop === 'groups') return buildLiveGroupData().groups;
    if (prop === 'thirdPlace') return buildLiveThirdPlace();
    if (prop === 'knockout') return buildLiveKnockoutData().knockout;
    if (prop === 'semifinalists') return buildLiveKnockoutData().semifinalists;
    if (prop === 'finalists') return buildLiveKnockoutData().finalists;
    if (prop === 'champion') return buildLiveKnockoutData().champion;
    if (prop === 'runnerUp') return buildLiveKnockoutData().runnerUp;
    if (prop === 'thirdPlaceWinner') return buildLiveKnockoutData().thirdPlaceWinner;
    return Reflect.get(target, prop, receiver);
  }
});