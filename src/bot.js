/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2018 - 2019 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
import { ELEMENT, COMMANDS } from './constants';
import {
    isGameOver, getHeadPosition, getElementByXY, getBoardSize
} from './utils';

// Bot Example
export function getNextSnakeMove(board, logger) {
    if (isGameOver(board)) {
        return '';
    }
    const headPosition = getHeadPosition(board);
    if (!headPosition) {
        return '';
    }
    logger('Head:' + JSON.stringify(headPosition));

    const sorround = getSorround(board, headPosition); // (LEFT, UP, RIGHT, DOWN)

    // console.log(sorround);


    logger('Sorround: ' + JSON.stringify(sorround));

    const raitings = sorround.map(rateElement);
    logger('Raitings:' + JSON.stringify(raitings));
    //add choice if ELEMENT.NONE
    alternative(raitings, headPosition);

    const command = getCommandByRaitings(raitings);

    return command;
}

function alternative(raitings, headPosition) {
    let count = [];
    let p = headPosition;
    raitings.forEach(function(item, i) {
        if (item == 0) count.push(i);
    });

    if (count.length>1) {
        console.log('What can I do? I have '+count.length+' variants');
        count.forEach(function (item, i, arr) {
            switch (item) {
                case 0:
                    arr[i] = {i:0, x: p.x-1, y: p.y};
                    break;
                case 1:
                    arr[i] = {i:1, x: p.x, y: p.y-1};
                    break;
                case 2:
                    arr[i] = {i:2, x: p.x+1, y: p.y};
                    break;
                case 3:
                    arr[i] = {i:3, x: p.x, y: p.y+1};
                    break;
                default: break;
            }
        });
        // if (minDistance(board,ELEMENT.APPLE,count[i]).d )
    }
}

// return array with XY of all elements of current type
function getElementsXY(board, element) {
    let elementXY = [];
    for (var y = 0; y < getBoardSize(board); y++) {
        for (var x = 0; x < getBoardSize(board); x++) {
            if (getElementByXY(board, {x, y}) ===  element) elementXY.push({'x':x,'y':y});
        }
    }
    return elementXY;
}

function minDistance(board, element, position) {
    const p = position;
    let elementXY = getElementsXY(board, ELEMENT.APPLE);
    let dist = {};
    dist.d=board.length;

    for (let i=0; i<elementXY.length; i++) {
        if (Math.hypot(elementXY[i].x-p.x, elementXY[i].y-p.y) < dist.d) dist = {"d":Math.hypot(elementXY[i].x-p.x, elementXY[i].y-p.y),"x":elementXY[i].x,"y":elementXY[i].y}
    }
    return dist;
}

function getSorround(board, position) {
    const p = position;
    return [
        (getElementByXY(board, {x: p.x-1, y: p.y-1 }) === ELEMENT.WALL) && (getElementByXY(board, {x: p.x-1, y: p.y+1 }) === ELEMENT.WALL) ?  ELEMENT.WALL : getElementByXY(board, {x: p.x - 1, y: p.y }), // LEFT
        (getElementByXY(board, {x: p.x-1, y: p.y-1 }) === ELEMENT.WALL) && (getElementByXY(board, {x: p.x+1, y: p.y-1 }) === ELEMENT.WALL) ?  ELEMENT.WALL : getElementByXY(board, {x: p.x, y: p.y -1 }), // UP
        (getElementByXY(board, {x: p.x+1, y: p.y-1 }) === ELEMENT.WALL) && (getElementByXY(board, {x: p.x+1, y: p.y+1 }) === ELEMENT.WALL) ?  ELEMENT.WALL : getElementByXY(board, {x: p.x + 1, y: p.y}), // RIGHT
        (getElementByXY(board, {x: p.x-1, y: p.y+1 }) === ELEMENT.WALL) && (getElementByXY(board, {x: p.x+1, y: p.y+1 }) === ELEMENT.WALL) ?  ELEMENT.WALL : getElementByXY(board, {x: p.x, y: p.y + 1 }) // DOWN
    ];
}

function rateElement(element) {
    if (element === ELEMENT.NONE) {
        return 0;
    }
    if (
        element === ELEMENT.APPLE ||
        element === ELEMENT.GOLD ||
        element === ELEMENT.FURY_PILL ||
        element === ELEMENT.FLYING_PILL
    ) {
        return 1;
    }

    return -1;


}


function getCommandByRaitings(raitings) {
    var indexToCommand = ['LEFT', 'UP', 'RIGHT', 'DOWN'];
    var maxIndex = 0;
    var max = -Infinity;
    for (var i = 0; i < raitings.length; i++) {
        var r = raitings[i];
        if (r > max) {
            maxIndex = i;
            max = r;
        }
    }

    return indexToCommand[maxIndex];
}
