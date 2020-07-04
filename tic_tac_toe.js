const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];
let available = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
// w is the width of a grid box
let w = canvas.width / 3;
// height is the height of a grid box
let h = canvas.height / 3;

ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(w, 0);
ctx.lineTo(w, canvas.height);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(w * 2, 0);
ctx.lineTo(w * 2, canvas.height);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(0, h);
ctx.lineTo(canvas.width, h);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(0, h * 2);
ctx.lineTo(canvas.width, h * 2);
ctx.stroke();

let player = ['X', 'O'];
let currentPlayer = player[0];
let winner = null;

function findBox(e) {
    let x = e.clientX;
    let y = e.clientY;
    console.log("x = ", x, "y = ", y);
    console.log("window width = ", window.innerWidth, "canvas width = ", canvas.width, (window.innerWidth - canvas.width) / 2);  
    if(x >= (window.innerWidth - canvas.width) / 2) {
        
    }
    if(y >= (window.innerHeight - canvas.height) / 2) {
        
    }
}

function draw() {
    for (let j = 0; j < 3; j++) {
        for(let i = 0; i < 3; i++) {
            let x = w * i + w / 2;
            let y = h * j + h / 2;
            let xr = w / 10;
            if(board[i][j] == player[0]) {
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x-xr, y-xr);
                ctx.lineTo(x+xr, y+xr);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x+xr, y-xr);
                ctx.lineTo(x-xr, y+xr);
                ctx.stroke();
            } else if (board[i][j] == player[1]) {
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, 10, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }
}

function checkWinner() {

    // horizontal
    for (let i = 0; i < 3; i++) {
        if(board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] != '' ) {
            winner = board[i][0];
            console.log('Winner is ', winner);
            break;
        }
    }

    // vertical
    for (let i = 0; i < 3; i++) {
        if(board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] != '') {
            winner = board[0][i];
            console.log('Winner is ', winner);
            break;
        }
    }

    // diagonal
    if(board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] != '') {
        winner = board[0][0];
        console.log('Winner is ', winner);
    }

    if(board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] != '') {
        winner = board[0][2];
        console.log('Winner is ', winner);
    }

    if(winner == null && available.length == 0) {
        console.log('tie');
    } else {
        console.log(winner);
    }
}

function nextTurn() {
    console.log(available);
    if(available.length == 0 || winner != null) {
        console.log(winner);
        console.log("Game Over!!!")
    } else {
        let index = Math.floor(available.length * Math.random());
        let spot = available.splice(index, 1)[0];
        console.log(available);
        let i = spot[0];
        let j = spot[1];
        board[i][j] = currentPlayer;
        draw();
        checkWinner();
        if(currentPlayer == player[0]) {
            currentPlayer = player[1];
        } else {
            currentPlayer = player[0];
        }
    }
}

document.querySelector('body').addEventListener('click', function (e) {
    findBox(e);
    nextTurn();
});