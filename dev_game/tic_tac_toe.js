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

let game_score = 0;
let moves=0;
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
        }
    }

    // vertical
    for (let i = 0; i < 3; i++) {
        if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] != '') {
            winner = board[0][i];
        }
    }

    // diagonal
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] != '') {
        winner = board[0][0];
    }

    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] != '') {
        winner = board[0][2];
    }
    let check_tie = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == human || board[i][j] == ai) {
                check_tie++;
            }
        }
    }

    if (check_tie == 9 && !winner) {
        winner = 'tie';
    }
    return winner;
}

let scores = {
    'X': 0,
    'O': 0,
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
    setInterval(function(){  }, 3000)
    document.getElementById('robot-id').style.border = "10px solid #008829"
    document.getElementById('human-id').style.border = "none"
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

const updateScore = (winner, game_score) => {
    console.log(winner)
    if(winner == human){
        document.getElementById('result').style.color = 'green'
        document.getElementById('result').innerHTML = 'YOU WIN!'
        document.getElementById('score').innerHTML = 'Score : ' + game_score
        document.getElementById('button-div').style.color = 'yellow'
    } else if(winner == ai){
        document.getElementById('result').style.color = 'red'
        document.getElementById('result').innerHTML = 'AI WINS!'
        document.getElementById('score').innerHTML = 'Score : 0'
    } else {
        document.getElementById('result').style.color = 'orange'
        document.getElementById('result').innerHTML = 'IT\'S A TIE!'
        document.getElementById('score').innerHTML = 'Score : 0'
    }
}

const calcScore = (winner) => {
    if(winner === ai){
        scores.O ++;
    } else if(winner === human){
        scores.X ++;
        game_score = (6 - moves) * 10
    } else {
        scores.tie ++
    }
    console.log(scores)
    updateScore(winner, game_score);
}

const nextTurn = (e) => {
    if (winner != null) {
        // console.log(winner);
        console.log("Game Over!!!");
        document.getElementById("screen").style.display = 'block';
        document.getElementById("card").style.display = 'block';
    } else {
        document.getElementById('human-id').style.border = "10px solid #008829"
        document.getElementById('robot-id').style.border = "none"
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let i = Math.floor(x / ((rect.right - rect.left) / 3));
        let j = Math.floor(y / ((rect.right - rect.left) / 3));
        let indx = 0
        available.forEach((e) => {
            if (e[0] === i && e[1] === j) {
                indx = parseInt(available.indexOf(e))
            }
        })
        if (vacant[indx] === 0) {
            vacant[indx] = 1
            moves++
            board[i][j] = human;
            draw();
            // checkWinner();
            let result = checkWinner();
            if(result != null) {
                // console.log(winner);
                console.log("Game Over!!!");
                calcScore(result)
                document.getElementById("screen").style.display = 'block';
                document.getElementById("card").style.display = 'block';  
            } else {
                bestMove();
                draw();
                for (let k = 0; k < 3; k++) {
                    for (let l = 0; l < 3; l++) {
                        // console.log(board[k][l]);
                    }
                }
                result = checkWinner();
                if(result != null) {
                    // console.log(winner);
                    console.log("Game Over!!!");
                    calcScore(result)
                    document.getElementById("screen").style.display = 'block';
                    document.getElementById("card").style.display = 'block';    
                }
            }
            
        
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
    moves = 0
    winner = null;
    document.querySelector('canvas').addEventListener('click', function (e) {
        nextTurn(e);
    });
}

init()
