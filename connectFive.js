const boardSize = 5;

function createBoard() {
  const squares = Array(boardSize * boardSize).fill(null);
  return squares;
}

function renderSquare(i, squares, handleClick) {
  const button = document.createElement('button');
  button.className = 'square';
  button.innerHTML = squares[i] || '';
  button.addEventListener('click', () => handleClick(i));
  return button;
}

function renderBoard(boardElement, squares, handleClick) {
  boardElement.innerHTML = '';  // Clear the board first
  for (let row = 0; row < boardSize; row++) {
    const boardRow = document.createElement('div');
    boardRow.className = 'board-row';
    for (let col = 0; col < boardSize; col++) {
      boardRow.appendChild(renderSquare(row * boardSize + col, squares, handleClick));
    }
    boardElement.appendChild(boardRow);
  }
}

function calculateWinner(squares) {
  const lines = [];
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (j <= boardSize - 5) {
        lines.push([i * boardSize + j, i * boardSize + j + 1, i * boardSize + j + 2, i * boardSize + j + 3, i * boardSize + j + 4]); // horizontal
      }
      if (i <= boardSize - 5) {
        lines.push([i * boardSize + j, (i + 1) * boardSize + j, (i + 2) * boardSize + j, (i + 3) * boardSize + j, (i + 4) * boardSize + j]); // vertical
      }
      if (i <= boardSize - 5 && j <= boardSize - 5) {
        lines.push([i * boardSize + j, (i + 1) * boardSize + (j + 1), (i + 2) * boardSize + (j + 2), (i + 3) * boardSize + (j + 3), (i + 4) * boardSize + (j + 4)]); // diagonal \
        lines.push([i * boardSize + (boardSize - 1 - j), (i + 1) * boardSize + (boardSize - 2 - j), (i + 2) * boardSize + (boardSize - 3 - j), (i + 3) * boardSize + (boardSize - 4 - j), (i + 4) * boardSize + (boardSize - 5 - j)]); // diagonal /
      }
    }
  }
  for (const line of lines) {
    const [a, b, c, d, e] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return squares[a];
    }
  }
  return null;
}

function Game() {
  let history = [createBoard()];
  let currentMove = 0;
  document.querySelector('.reset-button').addEventListener('click', resetGame);

  const gameElement = document.querySelector('.game');
  const statusElement = document.querySelector('.status');
  const movesElement = document.querySelector('.moves');
  const boardElement = document.querySelector('.game-board');

  const xIsNext = () => currentMove % 2 === 0;
  const currentSquares = () => history[currentMove];

  function handleClick(i) {
    // Get the column number from the index
    const col = i % boardSize;

    // Find the lowest available square in the column
    let lowestAvailableRow = null;
    for (let row = boardSize - 1; row >= 0; row--) {
      const index = row * boardSize + col;
      if (!currentSquares()[index]) {  // If this square is empty
        lowestAvailableRow = index;
        break;
      }
    }

    // If no available square was found (column is full), do nothing
    if (lowestAvailableRow === null || calculateWinner(currentSquares())) {
      return;
    }

    // Update the square at the lowest available row
    const nextSquares = currentSquares().slice();
    nextSquares[lowestAvailableRow] = xIsNext() ? 'X' : 'O';
    history = history.slice(0, currentMove + 1);
    history.push(nextSquares);
    currentMove++;

    render();
  }

  function jumpTo(move) {
    currentMove = move;
    render();
  }

  function resetGame() {
    history = [createBoard()];  // Reset the board
    currentMove = 0;  // Reset the current move
    movesElement.innerHTML = '';  // Clear the move history (remove move buttons)
    render();  // Re-render the board
  }

  function render() {
    const winner = calculateWinner(currentSquares());
    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${xIsNext() ? 'X' : 'O'}`;
    }
    statusElement.innerHTML = status;

    renderBoard(boardElement, currentSquares(), handleClick);

    movesElement.innerHTML = '';
    history.forEach((squares, move) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.innerHTML = move ? `Go to move #${move}` : 'Go to game start';
      button.addEventListener('click', () => jumpTo(move));
      li.appendChild(button);
      movesElement.appendChild(li);
    });
  }

  render();
}

Game();
