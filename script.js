var namaPlayer;
var gameFun;
var gridContainer;
var food;
var snake = []; 
var direction = "right"; 
var intervalId;
var score = 0;
var moveHistory = []; 
var rewindInterval = 5000;
function startGame() {
    namaPlayer = document.getElementById("nameInput").value;

    if (!namaPlayer) {
        alert("Please enter your name.");
        return;
    }

    gameFun = document.getElementById("gameFun");
    gridContainer = document.getElementById("gridContainer");
    gridContainer.innerHTML = ""; 
    snake = []; 
    direction = "right"; 
    moveHistory = [];
    score = 0;
    updateScore();

 
    for (let i = 0; i < 35; i++) {
        for (let j = 0; j < 35; j++) {
            let cell = document.createElement("div");
            cell.classList.add("grid-cell");
            cell.setAttribute("data-x", j);
            cell.setAttribute("data-y", i);
            gridContainer.appendChild(cell);
        }
    }


    for (let i = 0; i < 6; i++) {
        snake.push({ x: 15 + i, y: 15 });
    }
    renderSnake();


    placeFood();

    var startButton = document.getElementById("startButton");
    startButton.style.display = "none";

    
    intervalId = setInterval(moveSnake, 200); 
    setInterval(captureMoveHistory, rewindInterval)
}

function renderSnake() {
    gridContainer.querySelectorAll(".snake-segment").forEach(segment => {
        segment.classList.remove("snake-segment");
    });

    snake.forEach(segment => {
        var snakeCell = gridContainer.querySelector(`[data-x="${segment.x}"][data-y="${segment.y}"]`);
        if (snakeCell) {
            snakeCell.classList.add("snake-segment");
        }
    });
}

function moveSnake() {
    var head = snake[snake.length - 1];
    var newHead = { x: head.x, y: head.y };
    moveHistory.push(JSON.stringify(snake));
    switch (direction) {
        case "up":
            newHead.y -= 1;
            break;
        case "down":
            newHead.y += 1;
            break;
        case "left":
            newHead.x -= 1;
            break;
        case "right":
            newHead.x += 1;
            break;
    }

    if (isCollision(newHead) || isSelfCollision(newHead)) {
        clearInterval(intervalId);
        alert("Game Over! Your score: " + score);
        return;
    }

   
    snake.push(newHead);
    if (!isFoodCollision(newHead)) {
        snake.shift(); 
    } else {
        score += 10;
        updateScore();
        placeFood();
    }


    renderSnake();
}

function isCollision(position) {
    return (
        position.x < 0 ||
        position.x >= 35 ||
        position.y < 0 ||
        position.y >= 35
    );
}

function isSelfCollision(position) {
    return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

function isFoodCollision(position) {
    var foodCell = gridContainer.querySelector(`[data-x="${position.x}"][data-y="${position.y}"]`);
    if (foodCell && foodCell.classList.contains("food")) {
        foodCell.classList.remove("food");
        return true;
    }
    return false;
}

function placeFood() {
    var foodX, foodY;
    do {
        foodX = Math.floor(Math.random() * 35);
        foodY = Math.floor(Math.random() * 35);
    } while (isSelfCollision({ x: foodX, y: foodY }));

    var foodCell = gridContainer.querySelector(`[data-x="${foodX}"][data-y="${foodY}"]`);
    if (foodCell) {
        foodCell.classList.add("food");
    }
}

function updateScore() {
    var scoreElement = document.getElementById("score");
    scoreElement.textContent = "Score: " + score;
}

document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "w":
            if (direction !== "down") direction = "up";
            break;
        case "s":
            if (direction !== "up") direction = "down";
            break;
        case "a":
            if (direction !== "right") direction = "left";
            break;
        case "d":
            if (direction !== "left") direction = "right";
            break;
    }
});

function captureMoveHistory() {
    if (intervalId){
        moveHistory.push(JSON.stringify(snake))
    }
}

function rewindSnake() {
    if (moveHistory.length > 0) {
        snake.forEach(segment => {
            var snakeCell = gridContainer.querySelector(`[data-x="${segment.x}"][data-y="${segment.y}"]`);
            if (snakeCell) {
                snakeCell.classList.remove("snake-segment");
            }
        });

        snake = JSON.parse(moveHistory.pop());

        renderSnake();
    }
}