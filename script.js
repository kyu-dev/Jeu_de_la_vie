const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const clearButton = document.getElementById('clearButton');
const randomButton = document.getElementById('randomButton');
const speed= document.getElementById('speed');
const speedDisplay = document.getElementById('speedDisplay')

// Nouveau : pour changer la vitesse de la simulation
speed.addEventListener('change', () => {
    clearInterval(interval);
    interval = setInterval(updateGrid, 10000 / speed.value);
});

// Nouveau : pour afficher la vitesse actuelle
speed.addEventListener('input', () => {
    speedDisplay.textContent = speed.value;
});



const cellSize = 10;
const rows = 80;
const cols = 80;
let grid = createGrid(rows, cols);
let running = false;
let interval;
let isDrawing = false; // Nouveau : pour savoir si on est en train de dessiner

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

// Crée une grille videa
function createGrid(rows, cols) {
    return new Array(rows).fill(null).map(() => new Array(cols).fill(0));
}

// Dessine la grille
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.beginPath();
            ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
            ctx.fillStyle = grid[row][col] ? 'black' : 'white';
            ctx.fill();
            ctx.stroke();
        }
    }
}



function randomizeGrid() {
    grid = grid.map(row => row.map(() => Math.random() > 0.5 ? 1 : 0));
    drawGrid();

}



// Met à jour l'état de la grille en fonction des règles du jeu
function updateGrid() {
    let newGrid = createGrid(rows, cols);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = grid[row][col];
            const numNeighbors = countNeighbors(row, col);

            if (cell === 1) {
                if (numNeighbors < 2 || numNeighbors > 3) {
                    newGrid[row][col] = 0; // Meurt
                } else {
                    newGrid[row][col] = 1; // Survit
                }
            } else {
                if (numNeighbors === 3) {
                    newGrid[row][col] = 1; // Naît
                }
            }
        }
    }

    grid = newGrid;
    drawGrid();
}

// Compte les voisins vivants d'une cellule
function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // Ignorer la cellule elle-même
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                count += grid[newRow][newCol];
            }
        }
    }
    return count;
}

// Gère le clic sur la grille pour changer l'état des cellules (lorsque la souris est en mouvement)
canvas.addEventListener('mousedown', (event) => {
    isDrawing = true; // Commence à dessiner
    toggleCell(event); // Dessine la cellule initiale
});

canvas.addEventListener('mousemove', (event) => {
    if (isDrawing) {
        toggleCell(event); // Continue à dessiner quand la souris bouge
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false; // Arrête de dessiner quand le bouton de la souris est relâché
});

// Fonction qui inverse l'état d'une cellule donnée
function toggleCell(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    grid[row][col] = 1; // Active la cellule
    drawGrid();
}

// Démarre la simulation
startButton.addEventListener('click', () => {
    if (!running) {
        running = true;
        interval = setInterval(updateGrid, 100);
    }
});


// Génère une grille aléatoire
randomButton.addEventListener('click', () => {
    randomizeGrid();
});

// Arrête la simulation
stopButton.addEventListener('click', () => {
    running = false;
    clearInterval(interval);
});

// Efface la grille
clearButton.addEventListener('click', () => {
    grid = createGrid(rows, cols);
    drawGrid();
});

// Dessine la grille initiale
drawGrid();