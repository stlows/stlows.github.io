// CONSTANTS
var defaultStyle = {
  backgroundColor: "white",
  color: "black"
};
var winningStyle = {
  backgroundColor: "green",
  color: "white"
};
var hoverStyle = {
  color: "#bbbbbb"
};
var tieStyle = {
  backgroundColor: "red",
  color: "white"
};
var boardToStringSep = "|";
// SYMETRIES
var symetries = {
  n: symetryN,
  x: symetryX,
  y: symetryY,
  xy: symetryXY,
  d: symetryD,
  dx: symetryDX,
  dy: symetryDY,
  dxy: symetryDXY
};
var inverseSymetries = {
  n: symetryN,
  x: symetryX,
  y: symetryY,
  xy: symetryXY,
  d: symetryD,
  dx: symetryXD,
  dy: symetryYD,
  dxy: symetryXYD
};
function symetryN(i, j) {
  return { i: i, j: j };
}
function symetryX(i, j) {
  switch (j) {
    case 0:
      return { i: i, j: 2 };
    case 1:
      return { i: i, j: 1 };
    case 2:
      return { i: i, j: 0 };
  }
}
function symetryY(i, j) {
  switch (i) {
    case 0:
      return { i: 2, j: j };
    case 1:
      return { i: 1, j: j };
    case 2:
      return { i: 0, j: j };
  }
}
function symetryXY(i, j) {
  var symX = symetryX(i, j);
  return symetryY(symX.i, symX.j);
}
function symetryD(i, j) {
  return { i: j, j: i };
}
function symetryDX(i, j) {
  var symD = symetryD(i, j);
  return symetryX(symD.i, symD.j);
}
function symetryXD(i, j) {
  var symX = symetryX(i, j);
  return symetryD(symX.i, symX.j);
}
function symetryDY(i, j) {
  var symD = symetryD(i, j);
  return symetryY(symD.i, symD.j);
}
function symetryYD(i, j) {
  var symY = symetryY(i, j);
  return symetryD(symY.i, symY.j);
}
function symetryDXY(i, j) {
  var symD = symetryD(i, j);
  return symetryXY(symD.i, symD.j);
}
function symetryXYD(i, j) {
  var symXY = symetryXY(i, j);
  return symetryD(symXY.i, symXY.j);
}
var tileNames = [
  ["top left", "top center", "top right"],
  ["middle left", "middle center", "middle right"],
  ["bottom left", "bottom center", "bottom right"]
];
var winningLines = [
  [{ i: 0, j: 0 }, { i: 0, j: 1 }, { i: 0, j: 2 }], // top
  [{ i: 1, j: 0 }, { i: 1, j: 1 }, { i: 1, j: 2 }], // middle
  [{ i: 2, j: 0 }, { i: 2, j: 1 }, { i: 2, j: 2 }], // bottom
  [{ i: 0, j: 0 }, { i: 1, j: 0 }, { i: 2, j: 0 }], // left
  [{ i: 0, j: 1 }, { i: 1, j: 1 }, { i: 2, j: 1 }], // center
  [{ i: 0, j: 2 }, { i: 1, j: 2 }, { i: 2, j: 2 }], // right
  [{ i: 0, j: 0 }, { i: 1, j: 1 }, { i: 2, j: 2 }], // diago 1
  [{ i: 0, j: 2 }, { i: 1, j: 1 }, { i: 2, j: 0 }] // diago 2
];

// BOARD COMPARE
function isSameBoard(board1, bord2) {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board1[i][j] !== bord2[i][j]) {
        return false;
      }
    }
  }
  return true;
}
function getSymetricBoard(board, symFunc) {
  var newBoard = [["", "", ""], ["", "", ""], ["", "", ""]];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      var symetry = symFunc(i, j);
      newBoard[i][j] = board[symetry.i][symetry.j];
    }
  }
  return newBoard;
}
function isSameSymetricBoard(board1, board2) {
  for (symetry in symetries) {
    var symetricBoard = getSymetricBoard(board2, symetries[symetry]);
    if (isSameBoard(board1, symetricBoard)) {
      return symetry;
    }
  }
  return null;
}

// RANDOM
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function randomItem(arr) {
  var rand = getRandomInt(arr.length);
  return arr[rand];
}

// STYLED CONSOLE
function styledConsoleLog() {
  var argArray = [];

  if (arguments.length) {
    var startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>/gi;
    var endTagRe = /<\/span>/gi;

    var reResultArray;
    argArray.push(
      arguments[0].replace(startTagRe, "%c").replace(endTagRe, "%c")
    );
    while ((reResultArray = startTagRe.exec(arguments[0]))) {
      argArray.push(reResultArray[2]);
      argArray.push("");
    }
    for (var j = 1; j < arguments.length; j++) {
      argArray.push(arguments[j]);
    }
  }

  console.log.apply(console, argArray);
}

