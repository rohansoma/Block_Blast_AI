const button = document.getElementById('solve');

button.addEventListener('click', function() {
    button.style.backgroundColor = "#45a049";
});

const gridState = Array(10).fill().map(() => Array(10).fill(false));
const gridItems = document.querySelectorAll('.grid-item');
const blocks = document.querySelectorAll('.block');
let currentBlock = null;
let draggedBlockCell = null;
let offsetX = 0;
let offsetY = 0;

blocks.forEach(block => {
  block.addEventListener('dragstart', (e) => {
    currentBlock = block;
    const blockCell = e.target;
    const blockRect = block.getBoundingClientRect();
    const blockCellRect = blockCell.getBoundingClientRect();
    draggedBlockCell = blockCell;

    offsetX = Math.floor((blockCellRect.left - blockRect.left) / 52);
    offsetY = Math.floor((blockCellRect.top - blockRect.top) / 52);
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

      blockCells.forEach((blockCell, index) => {
        const targetRow = row + Math.floor(index / 3) - offsetY;
        const targetCol = col + (index % 3) - offsetX;

        if (gridState[targetRow] && gridState[targetRow][targetCol] === false) {
          gridState[targetRow][targetCol] = true;
          document.getElementById(`cell-${targetRow}-${targetCol}`).style.backgroundColor = '#90ee90';
        }
      });
    }
  });
});