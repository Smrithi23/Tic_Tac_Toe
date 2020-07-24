const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];
let available = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
let vacant = [0, 0, 0, 0, 0, 0, 0, 0, 0];
// w is the width of a grid box
let w = canvas.width / 3;
// height is the height of a grid box
let h = canvas.height / 3;

let game_score = [0, 0];
let moves = [0, 0];
let winner = null;
let ai = 'O', human = 'X';


//draw grid
const drawCtx = () => {
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
}

//draw x-o 
const draw = () => {
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            let x = w * i + w / 2;
            let y = h * j + h / 2;
            let xr = w / 10;
            if (board[i][j] == 'X') {
                ctx.beginPath();
                ctx.moveTo(x - xr, y - xr);
                ctx.lineTo(x + xr, y + xr);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x + xr, y - xr);
                ctx.lineTo(x - xr, y + xr);
                ctx.stroke();
            } else if (board[i][j] == 'O') {
                ctx.beginPath();
                ctx.arc(x, y, 10, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }
}

// const updateScore = (winner) => {
//     if (winner === 'X')
//         game_score[0] += (6 - moves[currentPlayerIndex]) * 10
//     else if (winner === 'O')
//         game_score[1] += (6 - moves[currentPlayerIndex]) * 10
//     // console.log(scores)
// }

const checkWinner = () => {
    winner = null;
    // horizontal
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] != '') {
            winner = board[i][0];
            // console.log('Winner is ', winner);
            //updateScore(winner)
        }
    }

    // vertical
    for (let i = 0; i < 3; i++) {
        if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] != '') {
            winner = board[0][i];
            // console.log('Winner is ', winner);
            //updateScore(winner)
        }
    }

    // diagonal
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] != '') {
        winner = board[0][0];
        // console.log('Winner is ', winner);
        //updateScore(winner)
    }

    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] != '') {
        winner = board[0][2];
        // console.log('Winner is ', winner);
        //updateScore(winner)
    }
    let check_tie = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == human || board[i][j] == ai) {
                check_tie++;
            }
        }
    }

    if (check_tie == 9) {
        winner = 'tie';
    }
    return winner;
}

let scores = {
    'X': -1,
    'O': 1,
    'tie': 0
};

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }
    if (isMaximizing) {
        let bestScore = -1 * Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = ai;
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    if (score > bestScore) {
                        bestScore = score;
                    }
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = human;
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    if (score < bestScore) {
                        bestScore = score;
                    }
                }
            }
        }
        return bestScore;
    }
}

function bestMove() {
    let bestScore = -1 * Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                board[i][j] = ai;
                let score = minimax(board, 0, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = { i, j };
                }
            }
        }
    }
    board[move.i][move.j] = ai;
    available.forEach((e) => {
        if (e[0] === move.i && e[1] === move.j) {
            indx = parseInt(available.indexOf(e))
        }
    })
    if (vacant[indx] === 0) {
        vacant[indx] = 1
    }
}

const nextTurn = (e) => {
    if (winner != null) {
        console.log(winner);
        console.log("Game Over!!!");
    } else {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let i = Math.floor(x / ((rect.right - rect.left) / 3));
        let j = Math.floor(y / ((rect.right - rect.left) / 3));
        // console.log(i, j);

        let indx = 0

        available.forEach((e) => {
            if (e[0] === i && e[1] === j) {
                indx = parseInt(available.indexOf(e))
            }
        })
        if (vacant[indx] === 0) {
            vacant[indx] = 1
            moves[0]++
            board[i][j] = human;
            draw();
            checkWinner();
           
            bestMove();
            draw();
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    console.log(board[k][l]);
                }
            }
            
            checkWinner();
        
        }
    }
}

document.querySelector('#restartBtn').addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    init()
})


const init = () => {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ];
    vacant = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    drawCtx()
    moves = [0, 0]
    winner = null;
    document.querySelector('canvas').addEventListener('click', function (e) {
        nextTurn(e);
    });
}

init()
