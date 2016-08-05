/*
 * Proof of concept CREST parsing for tournaments endpoint
*/


$(document).ready(function() {
    // init tournament information
    // init dropdowns
    $('.ui.dropdown').dropdown();
    $('#ft').append("data pulled from <a target='blank' href='https://crest-tq.eveonline.com/tournaments/'>here</a>");
    var tRoot = "https://crest-tq.eveonline.com/tournaments/";
    populateTournaments(tRoot);

});// doc.ready


function populateTournaments(url) {
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
 * parse data from /tournaments/<id>/series into a table
 * heading:
 * matchStatus(regular,bye,undecided) | Winner | Red FC | Blue FC | Series Wins
*/
function parseTournaments(data) {
    var lenItems = data['totalCount'];
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
