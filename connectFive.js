const boardSize = 6;  // Change to 6x6 board
//creates a 1D array of 36 (6 * 6) squares filled with null. The null value means that no player (X or O) has occupied that square yet
function createBoard() {
  const squares = Array(boardSize * boardSize).fill(null);
  return squares;
}
//creates a x, o or " " based on square occupation, onClick event to the button that calls handleClick(i) when clicked, where i is the index of the square
function renderSquare(i, squares, handleClick) {
  const button = document.createElement('button');
  button.className = 'square';
  button.innerHTML = squares[i] || '';
  button.addEventListener('click', () => handleClick(i));
  return button;
}
/*Clearing the current board (boardElement.innerHTML = '').
Iterating through each row and column to create a new row (div) and populating it with squares (buttons) using renderSquare.
Appending each row to the board (boardElement)*/
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
/*checks for 4 in a row x or o iterating through the board 
and pushing all possible 4-in-a-row sequences into the 
lines array. It then checks each sequence to see if the 
same value (X or O) occupies all four squares*/
function calculateWinner(squares) {
  const lines = [];
  const winCondition = 4; // We need 4 in a row to win

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      // Check horizontal win (right)
      if (j <= boardSize - winCondition) {
        lines.push([i * boardSize + j, i * boardSize + j + 1, i * boardSize + j + 2, i * boardSize + j + 3]); // 4 in a row horizontally
      }
      // Check vertical win (down)
      if (i <= boardSize - winCondition) {
        lines.push([i * boardSize + j, (i + 1) * boardSize + j, (i + 2) * boardSize + j, (i + 3) * boardSize + j]); // 4 in a row vertically
      }
      // Check diagonal win (down-right)
      if (i <= boardSize - winCondition && j <= boardSize - winCondition) {
        lines.push([i * boardSize + j, (i + 1) * boardSize + (j + 1), (i + 2) * boardSize + (j + 2), (i + 3) * boardSize + (j + 3)]); // diagonal \
      }
      // Check diagonal win (down-left)
      if (i <= boardSize - winCondition && j >= winCondition - 1) {
        lines.push([i * boardSize + j, (i + 1) * boardSize + (j - 1), (i + 2) * boardSize + (j - 2), (i + 3) * boardSize + (j - 3)]); // diagonal /
      }
    }
  }

  for (const line of lines) {
    const [a, b, c, d] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
      return squares[a];
    }
  }
  return null;
}
// This Game() function initializes the game:
// It keeps track of the game history in the history array.
// Tracks the current move with currentMove.
// Renders the game board and attaches the reset button's onClick event listener.
/* At the end of the function, render() is called to display the initial 
empty game board.*/
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
/*This function handles what happens when a player clicks a square:
It identifies the column from the index i.
It searches for the lowest available square in that column 
(this ensures that squares are filled from the bottom up, 
like in Connect Four).
If a square is found and no winner has been declared yet, 
it updates the square to X or O depending on whose turn it is 
and proceeds to render the updated board*/
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
/*This function resets the game by clearing the history 
and resetting the board to an initial empty state.*/
  function resetGame() {
    history = [createBoard()];  // Reset the board
    currentMove = 0;  // Reset the current move
    movesElement.innerHTML = '';  // Clear the move history (remove move buttons)
    render();  // Re-render the board
  }
/*The render() function does the heavy lifting of:
Updating the game status (e.g., who the winner is or whose turn it is).
Rendering the current state of the board using renderBoard().
Rendering the move history as buttons, which allow the player 
to jump back to a previous state of the game.*/
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
