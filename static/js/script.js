const button = document.getElementById('solve');

button.addEventListener('click', function() {
    button.style.backgroundColor = "#45a049";
});

const gridState = Array(10).fill().map(() => Array(10).fill(false));
const gridItems = document.querySelectorAll('.grid-item');
const blocks = document.querySelectorAll('.block');
let currentBlock = null;
let draggedBlockCell = null;
let draggedBlockCellIndex = {row: 0, col: 0};

blocks.forEach(block => {
  block.addEventListener('dragstart', (e) => {
    currentBlock = block;
    const blockCell = e.target;
    draggedBlockCell = blockCell;
    const blockCells = Array.from(block.querySelectorAll('.block-cell'));
    blockCells.forEach((blockCell, index) => {
      blockCell.addEventListener('mouseenter', () => {
        draggedBlockCellIndex = {
          row: Math.floor(index / 3),
          col: index % 3
        };
      });
    });
  });

  block.addEventListener('dragend', () => {
    currentBlock = null;
    draggedBlockCell = null;
  });
});

gridItems.forEach(item => {
  item.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  item.addEventListener('drop', (e) => {
    const cellId = e.target.id;
    const [row, col] = cellId.split('-').slice(1).map(Number);
    
    if (currentBlock) {
      const blockCells = currentBlock.querySelectorAll('.block-cell');
      let positions = []
      let valid = true

      blockCells.forEach((blockCell, index) => {
        const targetRow = row + Math.floor(index / 3) - draggedBlockCellIndex.row;
        const targetCol = col + (index % 3) - draggedBlockCellIndex.col;

        if((gridState[targetRow] && gridState[targetRow][targetCol] === false)){
          positions.push([targetRow, targetCol])
        }
        else{
          valid = false;
        }
      });
      
      if(valid){
        for(let i of positions){  
          console.log(i)
          const [rowValid, colValid] = i;
          gridState[rowValid][colValid] = true;
          document.getElementById(`cell-${rowValid}-${colValid}`).style.backgroundColor = '#90ee90';
        }
      }
      
      checkAndClearRowsAndColumns();
      sendData();
      
    }
  });
});

function sendData(){
  fetch('/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(gridState)
  });
}

function checkAndClearRowsAndColumns() {
  for (let row = 0; row < gridState.length; row++) {
      if (gridState[row].every(cell => cell === true)) {
          clearRow(row);
      }
  }

  for (let col = 0; col < gridState[0].length; col++) {
      let fullColumn = true;
      for (let row = 0; row < gridState.length; row++) {
          if (!gridState[row][col]) {
              fullColumn = false;
              break;
          }
      }
      if (fullColumn) {
          clearColumn(col);
      }
  }
}

function clearRow(row) {
  for (let col = 0; col < gridState[row].length; col++) {
      gridState[row][col] = false;
      document.getElementById(`cell-${row}-${col}`).style.backgroundColor = '';
  }
}

function clearColumn(col) {
  for (let row = 0; row < gridState.length; row++) {
      gridState[row][col] = false;
      document.getElementById(`cell-${row}-${col}`).style.backgroundColor = '';
  }
}
