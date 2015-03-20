(function(GAME, undefined) {
    'use strict';

    GAME.Cell = function(positionX, positionY) {
        var countAliveNeighbours = function() {
                //Does it have neighbours?
                if (Cell.neighbours) {
                    //Check which neighbours are alive
                    var aliveCells = Cell.neighbours.filter(function(cell) {
                        return cell.alive();
                    });
                    return aliveCells.length;
                } else {
                    return 0;
                }
            },
            shouldStayAlive = function() {
                //Cells with 2 or 3 neighbours should stay alive
                return countAliveNeighbours() === 2 || countAliveNeighbours() === 3;
            },
            shouldStartLife = function() {
                //Cells with 3 neighbours should come to life
                return countAliveNeighbours() === 3;
            };

        var Cell = {
            age: 0,
            newAge: 0,
            alive: function() {
                return Cell.age > 0;
            },
            positionX: positionX,
            positionY: positionY,
            neighbours: [],
            //Keep track of whether cell is in an explored area, 
            //initiating neighbours is expensive, don't do it more than necessary
            hasBeenExplored: false,
            hasBeenAlive: false,
            evolve: function() {
                //Is cell alive?
                if (Cell.alive()) {
                    //.. should it stay alive?
                    if (shouldStayAlive()) {
                        //Increase age by 1
                        Cell.newAge += 1;
                    } else {
                        //..otherwise cell should die
                        Cell.newAge = 0;
                    }
                } else {
                    //Should it come to life?
                    if (shouldStartLife()) {
                        Cell.newAge = 1;

                        //Cell evolution requires further exploration
                        Cell.hasBeenAlive = true;
                    }
                }
            },
            update: function() {
                Cell.age = Cell.newAge;
            },
            toggleAlive: function() {
                //Is cell alive?
                if (Cell.alive()) {
                    //Toggle to dead
                    Cell.newAge = 0;
                } else {
                    //..otherwise toggle to alive
                    Cell.newAge = 1;
                }
            }
        };

        return Cell;
    };

}(window.GAME = window.GAME || {}))