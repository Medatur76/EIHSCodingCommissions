var canvas, peice_group, indicators, size = 1;
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

/**
 * @author Medaturd76
 * @description Creates the basic board
 * @returns {[CanvasRenderingContext2D, number]}
 */
function drawBoard() {
    const content2D = canvas.getContext('2d');
    content2D.clearRect(0, 0, canvas.width, canvas.height);
    const primary = document.getElementById("c-1").value;
    const secondary = document.getElementById("c-2").value;
    const scale = Math.min(window.innerHeight, window.innerWidth)/300;
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
    return [content2D, size];
}

/**
 * @param {CanvasRenderingContext2D} content2D
 */
function drawPeices(content2D) {
    for (var peiceNum = 0; peiceNum < peice_group.children.length; peiceNum++) {
        const peice = peice_group.children[peiceNum];
        const img = new Image(150, 150) //Replace 120 with actual sizes
        img.src = `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${peice.name}.png`;
        const sPos = peice.id.split("");
        content2D.drawImage(img, conversion[sPos[0]]*size, (parseInt(sPos[1])-1)*size, size, size);
    }
}

/**
 * 
 * @param {String} peice Type of peice
 * @param {String} space [letter space][number space]
 */
function drawMovement(peice, space) {
    const content2D = updateBoard();
    const type = peice.split("")[1];
    if (type == "r") {
        //Rook
    } else if (type == "n") {
        //Knight
    } else if (type == "b") {
        //Bishup
    } else if (type == "k") {
        //King
    } else if (type == "q") {
        //Queen
    } else if (type == "p") {
        //Pawn
        const color_data = peice.split("")[0] == "b" ? [1, 2] : [-1, 7];
        const point = space.split("");
        const new_point_y = parseInt(point[1]) - 1 + color_data[0];
        content2D.beginPath();
        content2D.arc(conversion[point[0]]*size+(size/2), new_point_y * size + (size/2), size/3, 0, 2 * Math.PI, false);
        content2D.fillStyle = "rgba(80, 80, 80, 0.5)";
        content2D.fill();

        if (parseInt(point[1])==color_data[1]) {
            content2D.beginPath();
            content2D.arc(conversion[point[0]]*size+(size/2), (new_point_y + color_data[0]) * size + (size/2), size/3, 0, 2 * Math.PI, false);
            content2D.fill();
        }
    }
    content2D.beginPath();
}

/**
 * 
 * @param {String} oldSpace 
 * @param {String} newSpace 
 */
function drawAnimations(oldSpace, newSpace) {
    //
}

function updateBoard() {

    const data = drawBoard();
    const canvas = data[0];
    const size = data[1];

    drawPeices(canvas, size);

    return canvas;
}

/**
 * 
 * @param {MouseEvent} ev 
 */
function clickHandler(ev) {
    const bounds = canvas.getBoundingClientRect();
    const clickPos = [Math.min(Math.floor((ev.x-bounds.left)/size), 7), Math.min(Math.floor((ev.y-bounds.top)/size), 7)];
    const indicator = indicators_group.getElementsByClassName(`${conversion[clickPos[0]]} ${clickPos[1]}`)[0];
    if (indicator == null || indicator == undefined) {
        const peice = peice_group.getElementsByClassName(`${conversion[clickPos[0]]} ${clickPos[1]}`);
        if (peice != null && peice != undefined) {
            drawMovement(peice.name, `${conversion[clickPos[0]]}${clickPos[1]}`)
        }
    }

}

function ready() {
    canvas = document.body.appendChild(document.createElement('canvas'));
    canvas.id = "game";
    canvas.addEventListener('click', clickHandler);
    peice_group = document.body.appendChild(document.createElement('div'));
    peice_group.id = "peices";
    indicators = document.body.appendChild(document.createElement('div'));
    indicators.id = "indicators";
    for (const a in default_pcs) {
        for (const b of default_pcs[a]) {
            const button = peice_group.appendChild(document.createElement("div"));
            button.name = a;
            button.className = b.split("");
        }
    }
    indicators.firstChild
    updateBoard();
}

window.addEventListener('load', ready);
window.addEventListener('resize', updateBoard);