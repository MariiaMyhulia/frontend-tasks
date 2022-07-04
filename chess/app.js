
document.addEventListener("DOMContentLoaded", play)

// create the 'Reset game' button and add it to parent div. Add Event Listener 'click' to this button. Delete local storage info
function addResetBtn() {
    let btn = document.createElement('button')
    btn.classList.add('reset')
    btn.innerText = 'Reset game'
    btn.addEventListener('click', function () {
        delete localStorage.white;
        delete localStorage.black;
        delete localStorage.turn;
        location.reload()
    })
    document.querySelector('#parent').appendChild(btn)
}

//  Define blackPieces variable as a object of numbers {key - number of piece (attribute data-numb): val - id of square
let blackPieces = {
    1: 71,
    2: 72,
    3: 73,
    4: 74,
    5: 75,
    6: 76,
    7: 77,
    8: 78,
    9: 81,
    10: 82,
    11: 83,
    12: 84,
    13: 85,
    14: 86,
    15: 87,
    16: 88,
};

//  Define whitePieces variable as a object of numbers {key - number of piece (attribute data-numb): val - id of square
let whitePieces = {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 15,
    6: 16,
    7: 17,
    8: 18,
    9: 21,
    10: 22,
    11: 23,
    12: 24,
    13: 25,
    14: 26,
    15: 27,
    16: 28,
};

/*Define helper buffer object to write an information about users step
    bufferStep = {
        'color': color of current figure,
        'id': number of current figure in whitePieces/blackPieces,
        'prevSquare': the id of square where figure was before making step
    }
 */
let bufferStep = new Object()

//  Helper function to change the objects (whitePieces/blackPieces) and execute a callback function
function changeObjProp(obj, id, value, callback) {
    obj[id] = value;
    return callback();
}
//  Helper function to check the objects (whitePieces/blackPieces) if it contains some value
function checkObj(obj, check_val) {

    return Object.values(obj).includes(check_val)
}

/*main function to play chess
creates 'chessBoard'
creates 'Reset game' button
if exist local storage savings - execute AddStartPiecesLocalStorage and define turn from local storage
if local storage savings is not able - execute AddStartPieces
Define default turn to first step - white pieces go first
 */
function play() {
    createBoard();
    addResetBtn();
    let turn = 'white'
    if (localStorage.getItem('white') == null && localStorage.getItem('black') == null) {
        localStorage.setItem('white', JSON.stringify(whitePieces));
        localStorage.setItem('black', JSON.stringify(blackPieces));
        localStorage.setItem('turn', 'white');
        AddStartPieces();
    } else {
        AddStartPiecesLocalStorage()
        turn = localStorage.getItem('turn')
    }
    go(turn);
}

//create and display play board "chessBoard"
function createBoard() {
    let parent = document.querySelector("#parent");
    let chessBoard = document.createElement("div");

    chessBoard.id = "chessBoard";

    let primaryCounter = 10;
    do {


        let row = document.createElement("div");
        if ((primaryCounter / 10) % 2 == 0) {
            row.id = "odd";
            row.classList.add("row")
            row.dataset.row = primaryCounter

        } else {
            row.id = "even";
            row.classList.add("row")
            row.dataset.row = primaryCounter
        }


        let secondaryCunter = primaryCounter + 1;

        do {
            let mydiv = document.createElement("div");
            mydiv.id = secondaryCunter;

            if ((primaryCounter / 10) % 2 == 0 && secondaryCunter % 2 != 0) {
                mydiv.classList.add('square');
                mydiv.classList.add('black');
            } else if ((primaryCounter / 10) % 2 == 0 && secondaryCunter % 2 == 0) {
                mydiv.classList.add('square');
                mydiv.classList.add('white');
            } else if ((primaryCounter / 10) % 2 != 0 && secondaryCunter % 2 != 0) {
                mydiv.classList.add('square');
                mydiv.classList.add('white');

            } else if ((primaryCounter / 10) % 2 != 0 && secondaryCunter % 2 == 0) {
                mydiv.classList.add('square');
                mydiv.classList.add('black');
            }

            row.appendChild(mydiv);
            secondaryCunter++;

        }
        while (secondaryCunter <= primaryCounter + 8);


        chessBoard.appendChild(row);
        primaryCounter += 10;
    }
    while (primaryCounter <= 88)
    parent.appendChild(chessBoard);
}

//create and display pieces from local storage
function AddStartPiecesLocalStorage() {

    whitePieces = JSON.parse(localStorage.getItem('white'))
    blackPieces = JSON.parse(localStorage.getItem('black'))

    let square
    for (let elem in whitePieces) {
        square = document.getElementById(whitePieces[elem])
        let piece = document.createElement("div")
        piece.classList.add('piece')
        piece.classList.add('piece-white')
        piece.dataset.numb = elem
        square.appendChild(piece)
    }

    for (let elem in blackPieces) {
        square = document.getElementById(blackPieces[elem])
        let piece = document.createElement("div")
        piece.classList.add('piece')
        piece.classList.add('piece-black')
        piece.dataset.numb = elem
        square.appendChild(piece)
    }
}

