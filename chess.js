var canvas;
var button_group;
const default_pcs = {
    "br": [""]
};

/**
 * 
 * @returns {[CanvasRenderingContext2D, number]}
 */
function drawBoard() {
    const content2D = canvas.getContext('2d');
    content2D.clearRect(0, 0, canvas.width, canvas.height);
    const primary = document.getElementById("c-1").value;
    const secondary = document.getElementById("c-2").value;
    const scale = Math.min(window.innerHeight, window.innerWidth)/300;
    const size = 10*scale;
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
 * @param {number} size
 */
function drawPeices(content2D, size) {
    for (var c = 0; c < peices.length; c++) {
        for (var r = 0; r < peices[c].length; r++) {
            if (peices[c][r] != '') {
                const img = new Image(120, 120) //Replace 120 with actual sizes
                img.src = `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${}.png`;
                content2D.drawImage(img, c*size, r*size, size, size);
            }
        }
    }
}

function drawMovement() {}

function drawAnimations() {}

function tick(timeStamp) {

    var data = drawBoard();
    const canvas = data[0];
    const size = data[1];

    drawPeices(canvas, size);

    window.requestAnimationFrame(tick);
}

function ready() {
    canvas = document.body.appendChild(document.createElement('canvas'));
    canvas.id = "game";
    button_group = document.body.appendChild(document.createElement('div'));
    button_group.id = "peices";
    
    window.requestAnimationFrame(tick);
}

window.addEventListener('load', ready);