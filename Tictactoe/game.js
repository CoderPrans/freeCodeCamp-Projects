/*jshint esversion: 6 */
var board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
var p; // humanPlayer
var q; // aiPlayer
var winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];

$(".entry").click(function() {
  if ($(this).val() == "X") {
    p = "X";
    q = "O";
  } else {
    p = "O";
    q = "X";
  }
  $(".input").css("display", "none");
  $("#reset").css("display", "block");
});

$(".box").click(function() {
  if (!checkWin(board, p) && !checkWin(board, q)) {
    var boxIndex = $(this).data("i");
    if (board[boxIndex] === " " && $("#" + boxIndex).html() === " ") {
      fillIt(boxIndex, p);
      aifill();
    }
  }
  checkTie(board);
});

function aifill() {
  if (!checkWin(board, p)) {
    fillIt(bestSpot(), q);
    checkWin(board, q);
  }
}

function fillIt(index, player) {
  if (p && q) {
    board[index] = player;
    $("#" + index).html(player);
    let gameWon = checkWin(board, player);
    if (gameWon) {
      gameOver(gameWon);
    }
  }
}

function availSpots(arr) {
  var indArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === " ") {
      indArr.push(i);
    }
  }
  return indArr;
}

$("#reset").click(function() {
  board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  $(".box").html(" ");
  $(".box").css("background-color", "lavenderblush");
  $(".result").html("");
  p = null;
  q = null;
  $(".input").css("display", "block");
  $("#reset").css("display", "none");
  $(".result").css("display", "none");
});

function checkWin(newBoard, player) {
  let plays = newBoard.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {
        index: index,
        player: player
      };
      break;
    }
  }
  return gameWon;
}

function checkTie() {
  if (availSpots(board).length === 0) {
    $(".box").css("background-color", "green");
    declareWinner("Game Tied");
    return true;
  }
  return false;
}

function gameOver(gameWon) {
  for (var index of winCombos[gameWon.index]) {
    $("#" + index).css("background-color", gameWon.player == p ? "blue" : "red");
  }
  declareWinner(gameWon.player == p ? "You win!" : "You lose.");
}

function declareWinner(who) {
  $(".result").css("display", "block");
  $(".result").text(who);
}


//////////////// ...........minimax begins.......... ////////////////////

function bestSpot() {
  return minimax(board, q).index;
}

function minimax(newBoard, player) {
  var availIndex = availSpots(newBoard);
  // depth is zero, terminal node reached...
  if (checkWin(newBoard, p)) {
    return {
      score: -10
    };
  } else if (checkWin(newBoard, q)) {
    return {
      score: 10
    };
  } else if (availIndex.length === 0) {
    return {
      score: 0
    };
  } else {

    // game is on ....
    var movesList = [];
    for (var i = 0; i < availIndex.length; i++) {
      var boardCopy = newBoard.slice(0);
      boardCopy[availIndex[i]] = player;
      var move = {};
      var result;
      move.index = availIndex[i];
      if (player == p) {
        result = minimax(boardCopy, q);
        move.score = result.score;
      } else if (player == q) {
        result = minimax(boardCopy, p);
        move.score = result.score;
      }
      movesList.push(move);
    }

    var bestMove;
    if (player == p) {
      var minvalue = 10000;
      for (var j = 0; j < movesList.length; j++) {
        if (movesList[j].score < minvalue) {
          minvalue = movesList[j].score;
          bestMove = j;
        }
      }
    } else if (player == q) {
      var maxvalue = -10000;
      for (var k = 0; k < movesList.length; k++) {
        if (movesList[k].score > maxvalue) {
          maxvalue = movesList[k].score;
          bestMove = k;
        }
      }
    }
    return movesList[bestMove];
  }
}



// $(".check").click(function() {
//   $(".checksp").text(availSpots(board));
// });
