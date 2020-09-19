let importData;
let playerNames = new Set();

function setup() {
    $("#slImportButton").click(function () {
        $("#slImport").trigger("click");
    });
    $("#slSearchSongName").on("input", function (event) {
        searchSongName($(this).val());
    });
    $("#slSearchArtist").on("input", function (event) {
        searchArtist($(this).val());
    });
    $("#slSearchAnime").on("input", function (event) {
        searchAnime($(this).val());
    });
    $(".filterCheckbox").click(function () {
        if ($(this).hasClass("unchecked")) {
            $(this).removeClass("unchecked");
        }
        else {
            $(this).addClass("unchecked");
        }
        updateTypes();
        updateTableGuesses($("#slPlayerName").val());
    });
    $("#slAnimeTitleSelect").on("change", function () {
        if ($(this).val() === "english") {
            $(".animeNameEnglish").show();
            $(".animeNameRomaji").hide();
        }
        else {
            $(".animeNameEnglish").hide();
            $(".animeNameRomaji").show();
        }
    });
    $(".autoplayCheckbox").click(function () {
        if ($(this).hasClass("unchecked")) {
            $(this).removeClass("unchecked");
        }
        else {
            $(this).addClass("unchecked");
        }
        updateAutoPlay();
    });
    $(".repeatCheckbox").click(function () {
        if ($(this).hasClass("unchecked")) {
            $(this).removeClass("unchecked");
        }
        else {
            $(this).addClass("unchecked");
        }
        updateRepeat();
    });
    $("#slPlayerName").on("input", function () {
        updateScoreboardHighlight($(this).val());
        updateTableGuesses($(this).val());
        updateTypes();
    });
    $("#slImport").on("change", function () {
        let file = $(this).get(0).files[0];
        if (!file) {
            alert("Please select a file");
        }
        else {
        	openSongList(file);
        }
    })
    $("#slHeader")
		.on("dragover", dragOver)
		.on("dragleave", dragOver)
		.on("drop", uploadFiles)
		.on("wheel", volumeControl);
    $("#slMain")
		.on("dragover", dragOver)
		.on("dragleave", dragOver)
		.on("drop", uploadFiles);
	$("#slScoreboard")
		.on("wheel", volumeControl);
	$("#slInfo")
		.on("wheel", volumeControl);

    createVideoPlayer();
}
function dragOver(e){
	e.stopPropagation();
	e.preventDefault();
}
 
function uploadFiles(e){
	e.stopPropagation();
	e.preventDefault();
	dragOver(e);

	e.dataTransfer = e.originalEvent.dataTransfer;
	var files = e.target.files || e.dataTransfer.files;

	openSongList(files[0]);
}

function openSongList(file) {
	let reader = new FileReader();
	reader.onload = function () {
	    try {
	        importData = JSON.parse(reader.result);
	        $("#slInfo").hide();
	        $("#slScoreboard").hide();
	        loadData();
	        searchAnime($("#slSearchAnime").val());
	        searchArtist($("#slSearchArtist").val());
	        searchSongName($("#slSearchSongName").val());
	        updateTypes();
	    }
	    catch (e) {
	        if (e instanceof SyntaxError) {
	            alert(e.name + ": " + e.message);
	        }
	        if (e instanceof ReferenceError) {
	            alert(e.name + ": " + e.message);
	        }
	    }
	    
	}
	reader.readAsText(file);
}

function createVideoPlayer() {
    var videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.onended = playnextsong;
	videoPlayer.onseeked = function() {
		if(videoPlayer.paused) return;
		if($("#slSample").val() !== "all") {
			var length= parseInt($("#slLength").val())*1000;
			nextsongtimer = setTimeout(function() { playnextsong() }, length);
		}
	}
	videoPlayer.volume=getCookie("volume", 1);
//    videoPlayer.onplaying = showPauseButton
//    videoPlayer.onpause = showPlayButton

    return videoPlayer;
}
function volumeControl(event) {
	let videoPlayer = document.getElementById('videoPlayer');
	var volumetemp=videoPlayer.volume;
	volumetemp+=(event.originalEvent.deltaY<0)?.05:-.05;
	volumetemp=Math.min(Math.max(volumetemp, 0), 1);
	videoPlayer.volume=volumetemp;
	setCookie("volume",volumetemp);
}

function getCookie(cookieKey, defaultValue) {
    var cookieList = document.cookie.split(";")
    var tempValue = cookieList.find(function(cookie) {
        return cookie.includes(cookieKey)
    })

    if (tempValue == null) {
        return defaultValue
    }

    var cookieValue = tempValue.substring(cookieKey.length + 2)
    return parseFloat(cookieValue);
}
function setCookie(cookieKey, value) {
	document.cookie = cookieKey+"=" + value.toString() + "; max-age=9999999";
}
