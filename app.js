'use strict';

document.addEventListener('DOMContentLoaded', () => {
    console.log('loaded...');

    const grid = document.querySelector('.grid');

    let squares = Array.from(document.querySelectorAll('.grid div'));

    let score = 0;
    const scoreDisplay = document.querySelector('#score');

    const startButton = document.querySelector('#start-button');

    const width = 10;

    let nextRandom = 0;

    let timerId = 0;

    // the tetrominos
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2],
    ];
    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
    ];
    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1],
    ];
    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
    ];
    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
    ];

    const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let random = Math.floor(Math.random() * theTetrominos.length);
    let currentRotation = 0;

    let currentPosition = 4;
    let current = theTetrominos[random][currentRotation];

    // draw the current tetromino
    function draw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.add('tetromino');
        });
    }

    // undraw the current tetromino
    function undraw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.remove('tetromino');
        });
    }

    //    // move down the current tetromino every second
    //    timerId = setInterval(moveDown, 1000);

    // function to evaluate key
    function control(event) {
        if (event.keyCode === 37) {
            moveLeft();
        } else if (event.keyCode === 39) {
            moveRight();
        } else if (event.keyCode === 38) {
            rotate();
        } else if (event.keyCode === 40) {
            moveDown();
        }
    }

    // register eventlistener for keyboard
    document.addEventListener('keyup', control);

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function moveLeft() {
        undraw();

        if (!current.some((index) => (currentPosition + index) % width === 0)) {
            currentPosition--;
        }

        if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition++;
        }

        draw();
    }

    function moveRight() {
        undraw();

        if (!current.some((index) => (currentPosition + index) % width === 9)) {
            currentPosition++;
        }

        if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition--;
        }

        draw();
    }

    function rotate() {
        undraw();

        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }

        current = theTetrominos[random][currentRotation];

        draw();
    }

    function freeze() {
        if (current.some((index) => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach((index) => squares[currentPosition + index].classList.add('taken'));

            // start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominos.length);
            current = theTetrominos[random][currentRotation];
            currentPosition = 4;
            draw();
            displayNextTetromino();
            addScore();
            gameOver();
        }
    }

    // show up next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    // the tetromino whitout rotaions
    const upNextTetrominos = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
        [0, 1, displayWidth, displayWidth + 1], //otTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
    ];

    // display the shape in the mini-grid display
    function displayNextTetromino() {
        // undraw previouse tetromino
        displaySquares.forEach((square) => square.classList.remove('tetromino'));
        // draw next tetromino
        upNextTetrominos[nextRandom].forEach((index) =>
            displaySquares[displayIndex + index].classList.add('tetromino')
        );
    }

    // add functionality to button
    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = 0;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominos.length);
            displayNextTetromino();
        }
    });

    // add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

            if (row.every((index) => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach((index) => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                });

                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach((cell) => grid.appendChild(cell));
            }
        }
    }

    // game over
    function gameOver() {
        if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }
});
