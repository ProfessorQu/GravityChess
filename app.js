const Players = Object.freeze({
    White: 'white',
    Black: 'black'
});

const SIZE = 8;

const board_div = document.getElementById('board');
let selected = null;
let turn = Players.White;

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

function switch_color(color) {
    if (color == Players.White) { return Players.Black }
    else { return Players.White }
}

function get_coords(cell) {
    let split = cell.id.split("-");

    return [Number(split[1]), Number(split[2])];
}

function playerPiece(piece) {
    if (piece.toLowerCase() == piece) {
        return Players.White;
    } else {
        return Players.Black;
    }
}

function gravity(piece, target_x, target_y) {
    let gravity_y = SIZE;
    if (playerPiece(piece) == Players.White) {
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

    return gravity_y;
}

function move_piece(selected, target) {
    let [target_y, target_x] = get_coords(target);
    let [selected_y, selected_x] = get_coords(selected);

    let piece = board[selected_y][selected_x];

    board[selected_y][selected_x] = ' ';

    let gravity_y = gravity(piece, target_x, target_y);

    if (SIZE > gravity_y && gravity_y >= 0 && piece.toLowerCase() != 'p') {
        board[gravity_y][target_x] = piece;
        board[target_y][target_x] = ' ';
    } else {
        board[target_y][target_x] = piece;
    }
}

function handle_click(event) {
    console.log(event);
    let [target_y, target_x] = get_coords(event.target);
    console.log(target_x, target_y);
    if (selected == null) {
        if (board[target_y][target_x] == ' ') {
            return
        }

        if (playerPiece(board[target_y][target_x]) != turn) {
            return
        }

        event.target.classList.add('selected');
        selected = event.target;
        return
    }

    selected.classList.remove('selected');

    move_piece(selected, event.target);

    update_board_div();
    if (turn == Players.White) {
        turn = Players.Black;
    } else {
        turn = Players.White;
    }

    selected = null;
}

function create_board_div() {
    if (board_div == null) {
        return;
    }

    let color = Players.White;

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            let cell_div = document.createElement('div');

            cell_div.classList.add('cell');
            cell_div.classList.add(color);

            cell_div.id = 'cell-' + y + '-' + x;

            cell_div.addEventListener('click', handle_click);

            board_div.appendChild(cell_div);

            color = switch_color(color);
        }

        color = switch_color(color);
    }
}

function update_board_div() {
    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            let cell_div = document.getElementById('cell-' + x + '-' + y);

            if (board[x][y] != ' ') {
                let color = playerPiece(board[x][y]);
                cell_div.innerHTML = '<img src=images/' + color + '/' + board[x][y] + '.png />';
            } else {
                cell_div.innerHTML = '';
            }
        }
    }
}

create_board_div();
update_board_div();
