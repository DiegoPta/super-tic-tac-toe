const MAX_PIECES = 3;

let board;
let xMoves;
let oMoves;
let turn;
let winner;

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
  if (xMoves.length === MAX_PIECES) atRisk.add(xMoves[0].toString());
  if (oMoves.length === MAX_PIECES) atRisk.add(oMoves[0].toString());

  document.querySelectorAll('.cell').forEach(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    cell.innerHTML = '';

    const piece = board[row][col];
    if (piece !== '') {
      const img = document.createElement('img');
      img.src = piece === 'X' ? 'assets/cross.png' : 'assets/circle.png';
      img.className = piece === 'X' ? 'cross' : 'circle';
      if (atRisk.has([row, col].toString())) {
        img.classList.add('at-risk');
      }
      cell.appendChild(img);
    }
  });
}

function updateTurnIndicator() {
  document.getElementById('turn-indicator').textContent = `Turno: ${turn}`;
}

function showOverlay(player) {
  document.getElementById('winner-text').textContent = `¡${player} ganó!`;
  document.getElementById('result-overlay').classList.remove('hidden');
}

function resetGame() {
  board = [['', '', ''], ['', '', ''], ['', '', '']];
  xMoves = [];
  oMoves = [];
  winner = null;
  turn = Math.random() < 0.5 ? 'X' : 'O';
  document.getElementById('result-overlay').classList.add('hidden');
  renderBoard();
  updateTurnIndicator();
}

function handleCellClick(row, col) {
  if (board[row][col] !== '') return;

  board[row][col] = turn;
  const queue = turn === 'X' ? xMoves : oMoves;
  queue.push([row, col]);

  if (queue.length > MAX_PIECES) {
    const [oldRow, oldCol] = queue.shift();
    board[oldRow][oldCol] = '';
  }

  winner = checkWinner();
  if (!winner) {
    turn = turn === 'X' ? 'O' : 'X';
  }

  renderBoard();

  if (winner) {
    showOverlay(winner);
  } else {
    updateTurnIndicator();
  }
}

function startGame() {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('turn-indicator').classList.remove('hidden');
  document.getElementById('board-wrapper').classList.remove('hidden');
  resetGame();
  scaleBoard();
}

function handleExit() {
  document.getElementById('board-wrapper').classList.add('hidden');
  document.getElementById('turn-indicator').classList.add('hidden');
  document.getElementById('start-screen').classList.remove('hidden');
}

function scaleBoard() {
  const wrapper = document.getElementById('board-wrapper');
  if (wrapper.classList.contains('hidden')) return;
  const available = Math.min(window.innerWidth, window.innerHeight) * 0.95;
  const scale = Math.min(1, available / 600);
  wrapper.style.transform = `scale(${scale})`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-play').addEventListener('click', startGame);
  document.getElementById('btn-new-game').addEventListener('click', resetGame);
  document.getElementById('btn-exit').addEventListener('click', handleExit);

  document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => {
      if (winner) return;
      handleCellClick(parseInt(cell.dataset.row), parseInt(cell.dataset.col));
    });
  });

  window.addEventListener('resize', scaleBoard);
});
