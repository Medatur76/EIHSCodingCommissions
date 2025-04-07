/**
 * @type {HTMLDivElement}
 */
var canvas,
/**
 * @type {HTMLDivElement}
 */
    images, size = 1;
const default_pcs = {
    "br": ["a1", "h1"],
    "bn": ["b1", "g1"],
    "bb": ["c1", "f1"],
    "bk": ["d1"],
    "bq": ["e1"],
    "bp": ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
    "wr": ["a8", "h8"],
    "wn": ["b8", "g8"],
    "wb": ["c8", "f8"],
    "wk": ["d8"],
    "wq": ["e8"],
    "wp": ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"]
};

const conversion = {
    "a": 0,
    "b": 1,
    "c": 2,
    "d": 3,
    "e": 4,
    "f": 5,
    "g": 6,
    "h": 7,
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h"
};

const piece_to_int = {
    "b": 0,
    "w": 1,
    "p": 0,
    "r": 1,
    "n": 2,
    "b": 3,
    "k": 4,
    "q": 5
};

var peices = {};

var indicators = {};

var red;

/**
 * @author Medaturd76
 * @description Creates the basic board
 * @returns {CanvasRenderingContext2D}
 */
function drawBoard() {
    const content2D = canvas.getContext('2d');
    content2D.clearRect(0, 0, canvas.width, canvas.height);
    const primary = document.getElementById("c-1").value;
    const secondary = document.getElementById("c-2").value;
    const scale = Math.min(window.innerHeight, window.innerWidth)/150;
    size = 10*scale;
    canvas.width = size*8;
    canvas.height = size*8;
    content2D.fillStyle = primary;
    content2D.strokeStyle = primary;
    var x, y;
    x = y = -size;
    for (var c = 0; c < 8; c++) {
        x += size;
        y = -size;
        var colors = [primary, secondary];
        if (c%2==0) colors = [secondary, primary];
        for(var r = 0; r < 8; r++) {
            y += size;
            if(r%2==0) {
                content2D.fillStyle = colors[1];
                content2D.strokeStyle = colors[1];
            } else {
                content2D.fillStyle = colors[0];
                content2D.strokeStyle = colors[0];
            }
            content2D.fillRect(x, y, size, size);
        }
    }
    //Add colum and row notations
    return content2D;
}

/**
 * @author Medaturd76
 * @param {CanvasRenderingContext2D} content2D
 * @returns {CanvasRenderingContext2D}
 * @description Draws all the chess peices according to the images div element
 */
function drawPeices(content2D) {
    for (const [pos, peice] of Object.entries(peices)) {
        const sPos = pos.split("");
        if (pos == red) {
            content2D.fillStyle = "rgb(183, 0, 0)";
            content2D.strokeStyle = "rgb(183, 0, 0)";
            content2D.fillRect(conversion[sPos[0]]*size, (parseInt(sPos[1])-1)*size, size, size);
        }
        content2D.drawImage(document.getElementById(peice), conversion[sPos[0]]*size, (parseInt(sPos[1])-1)*size, size, size);
    }
    return content2D;
}

/**
 * @param {String} peice Type of peice [color][type]
 * @param {String} space Coordinate of selected peice [letter space][number space]
 * @param {boolean} [old=false] Wether or not to keep prev indicators
 * @param {CanvasRenderingContext2D} [content=null] If old is true then content MUST be specified
 * @param {boolean} [draw=true] Wether or not to draw indicators on screen.
 */
