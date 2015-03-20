(function(GAME, undefined) {
    'use strict';

    var canvas = document.querySelector(GAME.config.elements.canvas),
        playButton = document.querySelector(GAME.config.elements.playButton),
        stepButton = document.querySelector(GAME.config.elements.stepButton),
        context = canvas.getContext('2d'),
        cellsSpan = document.querySelector(GAME.config.elements.cellsSpan),
        aliveSpan = document.querySelector(GAME.config.elements.aliveSpan),
        generationsSpan = document.querySelector(GAME.config.elements.generationsSpan),
        width = context.canvas.clientWidth,
        height = context.canvas.clientHeight,
        cellsWidth = width / GAME.config.cellSize,
        cellsHeight = height / GAME.config.cellSize,
        universe = GAME.Universe(width, height),
        cellSize = GAME.config.cellSize,
        colors = GAME.config.cellColors,
        simulating = false,
        events = GAME.config.events;

    var getColor = function(age) {
            //Is there a color defined for this age?
            if (age <= colors.length - 1) {
                return colors[age];
            } else {
                //use the one for the highest defined age
                return colors[colors.length - 1];
            }
        },
        //Check if cell is placed inside canvas, no need to render it otherwise
        isInsideContext = function(cell) {
            var isInsideLeftBorder = cell.positionX >= 0,
                isInsideRightBorder = cell.positionX < cellsWidth,
                isInsideTopBorder = cell.positionY >= 0,
                isInsideBottomBorder = cell.positionY < cellsHeight;

            return isInsideLeftBorder && isInsideRightBorder && isInsideTopBorder && isInsideBottomBorder;
        },
        render = function() {
            var alive = 0,
                cells = 0;

            //Clear canvas
            context.clearRect(0, 0, width, height);

            //Iterate through cells on board
            for (var column in universe.board) {
                for (var cellKey in universe.board[column]) {
                    var cell = universe.board[column][cellKey];
                    cell.update();
                    cells += 1;

                    //Is cell alive?
                    if (cell.alive()) {
                        alive += 1;
                    }

                    //Will it be seen on canvas?
                    if (isInsideContext(cell)) {
                        if (GAME.config.colorMode) {
                            context.fillStyle = getColor(cell.age);                            
                        }
                        context.beginPath();
                        context.rect(cell.positionX * cellSize, cell.positionY * cellSize, cellSize, cellSize);
                        if (cell.alive()) {
                            context.fill();
                        } else {
                            if (GAME.config.showExploration) {
                                context.stroke();
                            }
                        }                
                    }

                }
            }
            cellsSpan.textContent = cells;
            aliveSpan.textContent = alive;
            generationsSpan.textContent = universe.generations;
        },
        handleCellClick = function(e) {
            var positionX = Math.floor(e.offsetX / cellSize);
            var positionY = Math.floor(e.offsetY / cellSize);
            universe.toggleCell(positionX, positionY);
            render();
        },
        //Play/pause simulation
        toggleSimulate = function() {
            if (simulating) {
                simulating = false;
            } else {
                simulating = true;
                simulate();
            }
        },
        simulate = function() {
            step();
            if (simulating) {
                window.requestAnimationFrame(simulate);
            }
        },
        //Run one evolution
        step = function() {
            universe.evolve();
            render();
        };

    context.strokeStyle = GAME.config.strokeColor;
    context.fillStyle = GAME.config.fillColor;
    render();    //render once to show numbers

    canvas.addEventListener(events.CLICK, handleCellClick, false);
    playButton.addEventListener(events.CLICK, toggleSimulate, false);
    stepButton.addEventListener(events.CLICK, step, false);

}(window.GAME = window.GAME || {}))