//create and display starter pack of pieces
function AddStartPieces() {

    let board = document.querySelector("#chessBoard");
    let rows = board.querySelectorAll('.row')
    let w = 1;
    let b = 1;
    for (let row of rows) {

        if (row.dataset.row == 10 || row.dataset.row == 20) {

            let squares = row.querySelectorAll('.square ')

            for (let square of squares) {
                let piece = document.createElement("div")
                piece.classList.add('piece')
                piece.classList.add('piece-white')
                piece.dataset.numb = w
                w++
                square.appendChild(piece)
            }
        } else if (row.dataset.row == 70 || row.dataset.row == 80) {
            let squares = row.querySelectorAll('.square ')

            for (let square of squares) {
                let piece = document.createElement("div")
                piece.classList.add('piece')
                piece.classList.add('piece-black')
                piece.dataset.numb = b
                b++
                square.appendChild(piece)
            }
        }
    }
}

/* analyze if player have pieces to go with:
        if no - display message of winners
        if player has pieces - contain pieces of current color and call function playerMakesStep
*/
function go(color) {

    let pieces;

    if (color == 'black') {
        if (Object.keys(blackPieces).length !== 0) {
            pieces = document.querySelectorAll('.piece-black')
        } else {
            errorMessage('white wins')
        }

    } else if (color == 'white') {
        if (Object.keys(whitePieces).length !== 0) {
            pieces = document.querySelectorAll('.piece-white')
        } else {
            errorMessage('black wins')
        }
    }
    playerMakesStep(pieces)
}

/*
add event listener for all pieces os current color
*/
function playerMakesStep(pieces) {
    for (let piece of pieces) {
        piece.addEventListener('click', stepsOptionsAll)
    }
}

/*
main options editor
highlight element which is been clicked
if element is white - options goes down in board
if element is black - options goes up in board
then for both if piece sits on the edge of the board (near left or right side) - number of options will be 2(without one diagonal option)
create var 'stepOptions' - with main possible steps
set bufferStep = {
        'color': color of element which is been clicked,
        'id': element Number - of element which is been clicked,
        'prevSquare': place where piece were
    }
create realOptions var and call function 'checkStep' to fix the number of 'stepOptions' and make it more clear
if function 'checkStep' return zero elements to var 'realOptions' - it means that piece can not make a step at all(piece is surrounded in pieces of the same color as that is, or it reach opposite edge of the board)
moveTo(realOptions) - add user option to make a move only for squares that is free of the pieces of the same color
*/
function stepsOptionsAll(event) {
    deleteEventFromOptionSteps()
    let elementNumber = event.target.dataset.numb
    let prevSquare = event.target.parentNode.id
    let squareNumber
    let color
    let stepOptions = new Array()
    highlight(event.target)
    if (event.target.classList.contains('piece-white')) {
        color = 'white'
        squareNumber = whitePieces[`${elementNumber}`]
        if (squareNumber < 80) {
            let option = squareNumber + 10
            stepOptions.push(option)

            if (squareNumber % 10 == 1) {
                stepOptions.push(option + 1)
            } else if (squareNumber % 10 == 8) {
                stepOptions.push(option - 1)
            } else {
                stepOptions.push(option + 1)
                stepOptions.push(option - 1)
            }
        }
    } else if (event.target.classList.contains('piece-black')) {
        color = 'black'
        squareNumber = blackPieces[`${elementNumber}`]

        if (squareNumber > 20) {
            let option = squareNumber - 10
            stepOptions.push(option)

            if (squareNumber % 10 == 1) {
                stepOptions.push(option + 1)
            } else if (squareNumber % 10 == 8) {
                stepOptions.push(option - 1)
            } else {
                stepOptions.push(option + 1)
                stepOptions.push(option - 1)
            }
        }
    }

    bufferStep = {
        'color': color,
        'id': elementNumber,
        'prevSquare': prevSquare
    }

    let realOptions = checkStep(stepOptions, color)


    if (realOptions.length > 0) {
        moveTo(realOptions)
    } else {
        errorMessage('Move not allowed')
    }

}
/*
more clear step Options - piece can not go to any square where is the other piece of the same color
analyze color of piece and choose array to use whitePieces for white color or blackPieces for black color
go through elements of 'stepOptions' and if it contains in whitePieces/blackPieces - delete this option from 'fixedOptions'
return fixedOptions
    */
