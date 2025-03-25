//Gets the HTML element with the ID solve
const button = document.getElementById('solve');
//With this button, if it is clicked, set background color to green and changes text
let clickStatus = false;
button.addEventListener('click', function() {
  clickStatus = !clickStatus;
  if(!clickStatus){
      button.style.backgroundColor = "#45a049";
      button.innerHTML = "Solving...";
    } 
    else {
      button.style.backgroundColor = "#313338";
      button.innerHTML = "Solve";
    }
  });

const blockShapes = [
  { id: "block-1", shape: [[1, 1, 1], [0, 1, 0]]},
  { id: "block-2", shape: [[1,1], [1,1]]}
];

/*
  gridState:
  Array(8) initializes an array with 8 elements
  .fill().map() puts another array of 8 elements and makes all values false. Basically creates 2d Array with all false elements

  gridItems gets all HTML elements with the class 'grid-item' (Gridd Cells)
  blocks hold gets all elements with class block
*/
const gridState = Array(8).fill().map(() => Array(8).fill(false));
const gridItems = document.querySelectorAll('.grid-item');
const blocks = document.querySelectorAll('.block');
let currentBlock = null;
let draggedBlockCell = null;
let draggedBlockCellIndex = {row: 0, col: 0};

//NEEDS FIXING
//For each block add an event listener that checks if dragging
blocks.forEach(block => {
  block.addEventListener('dragstart', (e) => {
    currentBlock = block;
    //blockCell and draggedBlockCell kind of unnecessary I think
    const blockCell = e.target;
    draggedBlockCell = blockCell;
    //BLock cells gets all cells from the block thats selected
    const blockCells = Array.from(block.querySelectorAll('.block-cell'));
    //For each cell in the block check which index the mouse has entered and then enter those values to draggedBlockCellIndex for offset
    blockCells.forEach((blockCell, index) => {
      blockCell.addEventListener('mouseenter', () => {
        draggedBlockCellIndex = {
          row: Math.floor(index / 3),
          col: index % 3
        };
      });
    });
  });

  //After dragging has stopped, reset currentBlock and draggedBlockCell
  block.addEventListener('dragend', () => {
    currentBlock = null;
    draggedBlockCell = null;
  });
});

//For each value in the grid
gridItems.forEach(item => {
  item.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  //When a block is dropped on the grid
  item.addEventListener('drop', (e) => {
    const cellId = e.target.id;
    //Finds the index of what grid by slicing. Ex cell-1-1. Splits each - and gets the number
    const [row, col] = cellId.split('-').slice(1).map(Number);
    

    if (currentBlock) {
      const blockCells = currentBlock.querySelectorAll('.block-cell');
      let positions = []
      let valid = true

      blockCells.forEach((blockCell, index) => {
        const targetRow = row + Math.floor(index / 3) - draggedBlockCellIndex.row;
        const targetCol = col + (index % 3) - draggedBlockCellIndex.col;
        //Checks if move is valid
        if((gridState[targetRow] && gridState[targetRow][targetCol] === false)){
          positions.push([targetRow, targetCol])
        }
        else{
          valid = false;
        }
      });
      //if its valid, set the grid value to true and change color of grid
      if(valid){
        for(let i of positions){  
          console.log(i)
          const [rowValid, colValid] = i;
          gridState[rowValid][colValid] = true;
          document.getElementById(`cell-${rowValid}-${colValid}`).style.backgroundColor = '#90ee90';
        }
      }
      //Check for cleared rows
      checkAndClearRowsAndColumns();
      //Send data to flask server
      sendData();
    }
  });
});

//Flask Server
function sendData(){
  fetch('/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(gridState)
  });
}

//Checks each row and column, if every value in the grid is equal to True, clearRow
function checkAndClearRowsAndColumns() {
  for (let row = 0; row < gridState.length; row++) {
      if (gridState[row].every(cell => cell === true)) {
          clearRow(row);
      }
  }

  for (let col = 0; col < gridState[0].length; col++) {
      let fullColumn = true;
      for (let row = 0; row < gridState.length; row++) {
          //As soon as one value in the column is false, breaks out of loop.
          if (!gridState[row][col]) {
              fullColumn = false;
              break;
          }
      }
      //If iterates through loop and is still true then column is full and therefore clear
      if (fullColumn) {
          clearColumn(col);
      }
  }
}

//Clears row by making value from true to false and then making the background empty
function clearRow(row) {
  for (let col = 0; col < gridState[row].length; col++) {
      gridState[row][col] = false;
      document.getElementById(`cell-${row}-${col}`).style.backgroundColor = '';
  }
}

//Does the same thing for columns
function clearColumn(col) {
  for (let row = 0; row < gridState.length; row++) {
      gridState[row][col] = false;
      document.getElementById(`cell-${row}-${col}`).style.backgroundColor = '';
  }
}

function createBlocks(shape, blockID) {
  const block = document.createElement("div");
  block.classList.add("block");
  block.id = blockID;
}