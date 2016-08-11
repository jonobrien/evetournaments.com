/*
 * Proof of concept CREST parsing for tournament matches
*/


/*
 * list out each match with an icon and who won it
 * lists and extra icon for who won series, lists all results at once
 * <div> MATCH 1 | 2 ... 5 | RESULTS </div>
 * dynamic as future series could have > 5 matches
*/
function populateMatches(seriesUrl, url) {
    if (url === undefined || url === null) {
        console.log("improper match passed");
        return -1;
    }
    if (seriesUrl === undefined || seriesUrl === null) {
        console.log("improper seriesUrl passed");
        return -1;
    }
    var key = url.replace("https://crest-tq.eveonline.com","");
    // check if data is already cached
    var cachedData = getCached(key);
    // expired or not cached, get new data
    if (cachedData === null) {
        cachedData = queryCrest(url);
        cachedData.success(function(resp) {
            cache(resp, key);
            parseMatches(seriesUrl, resp);
        });
    }
    else {
        parseMatches(seriesUrl, cachedData[key]);
    }
}


/*
 * parse data from /tournaments/<id>/series into a table
 * heading:
 * matchStatus(regular,bye,undecided) | Winner | Red FC | Blue FC | Series Wins
*/
function parseMatches(url, data) {
    var lenItems = data.totalCount;
    var i = 0;
    var redTeam = '';
    var blueTeam = '';
    var winner = '';
    var winName = '';
    var matches = '';
    var match = '';
    var itemStart = '<div class="item">';
    var itemEnd = '</div>';
    //var s = data.items[0].series.href.split('/');
    var s = url.split('/');
    var currInt = s[s.length -2];
    var matchMenu = '#matchMenu' + currInt;
    var matchTD = '#matchTD' + currInt;
    // handle bye series with no matches
    if (lenItems === 0) {
        $(matchMenu).append(itemStart + '<i class="icon circle thin"></i>' + itemEnd);
        return;
    }
    while (i < lenItems) {
        winner = data.items[i].winner.href;
        redTeam = data.items[i].redTeam.href;
        blueTeam = data.items[i].blueTeam.href;
        if (winner === redTeam) {
            winName = data.items[i].redTeam.name;
            match = '<i class="red icon circle"></i>';
        }
        else {
            winName = data.items[i].blueTeam.name;
            match = '<i class="blue icon circle"></i>';
        }

        matches += match;
        i++;
    }
    // attach to the Matches TD in the series table
    $(matchTD).append(matches);
    // attach to the dropdown in the '?' type column
    $(matchMenu).append(itemStart+matches+itemEnd);
}
