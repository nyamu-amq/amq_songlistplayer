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

function convertData() {
    let strType=["Opening ","Ending ","Insert Song"];
    if(importData.length<1) return;
    if(importData[0].gameMode) { console.log("gameMode exists"); return;}
    let tempData=[];
    let n=1;
    for (let song of importData) {
        let tempSong={};
        if(song.anime) {
            tempSong.anime=song.anime;
            tempSong.urls={};
            tempSong.urls.catbox={};
            tempSong.urls.catbox["0"]=song.videoUrl;
            tempSong.startSample=song.startSample;
            tempSong.videoLength=song.videoLength;
            tempSong.animeScore=song.animeScore;
            tempSong.activePlayers=1;
            tempSong.totalPlayers=1;
        }
        else {
            tempSong.anime={};
            tempSong.anime.english=song.animeEnglishName?song.animeEnglishName:song.animeENName;
            tempSong.anime.romaji=song.animeRomajiName?song.animeRomajiName:song.animeJPName;
            tempSong.urls={};
            tempSong.urls.catbox={};
            tempSong.urls.catbox["0"]=song.audio;
            tempSong.startSample=0;
            tempSong.videoLength=80;
            tempSong.animeScore=0;
            tempSong.activePlayers=1;
            tempSong.totalPlayers=1;
        }
        tempSong.gameMode="Solo";
        tempSong.name=song.name?song.name:song.songName;
        tempSong.artist=song.songArtist;
        tempSong.annId=song.annId;
        tempSong.songNumber=n++;
        tempSong.type=song.animeJPName?song.songType:strType[song.songType-1]+(song.songTypeNumber?song.songTypeNumber:"");
        tempSong.siteIds={};
        tempSong.siteIds.annId=song.annId;
        tempSong.difficulty=song.songDifficulty;
        tempSong.animeType=song.animeType;
        tempSong.vintage=song.animeVintage;
        tempSong.tags=song.animeTags;
        tempSong.genre=song.animeGenre;
        tempSong.altAnswers=song.altAnimeNames?song.altAnimeNames:song.animeAltName;
        tempSong.players=[];
        tempSong.fromList=[];
        tempSong.correct=true;
        tempSong.selfAnswer="...";

        tempData.push(tempSong);
    }
    importData=tempData;
}

function openSongList(file) {
	let reader = new FileReader();
	reader.onload = function () {
	    try {
	        //importData = convertJson(JSON.parse(reader.result.replace(/files\.catbox\.moe/g,'nl\.catbox\.moe')));
            importData = convertJson(JSON.parse(reader.result));
            convertData();
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

function convertJson(listdata) {
    if(!Array.isArray(listdata)) listdata=listdata['songs'];
    for(var i=0;i<listdata.length;i++) {
        listdata[i]=convertSong(listdata[i]);
    }
    return listdata;
}
function convertSong(data) {
    if(data.songInfo) {
        var songinfo=data.songInfo;
        data.anime={english:songinfo.animeNames.english,romaji:songinfo.animeNames.romaji};
        data.songInfo.animeNames=undefined;
        data.name=songinfo.songName;
        data.songArtist=songinfo.artist;
        data.songType=songinfo.type;
        data.songTypeNumber=songinfo.typeNumber;
        data.startSample=data.startPoint;

        data.songDifficulty=data.animeDifficulty;

        data.animeType=songinfo.animeType;
        data.animeScore=songinfo.animeScore;
        data.vintage=songinfo.vintage;
        data.tags=songinfo.animeTags;
        data.animeGenre=songinfo.animeGenre;
        data.altAnimeNames=songinfo.altAnimeNames;
        data.players=songinfo.correctGuessPlayers;
        data.fromList=songinfo.listStates;
        data.correct=songinfo.correctGuess;
        data.selfAnswer=songinfo.answer;

        data.songInfo=undefined;
    }
    else {
        if(data.animeEng) {
            data.anime={english:data.animeEng,romaji:data.animeRomaji};
            data.animeEng=undefined;
            data.animeRomaji=undefined;
        }
        if(data.songName) {
            data.name=data.songName;
            data.songName=undefined;
        }
        if(data.activePlayerCount) {
            data.activePlayers=data.totalPlayers=data.activePlayerCount;
            data.activePlayerCount=undefined;
        }
        if(data.LinkVideo) {
            data.urls={catbox:{0:data.LinkMp3,720:data.LinkVideo}};
            data.LinkMp3=undefined;
            data.LinkVideo=undefined;
        }
        if(data.songDuration) {
            data.videoLength=data.songDuration;
            data.startSample=data.startTime;
            data.songDuration=undefined;
            data.startTime=undefined;
        }
        if(data.players==undefined) {
            data.players=[];
        }
        if(data.fromList==undefined) {
            data.fromList=[];
        }
    }

    return data;
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
