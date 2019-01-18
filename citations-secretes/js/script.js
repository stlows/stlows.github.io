$(function(){

    var counter = generateRandomNumber(0, citations.length);
    console.log(citations[counter].citation)
    var timerId = null;

    var clickedIndice = null;

    var nbColonnes = 12;

    initBoard();

    $('#reponse-1').css('background-color', '#000');

    function incrementCounter(){
        counter = (counter + 1) % citations.length;
    }

    $('#btn-change-width').click(function(e){
        e.preventDefault();
        nbColonnes = prompt('Quelle largeur?');
        initBoard();
    });

    function generateRandomNumber(min , max) {
        let random_number = Math.random() * (max-min) + min;
        return Math.floor(random_number);
    }

    $('#btn-new-quote-local').click(function(e){
        e.preventDefault();
        counter = generateRandomNumber(0, citations.length);
        initBoard();
    });

    $('#btn-new-quote').click(function(e){
        e.preventDefault();
        getQuote();
    });

    $('#btn-get-indice').click(function(e){
        e.preventDefault();
        generateNewIndice();
    })

    $('#btn-validate').click(function(e){
        e.preventDefault();
        solutionIsValid();
    });

    $('#success-message').click(function(){
        $(this).fadeOut();
    });

    function initHeader(){
        document.getElementById('auteur').innerHTML = citations[counter].auteur;
        document.getElementById('idCitation').innerHTML = "id: " + counter;
    }

    function initBoard() {

        $('#timer').html("0:00");
        initHeader()

        var colonnes = getColonnes(citations[counter].citation);
        var sortedColonnes = getSortedColonnes(citations[counter].citation);

        var maxIndices = getMaxIndices(colonnes);

        $('#indices').empty();
        $('#reponses').empty();

        for(let i = 0; i < nbColonnes; i++){

            var divIndice = document.createElement('div');
            divIndice.classList.add('col');
            divIndice.classList.add('col--indices');
            divIndice.id = 'col--indices-' + i;

            var divReponse = document.createElement('div');
            divReponse.classList.add('col');
            divReponse.classList.add('col--reponses');
            divReponse.id = 'col--reponses-' + i;

            for(let j = 0; j < sortedColonnes[i].length; j++){
                if(isAlpha(sortedColonnes[i][j])){
                    var spanIndice = document.createElement('span');
                    spanIndice.classList.add('indice');
                    spanIndice.innerHTML = sortedColonnes[i][j].toUpperCase();
                    divIndice.appendChild(spanIndice);
                }
            }

            for(let j = 0; j < colonnes[i].length; j++){
                var spanReponse = document.createElement('span');
                spanReponse.classList.add('reponse');
                if(!isAlpha(colonnes[i][j])){
                    spanReponse.classList.add('space');
                }
                divReponse.appendChild(spanReponse);

            }

            document.getElementById('indices').appendChild(divIndice);
            document.getElementById('reponses').appendChild(divReponse);

            var indicesCourant = sortedColonnes[i].filter(letter => isAlpha(letter)).length;
            $('#col--indices-' + i).css('paddingTop', (maxIndices - indicesCourant) * 3 + 'rem');


        }
        clearInterval(timerId);
        timerId = timer();
        initEvents();
    }


    function timer(){
        var timeStamp = 1;
        var id = setInterval(function(){
            $('#timer').html(getTime(timeStamp));
            timeStamp++;
        }, 1000);
        return id;
    }

    function getTime(sec){
        if(sec < 60) return "0:" + sec.toString().padStart(2, '0');
        else if(sec < 3600) return Math.floor(sec/60).toString() + ':' + (sec % 60).toString().padStart(2, '0');
    }

    /**
     * events that need to be defined only after the board rendering
     * @return null
     */
    function initEvents(){
        var cursor = document.getElementById('custom-cursor');
        $("body").mousemove(function(e) {
            cursor.style.left = e.pageX-12+"px";
            cursor.style.top = e.pageY-20+"px";
        });

        $('.indice').mousedown(function(e){
            e.preventDefault();

            if (!$(this).hasClass('striked')) {
                $("#custom-cursor").html($(this).html());
                $("#custom-cursor").removeClass("d-none");

                $('.indice').attr("id","");
                $(this).attr("id","indice--selected");
                clickedIndice = $(this);
            }

        });

        $('.reponse').mouseup(function(e){
            e.preventDefault();
            if (!$(this).hasClass('space')){
                var reponseParentID = $(this).parent().attr("id");
                var reponseSplitted = reponseParentID.split('-');
                var reponseNb = reponseSplitted[reponseSplitted.length - 1];

                if ($.trim($(this).html())!='') { // if the element is not empty
                    // un-strike the indice
                    var colIndices = $("#col--indices-"+reponseNb).children();
                    console.log(reponseNb);
                    for (i = 0; i < colIndices.length ; i++){
                        console.log(colIndices[i].innerHTML);
                        if (colIndices[i].innerHTML == $(this).html()){
                            if (colIndices[i].classList.contains('striked')) {
                                colIndices[i].classList.remove('striked');
                                break;
                            }
                        }
                    }
                }

                $(this).empty();

                if (clickedIndice) {
                    if (sameColumn(clickedIndice,$(this))){
                        $(this).html(clickedIndice.html());
                        clickedIndice.addClass('striked');
                    }
                }
            }

            $('.indice').attr("id","");
            clickedIndice = null;
        });

        $("body").mouseup(function(e){
            $("#custom-cursor").addClass("d-none");
        });

        $('.reponse').on('DOMSubtreeModified',function(e){
            if (solutionIsValid()){
                clearInterval(timerId);
                $('#success-message').animate({
                    height: 'toggle'
                }, 1000, function() {});
            }
        });

    }

    function getColonnes(citation){
        var colonnes = [];
        for(var i = 0; i < nbColonnes; i++){
            var colonne = citation.split('').filter((letter, index) => index % nbColonnes == i);
            colonnes.push(colonne);
        }
        return colonnes;
    }

    function getSortedColonnes(citation){
        var sortedColonnes = [];

        for(var i = 0; i < nbColonnes; i++){
            var colonne = citation.split('').filter((letter, index) => index % nbColonnes == i);
            sortedColonnes.push(colonne.sort());
        }
        return sortedColonnes;
    }

    function isAlpha(ch){
        return typeof ch === "string" && ch.length === 1
        && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
    }

    function getMaxIndices(colonnes) {
        var maxIndices = 0;
        for(let i = 0;i < colonnes.length; i++){
            var indicesCourant = colonnes[i].filter(letter => isAlpha(letter)).length;
            if(indicesCourant > maxIndices) {
                maxIndices = indicesCourant;
            }
        }
        return maxIndices;
    }

    function generateNewIndice(){
        var rndIndex, rndValue;
        var colIndex, rowIndex;
        var indices, indice, reponse;
        if (gridIsCompleted()) {
            return;
        }
        do {
            do {
                rndIndex = Math.floor(Math.random() * citations[counter].citation.length);
                rndValue = citations[counter].citation[rndIndex].toUpperCase();
                colIndex = rndIndex % nbColonnes;
                rowIndex = Math.floor(rndIndex / nbColonnes);
                reponse = $('#col--reponses-'+colIndex).children()[rowIndex];
            } while(rndValue == " " || reponse.classList.contains('space') || reponse.innerHTML.length);
            indices = $('#col--indices-'+colIndex).children();
            for (let i = 0; i < indices.length; i++){
                if (indices[i].innerHTML == rndValue
                    && !indices[i].classList.contains('striked')) {
                    indice = indices[i];
                }
            }
        } while (!indice || indice.classList.contains('striked'));
        reponse.innerHTML = indice.innerHTML;
        indice.classList.add('striked');
    }

    function getQuote(){
        $('#spinner').removeClass('d-none');
        $('#btn-new-quote').addClass('not-active');

        $.ajax( {
            url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',
            error: function(error) {
                $('#invalid-feedback').html('Erreur lors de la recherche de citation')
                $('#spinner').addClass('d-none');
                $('#btn-new-quote').removeClass('not-active');
            },
            success: function(data) {
                var post = data.shift(); // The data is an array of posts. Grab the first one.
                if (post.content.length > 70 || post.content.length < 30) {
                    getQuote();
                } else {
                    $('#spinner').addClass('d-none');
                    $('#btn-new-quote').removeClass('not-active');
                    var quote = formatQuote(post.content);

                    counter = citations.push({
                        'auteur' : post.title,
                        'citation' : quote
                    }) - 1;

                    initBoard();

                    // $('#quote-title').text(post.title);
                    // $('#quote-content').html(quote);
                    // // If the Source is available, use it. Otherwise hide it.
                    // if (typeof post.custom_meta !== 'undefined' && typeof post.custom_meta.Source !== 'undefined') {
                    //     $('#quote-source').html('Source:' + post.custom_meta.Source);
                    // } else {
                    //     $('#quote-source').text('');
                    // }


                }
            },
            cache: false,
            type: 'get'
        });
    }

    function formatQuote(quote) {
        // removes html tags
        quote = quote.replace(/<\/?[^>]+(>|$)|\./g, "")

        // replaces - ' _ # — , & ; ASCII by spaces
        quote = quote.replace(/#|_|-|'|—|,|&|;\d+/g,' ');

        // removes \n and \r
        quote = quote.replace(/\r?\n|\r/g, '');

        // replaces double spaces by simple space
        quote = quote.replace(/ +(?= )/g,'');

        return quote;
    }

    function sameColumn(indice, reponse) {
        var indiceParentID = indice.parent().attr("id");
        var indiceNb = indiceParentID.substr(indiceParentID.length - 1);
        var reponseParentID = reponse.parent().attr("id");
        var reponseNb = reponseParentID.substr(reponseParentID.length - 1);
        if (indiceNb == reponseNb) { // in same column
            return true;
        }
        return false;
    }

    function gridIsCompleted() {
        var col;
        for(let i=0; i < nbColonnes; i++){
            colChildren = $('#col--reponses-'+i).children();
            for(let j=0; j < colChildren.length; j++){
                if (!colChildren[j].classList.contains('space')){
                    if (colChildren[j].innerHTML.length === 0){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function solutionIsValid(){
        var col;
        for(let i=0; i < nbColonnes; i++){
            colReponses = $('#col--reponses-'+i).children();
            for(let j=0; j < colReponses.length; j++){
                if (!colReponses[j].classList.contains('space')){
                    if (colReponses[j].innerHTML.length === 0
                    || colReponses[j].innerHTML != citations[counter].citation[j*nbColonnes+i].toUpperCase()){
                        return false;
                    }
                }
            }
        }
        return true;
    }
});