var app = new Vue({
  el: "#app",
  data: {
    symbol0: "X",
    symbol1: "O",
    scores: [0, 0],
    tiesCount: 0,
    board: [["", "", ""], ["", "", ""], ["", "", ""]],
    styles: [
      [defaultStyle, defaultStyle, defaultStyle],
      [defaultStyle, defaultStyle, defaultStyle],
      [defaultStyle, defaultStyle, defaultStyle]
    ],
    logs: [],
    disableAll: false,
    currentPlayerId: 0,
    myDebug: true,
    difficulty: 3,
    type: "CH",
    timeoutId: null,
    delay: 500,
    showSettings: false
  },
  methods: {
    getSymbol(id) {
      if (id === "") return " ";
      if (id === 0) return this.symbol0;
      if (id === 1) return this.symbol1;
      return id;
    },
    currentPlayer() {
      return this.getSymbol(this.currentPlayerId);
    },
    otherPlayer() {
      return this.getSymbol(this.otherPlayerId());
    },
    otherPlayerId() {
      return (this.currentPlayerId + 1) % 2;
    },
    nextPlayer() {
      this.currentPlayerId = this.otherPlayerId();
    },
    setValue(x, y, val) {
      var newLine = this.board[x];
      newLine.splice(y, 1, val);
      this.board.splice(x, 1, newLine);
    },
    setStyle(x, y, style) {
      var newLine = this.styles[x];
      newLine.splice(y, 1, style);
      this.styles.splice(x, 1, newLine);
    },
    setTile(x, y) {
      if (this.disableAll) return;
      if (this.board[x][y] === this.otherPlayerId()) return;
      this.setValue(x, y, this.currentPlayerId);
      this.setStyle(x, y, defaultStyle);
      this.handleTicTacToe();
    },
    handleTicTacToe() {
      var ttt = this.checkTicTacToe(this.board);
      if (ttt !== null) {
        if (ttt === "tie") {
          this.tie();
        } else {
          this.win(ttt);
        }
      } else {
        this.nextPlayer();
        if (this.isBot(this.currentPlayerId)) {
          this.botMove();
        }
      }
    },
    debug(msg) {
      if (this.myDebug) {
        styledConsoleLog(msg);
      }
    },
    log(msg) {
      this.debug(msg);
      this.logs.splice(0, 0, msg);
    },
    win(ttt) {
      this.log(this.getSymbol(ttt.id) + " wins the round.");
      this.scores[this.currentPlayerId]++;
      this.disableAll = true;
      this.colorWinner(ttt.tiles);
      this.timeoutId = setTimeout(this.newRound, this.delay);
    },
    tie() {
      this.log("Round is a tie.");
      this.tiesCount++;
      this.disableAll = true;
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          this.setStyle(i, j, tieStyle);
        }
      }
      this.timeoutId = setTimeout(this.newRound, this.delay);
    },
    hoverInTile(x, y) {
      if (this.disableAll) return;
      if (this.board[x][y] !== "") return;
      this.setValue(x, y, this.currentPlayerId);
      this.setStyle(x, y, hoverStyle);
    },
    hoverOutTile(x, y) {
      if (this.disableAll) return;
      if (this.styles[x][y] !== hoverStyle) return;
      this.setValue(x, y, "");
      this.setStyle(x, y, defaultStyle);
    },
    colorWinner(tiles) {
      for (var x = 0; x < 3; x++) {
        this.setStyle(tiles[x].i, tiles[x].j, winningStyle);
      }
    },
    clearBoard() {
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          this.setValue(i, j, "");
        }
      }
    },
    resetStyle() {
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          this.setStyle(i, j, defaultStyle);
        }
      }
    },
    newRound() {
      this.debug("New Round");
      clearInterval(this.timeoutId);
      this.clearBoard();
      this.resetStyle();
      this.currentPlayerId = 0;
      this.disableAll = false;
      if (this.isBot(0)) {
        this.botMove();
      }
    },
    newGame() {
      this.debug("New Game");
      this.scores = [0, 0];
      this.tiesCount = 0;
      this.logs = [];
      this.newRound();
    },
    count() {
      var count = 0;
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          if (this.board[i][j] !== "") {
            count++;
          }
        }
      }
      return count;
    },
    checkTicTacToe(board) {
      for (var n = 0; n < winningLines.length; n++) {
        var winningLine = winningLines[n];
        var v1 = board[winningLine[0].i][winningLine[0].j];
        var v2 = board[winningLine[1].i][winningLine[1].j];
        var v3 = board[winningLine[2].i][winningLine[2].j];
        if ((v1 !== "") & (v1 === v2) & (v2 === v3)) {
          return { tiles: winningLine, id: v1 };
        }
      }

      if (this.count() === 9) {
        return "tie";
      }

      return null;
    },
    isBot(id) {
      return this.type.split("")[id] === "C";
    },
    botMove() {
      var move;
      switch (parseInt(this.difficulty)) {
        case 1:
          move = this.botLevel1Move();
          break;
        case 2:
          move = this.botLevel2Move();
          break;
        case 3:
          move = this.botLevel3Move();
          break;
      }
      this.debug(
        move.explanation + " in " + tileNames[move.tile.i][move.tile.j] + "."
      );
      this.setTile(move.tile.i, move.tile.j);
      this.debug("New board:\n" + this.boardPretty());
    },
    availableTiles(board) {
      var availableTiles = [];
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          if (board[i][j] === "") {
            availableTiles.push({ i, j });
          }
        }
      }
      return availableTiles;
    },
    botLevel1Move() {
      var availableTiles = this.availableTiles(this.board);
      var tile = randomItem(availableTiles);
      return {
        explanation: "Bot played randomly",
        tile: tile
      };
    },
    botLevel2Move() {
      var winPossibility = this.checkWinPossibility(this.currentPlayerId);
      console.log(winPossibility);
      if (winPossibility !== null) {
        return {
          explanation: "Bot played to win",
          tile: winPossibility
        };
      }
      var blockPossibility = this.checkWinPossibility(this.otherPlayerId());
      if (blockPossibility !== null) {
        return {
          explanation: "Bot played to block a win",
          tile: blockPossibility
        };
      }

      return this.botLevel1Move();
    },
    botLevel3Move() {
      var optimal = this.optimalMove();
      if (optimal === null) {
        return this.botLevel2Move();
      } else {
        var msg = "Bot's turn\n";
        msg += "Board:\n";
        msg += this.boardPretty() + "\n";
        msg += "Possible moves (colored):\n";
        msg += this.boardPretty(optimal);
        var randomTile = randomItem(optimal);
        msg += "Bot played optimally";
        return {
          explanation: msg,
          tile: randomTile
        };
      }
    },
    checkWinPossibility(id) {
      var boardCopy = this.getBoardCopy();
      var availableTiles = this.availableTiles(boardCopy);
      for (var x = 0; x < availableTiles.length; x++) {
        var tile = availableTiles[x];
        boardCopy[tile.i][tile.j] = id;
        var ttt = this.checkTicTacToe(boardCopy);
        if (ttt !== null && ttt.id === id) {
          return { i: tile.i, j: tile.j };
        }
        boardCopy[tile.i][tile.j] = "";
      }
      return null;
    },
    getBoardCopy() {
      var newArray = [];
      for (var i = 0; i < 3; i++) {
        newArray[i] = this.board[i].slice();
      }
      return newArray;
    },
    optimalMove() {
      var move = null;
      switch (this.count()) {
        case 0:
          move = this.optimal1stMove();
          break;
        case 2:
          move = this.optimal3rdMove();
          break;
        case 4:
          move = this.optimal5thMove();
          break;
        case 6:
          move = this.optimal7thMove();
          break;
      }
      return move;
    },
    optimal1stMove() {
      if (
        isSameSymetricBoard(this.board, [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""]
        ])
      ) {
        var possibles = [
          { i: 0, j: 0 },
          { i: 0, j: 2 },
          { i: 2, j: 0 },
          { i: 2, j: 2 },
          { i: 1, j: 1 }
        ];
        return possibles;
      }

      return null;
    },
    optimal3rdMove() {
      var myId = this.currentPlayerId;
      var oponentId = this.otherPlayerId();
      var possibles = [];

      if (
        (sym = isSameSymetricBoard(this.board, [
          [oponentId, "", ""],
          ["", myId, ""],
          ["", "", ""]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](2, 2));
      }
      if (
        (sym = isSameSymetricBoard(this.board, [
          ["", oponentId, ""],
          ["", myId, ""],
          ["", "", ""]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](0, 0));
        possibles.push(inverseSymetries[sym](0, 2));
        possibles.push(inverseSymetries[sym](1, 0));
        possibles.push(inverseSymetries[sym](1, 2));
        possibles.push(inverseSymetries[sym](2, 0));
        possibles.push(inverseSymetries[sym](2, 2));
      }
      if (
        (sym = isSameSymetricBoard(this.board, [
          [myId, oponentId, ""],
          ["", "", ""],
          ["", "", ""]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](1, 0));
        possibles.push(inverseSymetries[sym](1, 1));
        possibles.push(inverseSymetries[sym](2, 0));
      }
      if (
        (sym = isSameSymetricBoard(this.board, [
          [myId, "", oponentId],
          ["", "", ""],
          ["", "", ""]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](1, 0));
        possibles.push(inverseSymetries[sym](2, 0));
        possibles.push(inverseSymetries[sym](2, 2));
      }
      if (
        (sym = isSameSymetricBoard(this.board, [
          [myId, "", ""],
          ["", oponentId, ""],
          ["", "", ""]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](2, 2));
      }
      if (
        (sym = isSameSymetricBoard(this.board, [
          [myId, "", ""],
          ["", "", oponentId],
          ["", "", ""]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](1, 1));
        possibles.push(inverseSymetries[sym](2, 0));
      }
      if (
        (sym = isSameSymetricBoard(this.board, [
          [myId, "", ""],
          ["", "", ""],
          ["", "", oponentId]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](0, 2));
        possibles.push(inverseSymetries[sym](2, 0));
      }

      if (possibles.length > 0) {
        return possibles;
      }

      return null;
    },
    optimal5thMove() {
      var myId = this.currentPlayerId;
      var oponentId = this.otherPlayerId();
      var possibles = [];

      if (
        (sym = isSameSymetricBoard(this.board, [
          [oponentId, "", ""],
          ["", myId, oponentId],
          ["", "", myId]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](2, 0));
        possibles.push(inverseSymetries[sym](2, 1));
      }
      if (
        (sym = isSameSymetricBoard(this.board, [
          [myId, oponentId, ""],
          ["", myId, ""],
          ["", "", oponentId]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](1, 0));
        possibles.push(inverseSymetries[sym](2, 0));
      }
      if (
        (sym = isSameSymetricBoard(this.board, [
          ["", oponentId, ""],
          [myId, myId, oponentId],
          ["", "", ""]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](0, 0));
        possibles.push(inverseSymetries[sym](2, 0));
      }
      if (
        (sym = isSameSymetricBoard(this.board, [
          [myId, oponentId, ""],
          [myId, "", ""],
          [oponentId, "", ""]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](1, 1));
      }
      if (
        (sym = isSameSymetricBoard(this.board, [
          [myId, oponentId, ""],
          ["", myId, ""],
          ["", "", oponentId]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](1, 0));
        possibles.push(inverseSymetries[sym](2, 0));
      }
      if (
        (sym = isSameSymetricBoard(this.board, [
          [myId, oponentId, ""],
          [oponentId, "", ""],
          [myId, "", ""]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](1, 1));
        possibles.push(inverseSymetries[sym](2, 2));
      }
      if (
        (sym = isSameSymetricBoard(this.board, [
          [myId, "", oponentId],
          [oponentId, "", ""],
          [myId, "", ""]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](2, 2));
      }
      if (
        (sym = isSameSymetricBoard(this.board, [
          [myId, oponentId, myId],
          ["", "", ""],
          ["", "", oponentId]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](2, 0));
      }

      if (possibles.length > 0) {
        return possibles;
      }

      return null;
    },
    optimal7thMove() {
      var myId = this.currentPlayerId;
      var oponentId = this.otherPlayerId();
      var possibles = [];
      if (
        (sym = isSameSymetricBoard(this.board, [
          [oponentId, myId, oponentId],
          ["", myId, ""],
          ["", oponentId, myId]
        ]))
      ) {
        possibles.push(inverseSymetries[sym](1, 0));
        possibles.push(inverseSymetries[sym](1, 2));
      }

      if (possibles.length > 0) {
        return possibles;
      }

      return null;
    },
    boardToStringLine(line) {
      return (
        this.getSymbol(line[0]) +
        boardToStringSep +
        this.getSymbol(line[1]) +
        boardToStringSep +
        this.getSymbol(line[2]) +
        "\n"
      );
    },
    boardPretty(possibleMoves = null) {
      var boardCopy = this.getBoardCopy();
      if (possibleMoves !== null) {
        for (var x = 0; x < possibleMoves.length; x++) {
          var tile = possibleMoves[x];
          boardCopy[tile.i][tile.j] =
            "<span style='color:blue; font-weight:bold;'>" +
            this.getSymbol(this.currentPlayerId) +
            "</span>";
        }
      }
      var result = this.boardToStringLine(boardCopy[0]);
      result += this.boardToStringLine(boardCopy[1]);
      result += this.boardToStringLine(boardCopy[2]);
      return result;
    }
  },
  created: function() {
    this.newRound();
  }
});
