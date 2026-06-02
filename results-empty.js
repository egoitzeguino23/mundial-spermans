/* ============================================================
   Plantilla VACÍA de resultados oficiales — Mundial 2026
   ------------------------------------------------------------
   Cuando empiece el torneo (o cuando quieras "publicar"
   resultados parciales), copia el contenido relevante en
   results.js. La app puntúa automáticamente cualquier campo
   que rellenes; lo que dejes vacío sigue contando como
   "pendiente" y no resta puntos.
   ------------------------------------------------------------
   Cambios importantes:
   - YA NO se predicen resultados exactos de partidos: solo el
     ORDEN en que terminan los equipos en cada grupo.
     Por eso este archivo no tiene "groupMatches".
   - "thirdPlace" es la lista de los 8 mejores terceros que
     pasan a dieciseisavos, en el orden 1º-8º.
  - "awards" tiene 6 categorías nuevas y divertidas.
   ============================================================ */

const RESULTS = {
  // Orden final de cada grupo: 1º, 2º, 3º, 4º.
  groups: {
    A: [], B: [], C: [], D: [],
    E: [], F: [], G: [], H: [],
    I: [], J: [], K: [], L: []
  },

  // Los 8 mejores terceros que clasifican a dieciseisavos,
  // en orden (1º mejor tercero → 8º mejor tercero).
  thirdPlace: [],

  // Quiniela 1X2 — resultados reales de los 3 partidos fijos.
  // Valores admitidos: "1" (gana team1), "X" (empate), "2" (gana team2).
  // Las claves coinciden con `[team1, team2].sort().join('__')` definido en
  // QUINIELA_1X2_MATCHES dentro de app.js.
  quiniela1x2: {
    "Mexico__South Korea": "",
    "Morocco__Scotland":   "",
    "Spain__Uruguay":      ""
  },

  knockout: {
    round32: [],
    round16: [],
    quarterfinals: [],
    semifinals: [],

    champion: "",
    runnerUp: "",
    finalists: [],

    thirdPlaceWinner: "",
    final: "",
    thirdPlace: "",

    matches: {
      round32: [
        // { match: 73, team1: "", team2: "", winner: "" }
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

  champion: "",
  runnerUp: "",
  thirdPlaceWinner: "",

  // 6 categorías divertidas — todas son una sola elección por categoría.
  // "topScorer", "mvpTournament", "topAssister" y "goldenGlove" esperan el NOMBRE de un jugador
  //   (de los listados en AWARD_PLAYERS dentro de app.js).
  // "topScoringTeam" y "mostConcededTeam" esperan el NOMBRE de una selección
  //   (tal y como aparece en los grupos).
  awards: {
    topScorer: "",         // 🥇 Máximo Goleador (jugador)
    mvpTournament: "",     // 🌟 MVP del Torneo (jugador)
    topAssister: "",       // 🎯 Máximo Asistente (jugador)
    goldenGlove: "",       // 🧤 Guante de Oro / Portero menos goleado (jugador)
    topScoringTeam: "",    // ⚽ Equipo Más Goleador
    mostConcededTeam: ""   // 🥅 Equipo Más Goleado (equipo que recibe más goles)
  }
};