/*
 * Proof of concept CREST parsing for tournament matches
*/


/*
 * list out each match with an icon and who won it
 * pass in the series url as that has the id associated with the table row
 * query by match url to retrieve matches per series
*/
function populateMatches(seriesUrl, matchUrl) {
    if (matchUrl === undefined || matchUrl === null) {
        console.log("cannot populate matches, no match url passed");
        return -1;
    }
    if (seriesUrl === undefined || seriesUrl === null) {
        console.log("cannot populate matches, no series url passed");
        return -1;
    }
    var key = matchUrl.replace("https://crest-tq.eveonline.com","");
    // check if data is already cached
    var cachedData = getCached(key);
    // expired or not cached, get new data
    if (cachedData === null) {
        cachedData = queryCrest(matchUrl);
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
 * parse data from /tournaments/<idX>/series/<idY>/matches/ into dropdown in first '?' column
 * pass in the series url as that has the id associated with the table row
*/
function parseMatches(url, data) {
    if (url === undefined || url === null) {
        console.log("cannot parse matches, no url passed");
        return -1;
    }
    if (data === undefined || data === null) {
        console.log("cannot parse and append matches, no data passed");
        return -1;
    }
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
    var s = url.split('/');
    var currInt = s[s.length -2];
    var matchMenu = '#matchMenu' + currInt;
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
    var final = itemStart + matches + itemEnd;
    // attach to the dropdown in the '?' type column
    $(matchMenu).append(final);
}
