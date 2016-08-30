/*
 * Proof of concept CREST parsing for tournament matches
*/


/*
 * list out each match with an icon and who won it
 * pass in the series url as that has the id associated with the table row
 * query by match url to retrieve matches per series
*/
function populateMatches(url) {
    if (url === undefined || url === null) {
        console.log("cannot populate matches, no url passed");
        return -1;
    }
    retrieveAndParse(url, parseMatches);
}


/*
 * parse data from /tournaments/<idX>/series/<idY>/matches/ into dropdown in first '?' column
 * pass in the series url as that has the id associated with the table row
*/
function parseMatches(data) {
    if (data === undefined || data === null) {
        console.log("cannot parse and append matches, no data passed");
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
