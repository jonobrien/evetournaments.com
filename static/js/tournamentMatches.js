/*
 * Proof of concept CREST parsing for tournament matches
*/


/*
 * list out each match with an icon and who won it
 * lists and extra icon for who won series, lists all results at once
 * <div> MATCH 1 | 2 ... 5 | RESULTS </div>
 * dynamic as future series could have > 5 matches
*/
function populateMatches(url) {
    if (url === undefined || url === null) {
        console.log("improper match passed");
        return -1;
    }
    var key = url.replace("https://crest-tq.eveonline.com","");
    // check if data is already cached
    var cachedData = getCached(key);
    // expired or not cached, get new data
    if (cachedData === null) {
        console.log("getting new matches");
        cachedData = queryCrest(url);
        cachedData.success(function(resp) {
            console.log('success');
            console.log(resp);
            cache(resp, key);
            parseMatches(resp);
        });
    }
    else {
        parseMatches(cachedData[key]);
    }
}


/*
 * parse data from /tournaments/<id>/series into a table
 * heading:
 * matchStatus(regular,bye,undecided) | Winner | Red FC | Blue FC | Series Wins
*/
function parseMatches(data) {
    var lenItems = data.totalCount;
    console.log(data);
    var i = 0;
    var name = '';
    var redTeam = '';
    var blueTeam = '';
    var winner = '';
    var winName = '';
    var matches = '';
    var s = data.items[0].series.href.split('/');
    var series = '#subSeries' + s[s.length -2];
    console.log(series);
    while (i < lenItems) {
        var match = '';
        winner = data.items[i].winner.href;
        redTeam = data.items[i].redTeam.href;
        blueTeam = data.items[i].blueTeam.href;
        if (winner === redTeam) {
            winName = data.items[i].redTeam.name;
            match = '<i class="red icon circle"></i>';
        }
        else {
            winName = data.items[i].blueTeam.name;
            match = '<i class="blue icon circle" ></i>';
        }
        //name = data.items[i].href.name;
        //href = data.items[i].href.href + '") ';
        //item += func + href + '>' + name + '</td>';
        matches += match;
    i++;
    }
    $(series).append(matches);
}
