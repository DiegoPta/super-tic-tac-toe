/**
 * @fileoverview Lógica del juego Super Tic Tac Toe.
 *
 * Implementa un tablero 3×3 con la regla de piezas limitadas: cada jugador
 * puede tener como máximo MAX_PIECES piezas en el tablero simultáneamente.
 * Al colocar una pieza de más, la más antigua se elimina automáticamente.
 *
 * El código se envuelve en una IIFE para mantener todas las variables
 * fuera del scope global sin requerir type="module" (que bloquea la carga
 * en navegadores cuando el archivo se abre con file://).
 */

(() => {
  const MAX_PIECES = 3;
  const BOARD_SIZE  = 600; // dimensión del tablero en px (coincide con bg.png)

  // DOM references — se cachean al inicio para evitar búsquedas repetidas
  const startScreen   = document.getElementById('start-screen');
  const gameScreen    = document.getElementById('game-screen');
  const boardEl       = document.getElementById('board');
  const turnIndicator = document.getElementById('turn-indicator');
  const resultOverlay = document.getElementById('result-overlay');
  const winnerText    = document.getElementById('winner-text');

  // Game state
  let board, xMoves, oMoves, turn, winner;

  /*
   * Generación de celdas — se crean en JS en lugar de hardcodearlas en HTML
   * para mantener el markup limpio y centralizar la lógica de interacción.
   * insertBefore(cell, resultOverlay) garantiza que el overlay quede siempre
   * como último hijo del board, por encima de las celdas en el z-order.
   */
  const cells = Array.from({ length: 9 }, (_, i) => {
    const row  = Math.floor(i / 3);
    const col  = i % 3;
    const cell = document.createElement('div');
    cell.className    = 'cell';
    cell.dataset.row  = row;
    cell.dataset.col  = col;
    cell.addEventListener('click', () => onCellClick(row, col));
    boardEl.insertBefore(cell, resultOverlay);
    return cell;
  });

  /**
   * Devuelve el elemento DOM de la celda en la posición indicada.
   *
   * @param {number} row - Fila (0–2).
   * @param {number} col - Columna (0–2).
   * @returns {HTMLElement} El div de la celda.
   */
  function getCell(row, col) {
    return cells[row * 3 + col];
  }

  /**
   * Determina si hay un ganador en el estado actual del tablero.
   *
   * @returns {string|null} `"X"` u `"O"` si hay ganador, `null` si el juego continúa.
   */
  function checkWinner() {
    for (let r = 0; r < 3; r++) {
      if (board[r][0] && board[r][0] === board[r][1] && board[r][1] === board[r][2])
        return board[r][0];
    }
    for (let c = 0; c < 3; c++) {
      if (board[0][c] && board[0][c] === board[1][c] && board[1][c] === board[2][c])
        return board[0][c];
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2])
      return board[0][0];
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0])
      return board[0][2];
    return null;
  }

  /**
   * Sincroniza el DOM con el estado actual de `board`.
   *
   * Recorre las 9 celdas, limpia su contenido y coloca la imagen de pieza
   * correspondiente. Si una pieza es la más antigua de un jugador que ya
   * acumuló MAX_PIECES, se marca como `piece--at-risk` (semitransparente).
   */
  function renderBoard() {
    /*
     * La pieza en riesgo es queue[0] cuando la cola tiene exactamente
     * MAX_PIECES elementos: si el jugador coloca una más, ésta será eliminada.
     * Se usa una clave "fila,columna" como string para comparar posiciones.
     */
    const atRisk = new Set();
    if (xMoves.length === MAX_PIECES) atRisk.add(`${xMoves[0][0]},${xMoves[0][1]}`);
    if (oMoves.length === MAX_PIECES) atRisk.add(`${oMoves[0][0]},${oMoves[0][1]}`);

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cell  = getCell(r, c);
        cell.innerHTML = '';
        const piece = board[r][c];
        if (!piece) continue;

        const img     = document.createElement('img');
        img.src       = `assets/${piece === 'X' ? 'cross' : 'circle'}.png`;
        img.alt       = piece;
        img.className = `piece piece--${piece === 'X' ? 'cross' : 'circle'}`;
        if (atRisk.has(`${r},${c}`)) img.classList.add('piece--at-risk');
        cell.appendChild(img);
      }
    }
  }

  /**
   * Procesa el clic en una celda: actualiza el estado del juego y refresca el DOM.
   *
   * Aplica la regla de piezas limitadas: si la cola del jugador supera
   * MAX_PIECES, elimina la pieza más antigua del tablero antes de evaluar
   * al ganador.
   *
   * @param {number} row - Fila de la celda clickeada (0–2).
   * @param {number} col - Columna de la celda clickeada (0–2).
   */
  function onCellClick(row, col) {
    if (winner || board[row][col]) return;

    board[row][col] = turn;
    const queue = turn === 'X' ? xMoves : oMoves;
    queue.push([row, col]);

    if (queue.length > MAX_PIECES) {
      const [r, c] = queue.shift();
      board[r][c] = '';
    }

    winner = checkWinner();
    if (!winner) turn = turn === 'X' ? 'O' : 'X';

    renderBoard();

    if (winner) {
      winnerText.textContent = `¡${winner} ganó!`;
      resultOverlay.classList.remove('hidden');
    } else {
      turnIndicator.textContent = `Turno: ${turn}`;
    }
  }

  /**
   * Reinicia el estado del juego para una nueva partida.
   *
   * El jugador inicial se elige aleatoriamente en cada reinicio.
   */
  function resetGame() {
    board  = Array.from({ length: 3 }, () => ['', '', '']);
    xMoves = [];
    oMoves = [];
    winner = null;
    turn   = Math.random() < 0.5 ? 'X' : 'O';

    resultOverlay.classList.add('hidden');
    renderBoard();
    turnIndicator.textContent = `Turno: ${turn}`;
  }

  /**
   * Ajusta la escala del tablero para que quepa en el viewport actual.
   *
   * El tablero se diseñó a 600×600 px con coordenadas fijas. En lugar de
   * recalcularlas, se escala el contenedor completo con `transform: scale`.
   * Esto preserva el mapping de clicks porque el evento ocurre en coordenadas
   * del DOM (no de pantalla).
   */
  function scaleBoard() {
    const available = Math.min(window.innerWidth, window.innerHeight) * 0.95;
    const scale     = Math.min(1, available / BOARD_SIZE);
    boardEl.style.transform = `scale(${scale})`;
  }

  /**
   * Muestra la pantalla de juego e inicia una partida nueva.
   */
  function showGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    resetGame();
    scaleBoard();
  }

  /**
   * Vuelve a la pantalla de inicio.
   */
  function showStart() {
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
  }

  document.getElementById('btn-play').addEventListener('click', showGame);
  document.getElementById('btn-new-game').addEventListener('click', resetGame);
  document.getElementById('btn-exit').addEventListener('click', showStart);
  window.addEventListener('resize', scaleBoard);
})();
