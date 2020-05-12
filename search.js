const REGEX_REPLACE_RULES = [
    {
        input: 'ou',
        replace: '(ou|ō)'
    },
    {
        input: 'oo',
        replace: '(oo|ō)'
    },
    {
        input: 'o',
        replace: '[oōóòöôøΦ]'
    },
    {
        input: 'uu',
        replace: '(uu|ū)'
    },
    {
        input: 'u',
        replace: '[uūûúùüǖ]'
    },
    {
        input: 'a',
        replace: '[aä@âàáạåæā]'
    },
    {
        input: 'c',
        replace: '[cč]'
    },
    {
        input: ' ',
        replace: '([★☆\\/\\*=\\+·♥∽・〜†×♪→␣:;]* |(☆|★|\\/|\\*|=|\\+|·|♥|∽|・|〜|†|×|♪|→|␣|:|;)+)'
    },
    {
        input: 'e',
        replace: '[eéêëèæ]'
    },
    {
        input: '\'',
        replace: '[\'’]'
    },
    {
        input: 'n',
        replace: '[nñ]'
    },
    {
        input: '2',
        replace: '[2²]'
    },
    {
        input: 'i',
        replace: '[ií]'
    },
    {
        input: '3',
        replace: '[3³]'
    },
    {
        input: 'x',
        replace: '[x×]'
    },
    {
        input: 'b',
        replace: '[bß]'
    },
    {
        input: '\\\\-',
        replace: '[\\-–]'
    }
];

function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function createRegExp(query) {
    let escapedQuery = escapeRegExp(query);
    REGEX_REPLACE_RULES.forEach((rule) => {
        escapedQuery = escapedQuery.replace(new RegExp(rule.input, "gi"), rule.replace);
    });
    return new RegExp(escapedQuery, "i");
}

function testRegex(value, query) {
    return createRegExp(query).test(value);
}

function updateRow(row) {
    if (row.find(".rowHidden").length === 0 || row.hasClass("rowHidden")) {
        row.show();
    }
    else {
        row.hide();
    }
}

function searchSongName(query) {
	resetplaylist();
    $(".songData .songName").each((index, elem) => {
        if (testRegex($(elem).text(), query)) {
            $(elem).removeClass("rowHidden");
            playlist.push(index)
        }
        else {
            $(elem).addClass("rowHidden");
        }
        updateRow($(elem).parent());
    });
}

function searchArtist(query) {
	resetplaylist();
    $(".songData .songArtist").each((index, elem) => {
        if (testRegex($(elem).text(), query)) {
            $(elem).removeClass("rowHidden");
            playlist.push(index)
        }
        else {
            $(elem).addClass("rowHidden");
        }
        updateRow($(elem).parent());
    });
}

function searchAnime(query) {
	resetplaylist();
    $(".songData .animeNameRomaji").each((index, elem) => {
        if (testRegex($(elem).text(), query)) {
            $(elem).removeClass("rowHidden");
            $(elem).parent().find(".animeNameEnglish").removeClass("rowHidden");
            playlist.push(index)
        }
        else {
            if (testRegex($(elem).parent().find(".animeNameEnglish").text(), query)) {
                $(elem).removeClass("rowHidden");
                $(elem).parent().find(".animeNameEnglish").removeClass("rowHidden");
                playlist.push(index)
            }
            else {
                $(elem).parent().find(".animeNameEnglish").addClass("rowHidden");
                $(elem).addClass("rowHidden");
            }
        }
        updateRow($(elem).parent());
    });
}

let playlist=[]
function resetplaylist() {
	playlist=[]
	stopsong();
}

function updateTypes() {
	resetplaylist();

	var uncheckedcorrect=$("#slPlayerCorrect").hasClass("unchecked");
	var uncheckedincorrect=$("#slPlayerIncorrect").hasClass("unchecked");

    $(".songData").each((index, elem) => {
    	var rightanswer=$(elem).hasClass("rightAnswerTable");
    	var wronganswer=$(elem).hasClass("wrongAnswerTable");
    	var songtypeclass = $(elem).find(".songType");
    	if(uncheckedcorrect && rightanswer) {
    		songtypeclass.addClass("rowHidden");
    	}
    	else if(uncheckedincorrect && wronganswer) {
    		songtypeclass.addClass("rowHidden");
    	}
        else if (songtypeclass.text().includes("Opening") && $("#slTypeOpenings").hasClass("unchecked")) {
            songtypeclass.addClass("rowHidden");
        }
        else if (songtypeclass.text().includes("Opening") && !$("#slTypeOpenings").hasClass("unchecked")) {
            songtypeclass.removeClass("rowHidden");
            playlist.push(index)
        }
        else if (songtypeclass.text().includes("Ending") && $("#slTypeEndings").hasClass("unchecked")) {
            songtypeclass.addClass("rowHidden");
        }
        else if (songtypeclass.text().includes("Ending") && !$("#slTypeEndings").hasClass("unchecked")) {
            songtypeclass.removeClass("rowHidden");
            playlist.push(index)
        }
        else if (songtypeclass.text().includes("Insert") && $("#slTypeInserts").hasClass("unchecked")) {
            songtypeclass.addClass("rowHidden");
        }
        else {
            songtypeclass.removeClass("rowHidden");
            playlist.push(index)
        }
        updateRow(songtypeclass.parent())
    })
}

let autoplay=true;
function updateAutoPlay() {
	autoplay=!$("#slAutoPlay").hasClass("unchecked");
}