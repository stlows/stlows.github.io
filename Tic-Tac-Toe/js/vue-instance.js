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
function optimalMove(board, myId, oponentId) {
  // Si on commence
  // 1st move
  if (isSameBoard(board, [["", "", ""], ["", "", ""], ["", "", ""]]))
    return { i: 1, j: 1 };
  // 3rd move
  if (isSameBoard(board, [[oponentId, "", ""], ["", myId, ""], ["", "", ""]]))
    return { i: 2, j: 2 };
  if (isSameBoard(board, [["", oponentId, ""], ["", myId, ""], ["", "", ""]]))
    return { i: 2, j: 0 };
  if (isSameBoard(board, [["", "", oponentId], ["", myId, ""], ["", "", ""]]))
    return { i: 2, j: 0 };
  if (isSameBoard(board, [["", "", ""], [oponentId, myId, ""], ["", "", ""]]))
    return { i: 2, j: 2 };
  if (isSameBoard(board, [["", "", ""], ["", myId, oponentId], ["", "", ""]]))
    return { i: 0, j: 0 };
  if (isSameBoard(board, [["", "", ""], ["", myId, ""], [oponentId, "", ""]]))
    return { i: 0, j: 2 };
  if (isSameBoard(board, [["", "", ""], ["", myId, ""], ["", oponentId, ""]]))
    return { i: 0, j: 2 };
  if (isSameBoard(board, [["", "", ""], ["", myId, ""], ["", "", oponentId]]))
    return { i: 0, j: 0 };

  // 5th move
  if (
    isSameBoard(board, [
      [oponentId, "", ""],
      ["", myId, ""],
      ["", oponentId, myId]
    ])
  )
    return { i: 0, j: 2 };
  if (
    isSameBoard(board, [
      [oponentId, "", ""],
      ["", myId, oponentId],
      ["", "", myId]
    ])
  )
    return { i: 2, j: 0 };
  if (
    isSameBoard(board, [
      ["", "", oponentId],
      [oponentId, myId, ""],
      [myId, "", ""]
    ])
  )
    return { i: 2, j: 2 };
  if (
    isSameBoard(board, [
      ["", "", oponentId],
      ["", myId, ""],
      [myId, oponentId, ""]
    ])
  )
    return { i: 0, j: 0 };
  if (
    isSameBoard(board, [
      ["", "", myId],
      ["", myId, oponentId],
      [oponentId, "", ""]
    ])
  )
    return { i: 0, j: 0 };
  if (
    isSameBoard(board, [
      ["", oponentId, myId],
      ["", myId, ""],
      [oponentId, "", ""]
    ])
  )
    return { i: 2, j: 2 };
  if (
    isSameBoard(board, [
      [myId, oponentId, ""],
      ["", myId, ""],
      ["", "", oponentId]
    ])
  )
    return { i: 2, j: 0 };
  if (
    isSameBoard(board, [
      [myId, "", ""],
      [oponentId, myId, ""],
      ["", "", oponentId]
    ])
  )
    return { i: 0, j: 2 };

  // 7th move
  if (
    isSameBoard(board, [
      [oponentId, myId, oponentId],
      ["", myId, ""],
      ["", oponentId, myId]
    ])
  )
    return { i: 1, j: 0 };
  if (
    isSameBoard(board, [
      [oponentId, "", ""],
      [myId, myId, oponentId],
      [oponentId, "", myId]
    ])
  )
    return { i: 0, j: 1 };
  if (
    isSameBoard(board, [
      ["", "", oponentId],
      [oponentId, myId, myId],
      [myId, "", oponentId]
    ])
  )
    return { i: 2, j: 1 };
  if (
    isSameBoard(board, [
      [oponentId, myId, oponentId],
      ["", myId, ""],
      [myId, "", oponentId]
    ])
  )
    return { i: 1, j: 2 };
  if (
    isSameBoard(board, [
      [myId, "", oponentId],
      [oponentId, myId, myId],
      ["", "", oponentId]
    ])
  )
    return { i: 2, j: 1 };
  if (
    isSameBoard(board, [
      [myId, oponentId, ""],
      ["", myId, ""],
      [oponentId, myId, oponentId]
    ])
  )
    return { i: 1, j: 2 };
  if (
    isSameBoard(board, [
      ["", oponentId, myId],
      ["", myId, ""],
      [oponentId, myId, oponentId]
    ])
  )
    return { i: 1, j: 0 };
  if (
    isSameBoard(board, [
      [oponentId, "", myId],
      [myId, myId, oponentId],
      [oponentId, "", ""]
    ])
  )
    return { i: 0, j: 1 };

  return null;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
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
    myDebug: false,
    difficulty: 3,
    type: "CH",
    timeoutId: null,
    delay: 500,
    showSettings: false
  },
  methods: {
    getSymbol(id) {
      if (id === "") return "";
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
        this.logs.splice(0, 0, msg);
      }
    },
    log(msg) {
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
      clearInterval(this.timeoutId);
      this.clearBoard();
      this.resetStyle();
      this.currentPlayerId = 0;
      this.disableAll = false;
      if (this.isBot(0)) {
        this.botMove();
      }
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
      var rand = getRandomInt(availableTiles.length);
      var tile = availableTiles[rand];
      this.debug("Bot played randomly");
      this.setTile(tile.i, tile.j);
    },
    botLevel2Move() {
      var boardCopy = this.getBoardCopy();
      var availableTiles = this.availableTiles(boardCopy);
      for (var x = 0; x < availableTiles.length; x++) {
        var tile = availableTiles[x];
        // Check if bot can win
        boardCopy[tile.i][tile.j] = this.currentPlayerId;
        var ttt = this.checkTicTacToe(boardCopy);
        if (ttt !== null && ttt.id === this.currentPlayerId) {
          this.debug("Bot played to win");
          this.setTile(tile.i, tile.j);
          return;
        }
        boardCopy[tile.i][tile.j] = "";
      }
      for (var x = 0; x < availableTiles.length; x++) {
        var tile = availableTiles[x];
        // Check if bot can block a win
        boardCopy[tile.i][tile.j] = this.otherPlayerId();
        var ttt = this.checkTicTacToe(boardCopy);
        if (ttt !== null && ttt.id === this.otherPlayerId()) {
          this.debug("Bot played to block a win");
          this.setTile(tile.i, tile.j);
          return;
        }
        boardCopy[tile.i][tile.j] = "";
      }
      this.botLevel1Move();
    },
    botLevel3Move() {
      var boardCopy = this.getBoardCopy();

      var optimal = optimalMove(
        boardCopy,
        this.currentPlayerId,
        this.otherPlayerId()
      );
      if (optimal === null) {
        this.botLevel2Move();
      } else {
        this.debug("Bot played optimally");
        this.setTile(optimal.i, optimal.j);
      }
    },
    checkWinPossibility() {},
    checkBlockPossibility() {},
    getBoardCopy() {
      var newArray = [];
      for (var i = 0; i < 3; i++) {
        newArray[i] = this.board[i].slice();
      }
      return newArray;
    }
  },
  created: function() {
    this.newRound();
  }
});