function drawMovement(peice, space, old=false, content=null, draw=true) {
    const content2D = old ? content : updateBoard();
    if (!old) indicators = {};
    const type = peice.split("")[1];
    const point = space.split("");
    content2D.fillStyle = "rgba(80, 80, 80, 0.5)";
    if (type == "r") {
        var nextTake = [conversion[conversion[point[0]]-1], parseInt(point[1])];
        var change = [-1, 0];
        var stillGoing = true;
        while (stillGoing) {
            if ((nextTake[0] == undefined) || (nextTake[1] < 1 || nextTake[1] > 8) || (peices[nextTake[0] + nextTake[1]] != null && peices[nextTake[0] + nextTake[1]] != undefined)) {
                if ((peices[nextTake[0] + nextTake[1]] != null && peices[nextTake[0] + nextTake[1]] != undefined) && peices[nextTake[0] + nextTake[1]].split("")[0] != peice.split("")[0]) {
                    indicators[nextTake[0] + nextTake[1]] = space;
                    if (draw) {
                        content2D.beginPath();
                        content2D.arc(conversion[nextTake[0]]*size+(size/2), (nextTake[1]-1) * size + (size/2), size/3, 0, 2 * Math.PI, false);
                        content2D.fill();
                    }
                }
                change.reverse();
                change[0] = change[0] * -1;
                if (change[0] == -1 && change[1] == 0) {
                    stillGoing = false;
                }
                nextTake = [conversion[conversion[point[0]]+change[0]], parseInt(point[1]) + change[1]];
            } else {
                indicators[nextTake[0] + nextTake[1]] = space;
                if (draw) {
                    content2D.beginPath();
                    content2D.arc(conversion[nextTake[0]]*size+(size/2), (nextTake[1]-1) * size + (size/2), size/3, 0, 2 * Math.PI, false);
                    content2D.fill();
                }
                nextTake[0] = conversion[conversion[nextTake[0]] + change[0]];
                nextTake[1] += change[1];
            }
        }
    } else if (type == "n") {
        const moves = [[-1, 2], [1, 2], [-2, 1], [2, 1], [-1, -2], [1, -2], [-2, -1], [2, -1]];
        for (const [xc, yc] of moves) {
            const newPoint = [conversion[conversion[point[0]] + xc], parseInt(point[1]) + yc];
            if (((peices[newPoint[0] + newPoint[1]] != null && peices[newPoint[0] + newPoint[1]] != undefined) && peices[newPoint[0] + newPoint[1]].split("")[0] != peice.split("")[0]) || (newPoint[0] != undefined && !(newPoint[1] < 1 || newPoint[1] > 8) && (peices[newPoint[0] + newPoint[1]] == null || peices[newPoint[0] + newPoint[1]] == undefined))) {
                indicators[newPoint[0] + newPoint[1]] = space;
                if (draw) {
                    content2D.beginPath();
                    content2D.arc(conversion[newPoint[0]]*size+(size/2), (newPoint[1]-1) * size + (size/2), size/3, 0, 2 * Math.PI, false);
                    content2D.fill();
                }
            }
        }
    } else if (type == "b") {
        var nextTake = [conversion[conversion[point[0]]+1], parseInt(point[1])+1];
        var change = [1, 1];
        var stillGoing = true;
        while (stillGoing) {
            if ((nextTake[0] == undefined) || (nextTake[1] < 1 || nextTake[1] > 8) || (peices[nextTake[0] + nextTake[1]] != null && peices[nextTake[0] + nextTake[1]] != undefined)) {
                if ((peices[nextTake[0] + nextTake[1]] != null && peices[nextTake[0] + nextTake[1]] != undefined) && peices[nextTake[0] + nextTake[1]].split("")[0] != peice.split("")[0]) {
                    indicators[nextTake[0] + nextTake[1]] = space;
                    if (draw) {
                        content2D.beginPath();
                        content2D.arc(conversion[nextTake[0]]*size+(size/2), (nextTake[1]-1) * size + (size/2), size/3, 0, 2 * Math.PI, false);
                        content2D.fill();
                    }
                }
                change.reverse();
                change[0] = change[0] * -1;
                if (change[0] == 1 && change[1] == 1) {
                    stillGoing = false;
                }
                nextTake = [conversion[conversion[point[0]]+change[0]], parseInt(point[1]) + change[1]];
            } else {
                indicators[nextTake[0] + nextTake[1]] = space;
                if (draw) {
                    content2D.beginPath();
                    content2D.arc(conversion[nextTake[0]]*size+(size/2), (nextTake[1]-1) * size + (size/2), size/3, 0, 2 * Math.PI, false);
                    content2D.fill();
                }
                nextTake[0] = conversion[conversion[nextTake[0]] + change[0]];
                nextTake[1] += change[1];
            }
        }
    } else if (type == "k") {
        const square = [[-1, 1], [0, 1], [1, 1], [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1]];
        for (const [xc, yc] of square) {
            const p = peices[conversion[conversion[point[0]]+xc] + (parseInt(point[1])+yc)];
            if (((p == null || p == undefined) && (parseInt(point[1])+yc >= 1 && parseInt(point[1])+yc <= 8)) || ((p != null || p != undefined) && p.split("")[0] != peice.split("")[0])) {
                indicators[conversion[conversion[point[0]]+xc] + (parseInt(point[1])+yc)] = space;
                if (draw) {
                    content2D.beginPath();
                    content2D.arc((conversion[point[0]]+xc)*size+(size/2), (parseInt(point[1])+yc-1) * size + (size/2), size/3, 0, 2 * Math.PI, false);
                    content2D.fill();
                }
            }
        }
    } else if (type == "q") {
        drawMovement(peice.split("")[0]+"r", space, true, content2D);
        drawMovement(peice.split("")[0]+"b", space, true, content2D);
    } else if (type == "p") {
        const color_data = peice.split("")[0] == "b" ? [1, 2] : [-1, 7];
        const new_point_y = parseInt(point[1]) - 1 + color_data[0];
        if (peices[point[0] + (new_point_y+1)] == undefined) {
            if (draw) {
                content2D.beginPath();
                content2D.arc(conversion[point[0]]*size+(size/2), new_point_y * size + (size/2), size/3, 0, 2 * Math.PI, false);
                content2D.fill();
            }
            indicators[point[0] + (new_point_y+1)] = space;
            if (parseInt(point[1])==color_data[1] && (peices[point[0] + (new_point_y+color_data[0]+1)] == undefined)) {
                if (draw) {
                    content2D.beginPath();
                    content2D.arc(conversion[point[0]]*size+(size/2), (new_point_y + color_data[0]) * size + (size/2), size/3, 0, 2 * Math.PI, false);
                    content2D.fill();
                }
                indicators[point[0] + (new_point_y + color_data[0]+1)] = space;
            }
        }
        const rightTake = conversion[conversion[point[0]]+1] + (new_point_y+1);
        if (peices[rightTake] != null && peices[rightTake] != undefined && peices[rightTake].split("")[0] != peice.split("")[0]) {
            if (draw) {
                content2D.beginPath();
                content2D.arc((conversion[point[0]]+1)*size+(size/2), new_point_y * size + (size/2), size/3, 0, 2 * Math.PI, false);
                content2D.fill();
            }
            indicators[rightTake] = space;
        }
        const leftTake = conversion[conversion[point[0]]-1] + (new_point_y+1);
        if (peices[leftTake] != null && peices[leftTake] != undefined && peices[leftTake].split("")[0] != peice.split("")[0]) {
            if (draw) {
                content2D.beginPath();
                content2D.arc((conversion[point[0]]-1)*size+(size/2), new_point_y * size + (size/2), size/3, 0, 2 * Math.PI, false);
                content2D.fill();
            }
            indicators[leftTake] = space;
        }
    }
    content2D.beginPath();
}

