$(function(){

    // symbols
    var symbols = "XO"
    var cases = {0:"#case1",1:"#case2",2:"#case3",3:"#case4",4:"#case5",5:"#case6",6:"#case7",7:"#case8",8:"#case9",
                 "case1":0,"case2":1,"case3":2,"case4":3,"case5":4,"case6":5,"case7":6,"case8":7,"case9":8}
    newGame();

    $(".case").on("click", function(){
        $(this).prop("disabled", true).text(symbols[turn]);
        gameStatus[cases[$(this).attr("id")]] = symbols[turn];
        count++;
        turn = Math.abs(turn - 1);
        var verif = tictactoe();
        if(verif){
            $(".case").prop("disabled", true);
            alert(verif);
            newGame()
        }
        difficulty = 1;
        botMoves(gameStatus, difficulty);
    });
    $(".case").on("botMoved", function(){
        $(this).prop("disabled", true).text(symbols[turn]);
        gameStatus[cases[$(this).attr("id")]] = symbols[turn];
        count++;
        turn = Math.abs(turn - 1);
        var verif = tictactoe();
        if(verif){
            $(".case").prop("disabled", true);
            alert(verif);
            newGame()            
        }
    });
    
    $("#newgame").click(function(){
       newGame();
    });

    function newGame(){
        $(".case").prop("disabled", false).text("");
        count = 0;
        gameStatus = ["","","","","","","","",""];
        difficulty = $("#difficulty").val();
        turn = Math.random() < 0.5 ? 0 : 1;
        $("#turn").text(" (" + symbols[turn] + "'s turn)");
        botTurn = $("#player-symbol").val() == "x" ? symbols.indexOf("O") : symbols.indexOf("X");
        if(turn == botTurn){
             botMoves(gameStatus, difficulty);
        }
    }

    function botMoves(gameStatus, difficulty){
        if(difficulty == 1){
            botMoveLevel1(gameStatus);
        }else if(difficulty == 2){
            botMoveLevel2(gameStatus);
        }else if(difficulty == 3){
            botMoveLevel3(gameStatus);
        } 
    }
    function botMoveLevel1(){
        do
            rnd = Math.floor(Math.random() * 9);
        while(gameStatus[rnd] != "");
        $(cases[rnd]).trigger("botMoved");
    }

    function tictactoe(){
        var c1 = $("#case1").text();
        var c2 = $("#case2").text();
        var c3 = $("#case3").text();
        var c4 = $("#case4").text();
        var c5 = $("#case5").text();
        var c6 = $("#case6").text();
        var c7 = $("#case7").text();
        var c8 = $("#case8").text();
        var c9 = $("#case9").text();
        
        // Horizontal
        if(c1 != "" & c1 == c2 & c1 == c3){ return "h1"}
        if(c4 != "" & c4 == c5 & c4 == c6){ return "h2"}
        if(c7 != "" & c7 == c8 & c7 == c9){ return "h3"}

        // Vertical
        if(c1 != "" & c1 == c4 & c1 == c7){ return "v1"}
        if(c2 != "" & c2 == c5 & c2 == c8){ return "v2"}
        if(c3 != "" & c3 == c6 & c3 == c9){ return "v3"}
        
        // Diagonal
        if(c1 != "" & c1 == c5 & c1 == c9){ return "d1"}
        if(c3 != "" & c3 == c5 & c3 == c7){ return "d2"}

        if(count == 9){return "nul"}
        
        return null;
    }
});