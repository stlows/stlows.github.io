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
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function randomItem(arr) {
  var rand = getRandomInt(arr.length);
  return arr[rand];
}
var boardToStringSep = "|";
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
      return id === 0 ? this.symbol0 : this.symbol1;
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
      console.log("handle");
      console.log(this.boardPretty());
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
        console.log(msg);
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
        this.setStyle(tiles[x][0], tiles[x][1], winningStyle);
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
      var c1 = board[0][0];
      var c2 = board[0][1];
      var c3 = board[0][2];
      var c4 = board[1][0];
      var c5 = board[1][1];
      var c6 = board[1][2];
      var c7 = board[2][0];
      var c8 = board[2][1];
      var c9 = board[2][2];

      // Horizontal
      if ((c1 !== "") & (c1 === c2) & (c2 === c3)) {
        return { tiles: [[0, 0], [0, 1], [0, 2]], id: c1 };
      }
      if ((c4 !== "") & (c4 === c5) & (c4 === c6)) {
        return { tiles: [[1, 0], [1, 1], [1, 2]], id: c4 };
      }
      if ((c7 !== "") & (c7 === c8) & (c7 === c9)) {
        return { tiles: [[2, 0], [2, 1], [2, 2]], id: c7 };
      }

      // Vertical
      if ((c1 !== "") & (c1 === c4) & (c1 === c7)) {
        return { tiles: [[0, 0], [1, 0], [2, 0]], id: c1 };
      }
      if ((c2 !== "") & (c2 === c5) & (c2 === c8)) {
        return { tiles: [[0, 1], [1, 1], [2, 1]], id: c2 };
      }
      if ((c3 !== "") & (c3 === c6) & (c3 === c9)) {
        return { tiles: [[0, 2], [1, 2], [2, 2]], id: c3 };
      }

      // Diagonal
      if ((c1 !== "") & (c1 === c5) & (c1 === c9)) {
        return { tiles: [[0, 0], [1, 1], [2, 2]], id: c5 };
      }
      if ((c3 !== "") & (c3 === c5) & (c3 === c7)) {
        return { tiles: [[0, 2], [1, 1], [2, 0]], id: c5 };
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
      switch (parseInt(this.difficulty)) {
        case 1:
          this.botLevel1Move();
          break;
        case 2:
          this.botLevel2Move();
          break;
        case 3:
          this.botLevel3Move();
          break;
      }
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
      this.debug("Bot played randomly");
      this.setTile(tile.i, tile.j);
    },
    botLevel2Move() {
      var winPossibility = this.checkWinPossibility(this.currentPlayerId);
      if (winPossibility !== null) {
        this.debug("Bot played to win");
        this.setTile(winPossibility.i, winPossibility.j);
        return;
      }
      var blockPossibility = this.checkWinPossibility(this.otherPlayerId());
      if (blockPossibility !== null) {
        this.debug("Bot played to block a win");
        this.setTile(blockPossibility.i, blockPossibility.j);
        return;
      }

      this.botLevel1Move();
    },
    botLevel3Move() {
      var optimal = this.optimalMove();
      if (optimal === null) {
        this.botLevel2Move();
      } else {
        this.debug("Bot played optimally");
        this.setTile(optimal.i, optimal.j);
      }
    },
    checkWinPossibility(id) {
      var boardCopy = this.getBoardCopy();
      var availableTiles = this.availableTiles(boardCopy);
      for (var x = 0; x < availableTiles.length; x++) {
        var tile = availableTiles[x];
        boardCopy[tile.i][tile.j] = id;
        console.log({ boardCopy, ttt });
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
    debugPossibles(possibleMoves) {
      this.debug(this.getSymbol(this.currentPlayerId));
      this.debug(
        "Board:\n" +
          this.boardPretty(this.currentPlayerId) +
          "\nPossible moves:\n" +
          this.boardPretty(this.currentPlayerId, possibleMoves)
      );
    },
    optimalMove() {
      switch (this.count()) {
        case 0:
          return this.optimal1stMove();
        case 2:
          return this.optimal3rdMove();
        case 4:
          return this.optimal5thMove();
        case 6:
          return this.optimal7thMove();
      }
      return null;
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
        this.debugPossibles(possibles);
        return randomItem(possibles);
      }

      return null;
    },
    optimal3rdMove() {
      var myId = this.currentPlayerId;
      var oponentId = this.otherPlayerId();
      var possibles = [];

      // 1st move in center
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
      // 1st move in corner
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
        this.debugPossibles(possibles);
        return randomItem(possibles);
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
        this.debugPossibles(possibles);
        return randomItem(possibles);
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
        this.debugPossibles(possibles);
        return randomItem(possibles);
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
    boardPretty(id, possibleMoves = null) {
      var boardCopy = this.getBoardCopy();
      if (possibleMoves !== null) {
        possibleMoves.forEach(function(tile) {
          boardCopy[tile.i][tile.j] = id;
        });
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
