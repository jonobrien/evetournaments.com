/*
 * Proof of concept CREST parsing for tournaments endpoint
*/


$(document).ready(function() {
    // init tournament information and dropdown to begin parsing
    $('#ft').append("data pulled from <a target='blank' href='https://crest-tq.eveonline.com/tournaments/'>here</a>");
    // hardcode url to avoid querying twice
    var tRoot = "https://crest-tq.eveonline.com/tournaments/";
    populateTournaments(tRoot);
    $('.ui.dropdown').dropdown();

});// doc.ready


/*
 * query /tournaments/ for list of tournaments
 * cache and call parse of results
*/
function populateTournaments(url) {
    if (url === undefined || url === null) {
        console.log("cannot populate tournament urls, none passed");
        return -1;
    }
    var urlStr = url;
    var key = urlStr.replace("https://crest-tq.eveonline.com","");
    // check if data is already cached
    var cachedData = getCached(key);
    // expired or not cached, get new data
    if (cachedData === null) {
        cachedData = queryCrest(url);
        cachedData.success(function(resp) {
            cache(resp, key);
            parseTournaments(resp);
        });
    }
    else {
        parseTournaments(cachedData[key]);
    }
}


/*
 * parse data from /tournaments/ into a dropdown
 * each item is a different tournament
*/
function parseTournaments(data) {
    if (data === undefined || data === null) {
        console.log("cannot parse tournament data, none passed");
        return -1;
    }
    var lenItems = data.totalCount;
    var i = 0;
    var name = '';
    var func = ' onclick=getSeries("';
    while (i < lenItems) {
        var item = '<div class="item" ';
        name = data.items[i].href.name;
        href = data.items[i].href.href + '") ';
        item += func + href + '>' + name + '</div>';
        $('#tourns').append(item);
    i++;
    }
}
