const Players = Object.freeze({
    White: 'white',
    Black: 'black'
});

const SIZE = 8;
const EXCEPTIONS = ['p', 'k'];

const boardDiv = document.getElementById('board');

let board = [
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["r", "n", "b", "q", "k", "b", "n", "r"],
];

let boardHistory = [];

let selected = null;
let turn = Players.White;

function switchColor(color) {
    if (color == Players.White) { return Players.Black }
    else { return Players.White }
}

function getCoords(cell) {
    let split = cell.id.split("-");

    return [Number(split[1]), Number(split[2])];
}

function pieceOfPlayer(piece) {
    if (piece.toLowerCase() == piece) {
        return Players.White;
    } else {
        return Players.Black;
    }
}

function applyGravity(target_x, target_y) {
    let piece = board[target_y][target_x];
    let gravity_y = SIZE;

    if (pieceOfPlayer(piece) == Players.White) {
        for (let y = target_y; y < SIZE; y++) {
            if (y == target_y) {
                continue
            } else if (board[y][target_x] == ' ') {
                gravity_y = y;
            } else {
                break
            }
        }
    } else {
        for (let y = target_y; y >= 0; y--) {
            if (y == target_y) {
                continue
            } else if (board[y][target_x] == ' ') {
                gravity_y = y;
            } else {
                break
            }
        }
    }

    if (SIZE > gravity_y && gravity_y >= 0 && !EXCEPTIONS.includes(piece.toLowerCase())) {
        board[gravity_y][target_x] = piece;
        board[target_y][target_x] = ' ';
    } else {
        board[target_y][target_x] = piece;
    }
}

function movePiece(selected, target) {
    let boardCopy = board.map(arr => {
        return arr.slice();
    });
    boardHistory.push([turn, boardCopy]);

    let [target_y, target_x] = getCoords(target);
    let [selected_y, selected_x] = getCoords(selected);

    board[target_y][target_x] = board[selected_y][selected_x];
    board[selected_y][selected_x] = ' ';
}

function handleClick(event) {
    let [target_y, target_x] = getCoords(event.target);

    if (selected == null) {
        if (board[target_y][target_x] == ' ') {
            return
        }

        if (pieceOfPlayer(board[target_y][target_x]) != turn) {
            return
        }

        event.target.classList.add('selected');
        selected = event.target;

        return
    }

    selected.classList.remove('selected');
    if (selected == event.target) {
        selected = null;
        return
    }

    let target = board[target_y][target_x];
    if (target != ' ' && pieceOfPlayer(board[target_y][target_x]) == turn) {
        selected = null;
        return
    }

    movePiece(selected, event.target);

    updateBoard();
    updateBoardDiv();

    if (turn == Players.White) {
        turn = Players.Black;
    } else {
        turn = Players.White;
    }

    selected = null;
}

function undo(event) {
    if (boardHistory.length == 0) {
        return;
    }

    [turn, board] = boardHistory.pop();
    updateBoardDiv();
}

function createBoardDiv() {
    if (boardDiv == null) {
        return;
    }

    let color = Players.White;

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            let cell_div = document.createElement('div');
            cell_div.classList.add('cell');
            cell_div.classList.add(color);

            cell_div.id = 'cell-' + y + '-' + x;
            cell_div.addEventListener('click', handleClick);
            boardDiv.appendChild(cell_div);

            color = switchColor(color);
        }

        color = switchColor(color);
    }

    let undoButton = document.getElementById("undo");
    undoButton.addEventListener('click', undo)

    boardDiv.appendChild(undoButton);
}

function updateBoard() {
    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            applyGravity(x, y);
        }

        for (let y = SIZE - 1; y >= 0; y--) {
            applyGravity(x, y);
        }
    }
}

function updateBoardDiv() {
    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            let cell_div = document.getElementById('cell-' + x + '-' + y);

            if (board[x][y] != ' ') {
                let color = pieceOfPlayer(board[x][y]);
                cell_div.innerHTML = '<img src=images/' + color + '/' + board[x][y].toLowerCase() + '.png />';
            } else {
                cell_div.innerHTML = '';
            }
        }
    }
}

createBoardDiv();
updateBoardDiv();