function checkStep(stepOptions, color) {
    let fixedOptions = stepOptions

    if (color == 'white') {
        for (let squareIndex in stepOptions) {
            if (checkObj(whitePieces, stepOptions[squareIndex])) {
                fixedOptions = fixedOptions.filter(function (f) {
                    return f !== stepOptions[squareIndex]
                })
            }
        }

    }else  if (color == 'black') {
        for (let squareIndex in stepOptions) {
            if (checkObj(blackPieces, stepOptions[squareIndex])) {
                fixedOptions = fixedOptions.filter(function (f) {
                    return f !== stepOptions[squareIndex]
                })
            }
        }
    }
    return fixedOptions
}

/*
add addEventListener and highlight squares where user can make step
 */
function moveTo(op) {
    for (let elem of op) {
        let square = document.getElementById(elem)

        highlight(square)
        square.addEventListener('click', moveOrBiteEnemy)
    }
}

/*
highlight squares or pieces
*/
function highlight(elem) {
    elem.classList.add('red-border')
}
/*
unhighlight all elements on the board
*/
function unhighlight() {
    let chessBoard = document.querySelector('#chessBoard');
    let elements = chessBoard.querySelectorAll('.row .square');
    let pieces = chessBoard.querySelectorAll('.row .square .piece');
    for (let elem of elements) {
        elem.classList.remove('red-border')
    }
    for (let elem of pieces) {
        elem.classList.remove('red-border')
    }
}

/*
if new square is empty - move there element and call function 'realocatePieces' to save changes to object
deleteEvent() and deleteEventFromOptionSteps() - delete all events from board
change turn of game ang call 'go' function with new turn

if new square contains enemy - move there element and call function 'realocatePieces' to save changes to object, eat an enemy figure (delete it from board)
deleteEvent() and deleteEventFromOptionSteps() - delete all events from board
change turn of game ang call 'go' function with new turn
 */
function moveOrBiteEnemy(elem) {
    let newSquare = elem.target
    if (elem.target.classList.contains('piece')) {
        newSquare = elem.target.parentNode
    }
    let movingPiece = bufferStep
    let nextStep
    if (!newSquare.hasChildNodes()) {
        realocatePieces(movingPiece['color'], parseInt(movingPiece['id']), parseInt(newSquare.id))

        if (movingPiece['color'] == 'white') {
            localStorage.setItem('turn', 'black');
            nextStep = 'black'
        } else if (movingPiece['color'] == 'black') {
            localStorage.setItem('turn', 'white');
            nextStep = 'white'
        }
    } else if (newSquare.hasChildNodes()) {

        errorMessage('Good move there!')
        let childId = parseInt(newSquare.firstChild.dataset.numb)
        console.log(childId)
        newSquare.removeChild(newSquare.firstChild);
        if (movingPiece['color'] == 'white') {
            delete blackPieces[childId]

            localStorage.setItem('turn', 'black');
            nextStep = 'black'
        } else if (movingPiece['color'] == 'black') {

            delete whitePieces[childId]

            localStorage.setItem('turn', 'white');
            nextStep = 'white'
        }
        realocatePieces(movingPiece['color'], parseInt(movingPiece['id']), parseInt(newSquare.id))
    }
    deleteEvent()
    go(nextStep)
    deleteEventFromOptionSteps()
}

//realocate piece and save it to localStorage
function realocatePieces(color, movingPiece, newSquare) {

    if (color == 'white') {
        changeObjProp(whitePieces, movingPiece, newSquare, () => {
            localStorage.setItem('white', JSON.stringify(whitePieces));
        });
        localStorage.setItem('black', JSON.stringify(blackPieces));

    } else if (color == 'black') {
        changeObjProp(blackPieces, movingPiece, newSquare, () => {
            localStorage.setItem('black', JSON.stringify(blackPieces));
        });
        localStorage.setItem('white', JSON.stringify(whitePieces));
    }


    let par = document.getElementById(bufferStep['prevSquare'])
    let child = par.firstChild
    let parNew = document.getElementById(newSquare)
    parNew.appendChild(child)

    bufferStep = null
}

//delete event from all squares on the board - for options for player to step
function deleteEventFromOptionSteps() {
    unhighlight()
    let squares = document.querySelectorAll('.square')
    for (let square of squares) {
        square.removeEventListener('click', moveOrBiteEnemy)
    }
}

//delete event from all pieces on the board
function deleteEvent() {
    let pieces = document.querySelectorAll('.piece')
    for (let piece of pieces) {
        piece.removeEventListener('click', stepsOptionsAll)
    }

}
//display a message
function errorMessage(txt) {
    let message = document.querySelector("#message")
    message.innerHTML = txt
    setTimeout("message.innerHTML=' '", 3000);
}