/**
 * @param {String} oldSpace 
 * @param {String} newSpace
 * @returns {bool} Wether or not the move was successful 
 */
function drawAnimations(oldSpace, newSpace) {
    //Possiblity for cool animations to spice things up a bit?
    var r = true;
    indicators = {};
    const peice = peices[oldSpace];
    const take = peices[newSpace];
    const color = peice.split("")[0];
    const con = updateBoard();
    var king;
    delete peices[oldSpace];
    peices[newSpace] = peice;
    for (const [s, p] of Object.entries(peices)) {
        if (p.split("")[0] != color) {
            drawMovement(p, s, old=true, content=con, draw=false);
        } else if (p == color + "k") {
            king = s;
        }
    }
    if (indicators[king] != undefined) {
        //Checkmate needs to be added
        const covered = indicators;
        drawMovement(color + "k", king, )
        red = indicators[king];
        if (take != undefined) {
            peices[newSpace] = take;
        } else {
            delete peices[newSpace];
        }
        peices[oldSpace] = peice;
        r = false;
    }
    else if (red != null) red = null;
    indicators = {};
    updateBoard();
    return r;
}

function updateBoard() {

    var canvas = drawBoard();

    canvas = drawPeices(canvas);

    return canvas;
}

var whiteTurn = true;

/**
 * @author Medaturd76
 * @description Handles an input on the canvas element
 * @param {MouseEvent} ev 
 */
function clickHandler(ev) {
    const bounds = canvas.getBoundingClientRect();
    const clickPos = [Math.min(Math.floor((ev.x-bounds.left)/size), 7), Math.min(Math.floor((ev.y-bounds.top)/size), 7)];
    const boardPos = `${conversion[clickPos[0]]}${clickPos[1]+1}`;
    const indicator = indicators[boardPos];
    if (indicator == null || indicator == undefined) {
        const peice = peices[boardPos];
        if (peice != null && peice != undefined) {
            if ((peice.split("")[0] == "w" && whiteTurn) || (peice.split("")[0] == "b" && !whiteTurn)) drawMovement(peice, boardPos.replace(" ", ""));
        } else {
            indicators = {};
            updateBoard();
        }
    } else {
        if (drawAnimations(indicator, boardPos)) whiteTurn = !whiteTurn;
    }
}

function ready() {
    console.log("DEV LOG:\nSetting up game...");
    canvas = document.body.appendChild(document.createElement('canvas'));
    canvas.id = "game";
    canvas.addEventListener('click', clickHandler);
    images = document.body.appendChild(document.createElement('div'));
    images.className = "hidden";
    for (const c of ["b", "w"]) {
        for (const p of ["r", "n", "b", "q", "k", "p"]) {
            const img = images.appendChild(document.createElement("img"));
            img.height = img.width = 150; //Replace 150 with actual sizes
            img.src = `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${c+p}.png`;
            img.id = c+p;
        }
    }
    for (const a in default_pcs) {
        for (const b of default_pcs[a]) {
            peices[b] = a;
        }
    }
    console.log("Default board elements setup!");
    updateBoard();
    window.addEventListener('resize', updateBoard);
    console.log("Full setup complete!");
}

window.addEventListener('load', ready);