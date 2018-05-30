/*
 * Proof of concept CREST parsing for tournament endpoint
*/


$(document).ready(function() {
    // init tournament information and dropdown to begin parsing
    $('#ft').append("CCPLZ migrate this to esi for real <a target='blank' href='https://github.com/esi/esi-issues/issues/296'>CCPSoon</a>");
    // hardcode url to avoid querying twice
    var tRoot = "static/json/tournaments.json";
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
    retrieveAndParse(url, parseTournaments);
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
