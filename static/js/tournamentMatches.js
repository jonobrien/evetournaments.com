/*
 * Proof of concept CREST parsing for tournament matches
*/



/*
 * get all matches of a series
*/
function getMatches(url) {
    $('#series').empty();
    if (url === undefined || url === null) {
        console.log("improper series passed");
        return -1;
    }
    url += 'series/'
    var key = url.replace("https://crest-tq.eveonline.com","");
    // check if data is already cached
    var cachedData = getCached(key);
    // expired or not cached, get new data
    if (cachedData === null) {
        console.log("getting new data");
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
    var lenItems = data['totalCount'];
    var i = 0;
    var name = '';
    var func = ' onclick=getSeries("';
    console.log(data.items);

    while (i < lenItems) {
        var item = '<div class="item" ';
        name = data.items[i].href.name;
        href = data.items[i].href.href + '") ';
        item += func + href + '>' + name + '</div>';
        $('#tourns').append(item);
    i++;
    }
}
