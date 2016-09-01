/*
 * Proof of concept CREST parsing for tournament matches
*/


/*
 * query for team information
*/
function populateTeam(args) {
    if (args.url === undefined || args.url === null) {
        console.log("cannot populate team, no url passed");
        return -1;
    }
    if (args.series === undefined || args.series === null) {
        console.log("cannot populate team, no series id passed");
        return -1;
    }
    retrieveAndParse(args.url, parseTeam, args.series);
}


/*
 * parse data from /tournaments/teams/<id>/
 * added switch statement in crestCache.retrieveAndParse just for seriesID
*/
function parseTeam(data, seriesID) {
    if (data.captain === undefined || data.captain === null) {
        console.log("cannot parse team, invalid data passed");
        return -1;
    }
    if (seriesID === undefined || seriesID === null) {
        console.log("cannot attach team, no id passed");
        return -1;
    }
    // members and pilots arrays seem redundant, can get same information in the array already given
    // as the members query would be increased load on the API servers
    // ** does allow for linking
    var lenItems = data.totalCount;
    var i = 0;
    var rTeam = '' ; var bTeam = '';
    var rScore = ''; var bScore = '';
    var winner = ''; var winName = '';
    var matches = ''; var match = '';
    var rDot = '<i class="red icon circle"></i>';
    var bDot = '<i class="blue icon circle"></i>';
    var winDot = '';

    // all other series have data
    // assume red wins
    while (i < lenItems) {
        winner = data.items[i].winner.href;
        rTeam = data.items[i].redTeam.href;
        bTeam = data.items[i].blueTeam.href;
        rScore = data.items[i].score.redTeam;
        bScore = data.items[i].score.blueTeam;
        winName = data.items[i].redTeam.teamName;
        winDot = rDot;
        // winner is given as href team, so compare that
        if (winner === bTeam) {
            winName = data.items[i].blueTeam.teamName;
            winDot = bDot;
        }
        match = '<div>' + winDot + winName + '<p class="ui header red"> ' + rScore + ' </p> <p class="ui header blue"> ' + bScore + '</p></div>';

        matches += match;
        i++;
    }

    // attach to the dropdown in the 'SERIES WINS' icons
    cleanupHtml(seriesID);
    $('#'+seriesID)
    .popup({
        on: 'click',
        html: '<p>hi</p>'
    }).popup('show');
}


// remove the hardcoded onclick
function cleanupHtml(id) {
    //console.log($('#'+id));
    var str = $('#'+id)[0].outerHTML;
    var arr = str.split('"');
    arr.splice(4,2);
    str = arr.join('"');
    $('#'+id)[0].outerHTML = str;
}