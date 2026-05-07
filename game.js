const MAX_PIECES = 3;
const BOARD_SIZE  = 600;

// DOM references
const startScreen   = document.getElementById('start-screen');
const gameScreen    = document.getElementById('game-screen');
const boardEl       = document.getElementById('board');
const turnIndicator = document.getElementById('turn-indicator');
const resultOverlay = document.getElementById('result-overlay');
const winnerText    = document.getElementById('winner-text');

// Game state
let board, xMoves, oMoves, turn, winner;

// Generate the 9 cells and wire click handlers before the overlay node
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

function getCell(row, col) {
  return cells[row * 3 + col];
}

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

function renderBoard() {
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

function scaleBoard() {
  const available = Math.min(window.innerWidth, window.innerHeight) * 0.95;
  const scale     = Math.min(1, available / BOARD_SIZE);
  boardEl.style.transform = `scale(${scale})`;
}

function showGame() {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  resetGame();
  scaleBoard();
}

function showStart() {
  gameScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
}

document.getElementById('btn-play').addEventListener('click', showGame);
document.getElementById('btn-new-game').addEventListener('click', resetGame);
document.getElementById('btn-exit').addEventListener('click', showStart);
window.addEventListener('resize', scaleBoard);
