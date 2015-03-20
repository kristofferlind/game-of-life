(function(GAME, undefined) {
    'use strict';

    GAME.config = {
        cellSize: 5,
        borderDeath: false,
        colorMode: false,	//well.. greyscale with current colorsettings
        showExploration: false,
        elements: {
    		canvas: '#game',
	        playButton: '#play',
	        stepButton: '#step',
	        cellsSpan: '#cells',
	        aliveSpan: '#alive',
	        generationsSpan: '#generations',
        },
        cellColors: ['#FFF', '#CCC', '#AAA', '#666', '#333', '#000'],
        strokeColor: '#F7F7F7',
        fillColor: '#000',
        events: {
        	CLICK: 'click'
        }
    };

}(window.GAME = window.GAME || {}))
