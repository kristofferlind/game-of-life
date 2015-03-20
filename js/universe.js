(function(GAME, undefined) {
    'use strict';

    GAME.Universe = function(width, height) {
        var _cells = [],
            findCell = function(positionX, positionY) {
                var cell = Universe.board[positionX] && Universe.board[positionX][positionY];
                
                if (cell) {
                    return cell;
                }

                return false;
            },
            isInsideBorders = function(positionX, positionY) {
                if (GAME.config.borderDeath) {
                    return positionX > -1 && positionX < width / GAME.config.cellSize && positionY > -1 && positionY < height / GAME.config.cellSize;
                } else {
                    return true;
                }
            },
            createCell = function(positionX, positionY) {
                var cell = new GAME.Cell(positionX, positionY);
                cell.toggleAlive();
                putOnBoard(cell);
            },
            addNeighbours = function(positionX, positionY) {
                var cell = findCell(positionX, positionY);
                cell.neighbours = initNeighbours(cell);
            },
            //Initiates cell neighbours, depth decides how many levels nested neighbours should be resolved
            initNeighbours = function(cell, depth) {
                var positionX = cell.positionX,
                    positionY = cell.positionY,
                    cellNeighbours = [];

                if (depth === undefined) {
                    depth = 2;
                }

                //Every cell has 8 neighbours around it, loop sets up positions for a 3x3 square centered on cell
                for (var x = -1; x <= 1; x += 1) {
                    for (var y = -1; y <= 1; y += 1) {
                        //Don't include active cell, and make sure it's inside borders
                        if (!(x === 0 && y === 0) && isInsideBorders(positionX + x, positionY + y)) {
                            var cell = initNeighbour(positionX + x, positionY + y)

                            //Set cell as explored if atleast 2 levels of neighbours will be explored
                            if (depth >= 2) {
                                cell.hasBeenExplored = true;
                            }
                            cellNeighbours.push(cell);
                        }
                    };
                };

                //depth = Remaining levels of cells to initiate neighbours for
                if (depth) {
                    depth -= 1;
                    cellNeighbours.forEach(function(cellNeighbour) {
                        cellNeighbour.neighbours = initNeighbours(cellNeighbour, depth)
                    });
                }

                return cellNeighbours;
            },
            //Find or initiate neighbour
            initNeighbour = function(positionX, positionY) {
                var foundCell = findCell(positionX, positionY);

                if (foundCell) {
                    return foundCell;
                } else {
                    var cell = new GAME.Cell(positionX, positionY);
                    putOnBoard(cell);

                    return cell;
                }
            },
            putOnBoard = function(cell) {
                if (!Universe.board[cell.positionX]) {
                    Universe.board[cell.positionX] = {};
                }
                Universe.board[cell.positionX][cell.positionY] = cell;
            };

        var Universe = {
            board: {},
            generations: 0,
            evolve: function() {
                //Iterate through all the cells placed on board
                //couldn't use 2d array as it wouldn't allow for cells ending up at negative positions
                //so it's a bit ugly, but it works
                for (var positionX in Universe.board) {
                    for (var positionY in Universe.board[positionX]) {
                        var cell = Universe.board[positionX][positionY],
                            startedLife = cell.evolve();

                        if (cell.hasBeenAlive && !cell.hasBeenExplored) {
                            cell.neighbours = initNeighbours(cell, 2);
                        }
                    }
                }
                Universe.generations += 1;
            },
            //Toggle cell status (initiate if it doesn't exist)
            toggleCell: function(positionX, positionY) {
                var foundCell = findCell(positionX, positionY);
                if (foundCell) {
                    foundCell.neighbours = initNeighbours(foundCell);
                    foundCell.toggleAlive();
                } else {
                    createCell(positionX, positionY);
                    addNeighbours(positionX, positionY);
                }
            },
        };

        return Universe;
    };

}(window.GAME = window.GAME || {}))
