/*
 * Proof of concept CREST parsing for tournament matches
*/


/*
 * query for team information
*/
function populateTeam(url) {
    if (url === undefined || url === null) {
        console.log("cannot populate team, no url passed");
        return -1;
    }
    //retrieveAndParse(url, parseTeam);
}


/*
 * parse data from /tournaments/teams/<id>/
*/
function parseTeam(data) {
    if (data === undefined || data === null) {
        console.log("cannot parse team, no data passed");
        return -1;
    }
    var lenItems = data.totalCount;
    var i = 0;
    var rTeam = '' ; var bTeam = '';
    var rScore = ''; var bScore = '';
    var winner = ''; var winName = '';
    var matches = ''; var match = '';
    var rDot = '<i class="red icon circle"></i>';
    var bDot = '<i class="blue icon circle"></i>';
    var winDot = '';
    var s = data.query_url.split('/');
    var currInt = s[s.length -3];
    var matchMenu = '#matchMenu' + currInt;
    // handle bye series with no matches
    if (lenItems === 0) {
        $(matchMenu)
        .popup({
            on: 'click',
            html: '<i class="icon circle thin"></i>'
        });
        return;
    }
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
    // attach to the dropdown in the '?' type column
    $(matchMenu)
    .popup({
        on: 'click',
        html: matches
    });
}
