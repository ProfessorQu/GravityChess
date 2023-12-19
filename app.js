const Players = Object.freeze({
    White: 'white',
    Black: 'black'
});

const SIZE = 8;
const EXCEPTIONS = ['p', 'k'];

const board_div = document.getElementById('board');

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

let selected = null;
let turn = Players.White;

function switch_color(color) {
    if (color == Players.White) { return Players.Black }
    else { return Players.White }
}

function get_coords(cell) {
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

function apply_gravity(target_x, target_y) {
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

function move_piece(selected, target) {
    let [target_y, target_x] = get_coords(target);
    let [selected_y, selected_x] = get_coords(selected);

    board[target_y][target_x] = board[selected_y][selected_x];
    board[selected_y][selected_x] = ' ';
}

function get_moves(piece_x, piece_y) {
    let piece = board[piece_y][piece_x];

    if (piece.toLowerCase() == 'p') {
        if (pieceOfPlayer(piece) == Players.White) {
            return [{
                x: piece_x,
                y: piece_y - 1
            }];
        } else {
            return [{
                x: piece_x,
                y: piece_y + 1
            }];
        }
    } else if (piece.toLowerCase() == 'b') {
        let moves = [];

        for (let move_x = 0; move_x < SIZE; move_x++) {
            for (let move_y = 0; move_y < SIZE; move_y++) {
                if (Math.abs(move_x - piece_x) != Math.abs(move_y - piece_y)) {
                    continue
                }

                if (board[move_y][move_x] != ' ' && pieceOfPlayer(board[move_y][move_x]) == turn) {
                    break
                }

                if (move_x == piece_x && move_y == piece_y) {
                    continue
                }

                moves.push({
                    x: move_x,
                    y: move_y
                });
            }
        }

        return moves;
    } else {
        return [];
    }
}

function handle_click(event) {
    reset_board();

    let [target_y, target_x] = get_coords(event.target);

    if (selected == null) {
        if (board[target_y][target_x] == ' ') {
            return
        }

        if (pieceOfPlayer(board[target_y][target_x]) != turn) {
            return
        }

        event.target.classList.add('selected');
        selected = event.target;

        let moves = get_moves(target_x, target_y);
        moves.forEach(move => {
            let cell = document.getElementById('cell-' + move.y + '-' + move.x);
            cell.classList.add('possible');
        });

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

    move_piece(selected, event.target);

    update_board();
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

function reset_board() {
    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            let cell_div = document.getElementById('cell-' + x + '-' + y);

            cell_div.classList.remove('possible');
        }
    }
}

function update_board() {
    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            apply_gravity(x, y);
        }

        for (let y = SIZE - 1; y >= 0; y--) {
            apply_gravity(x, y);
        }
    }
}

function update_board_div() {
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

create_board_div();
update_board_div();
