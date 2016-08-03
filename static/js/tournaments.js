/*
 * Proof of concept CREST parsing for tournaments endpoints
 * series data and team data parsed
*/


$(document).ready(function() {
  populateTournaments();
  $('ui,dropdown').dropdown();
  $('#ft').append("data pulled from <a target='blank' href='https://crest-tq.eveonline.com/tournaments/1/series/'>here</a>");

});// doc.ready


function populateTournaments() {

}


/*
 * assuming we pass the url to the new page
 * we can render the data after a caching attempt
 * yes client-side caching is horribly insecure
 * but needed proof of concept first
*/
function getSeries() {
    $('#series').empty();
    var url = "https://crest-tq.eveonline.com/tournaments/1/series/";
    var additional = "/tournaments/1/series/";
    // check if data is already cached
    var cachedData = getCached(additional);
    // expired or not cached, get new data
    if (cachedData === null) {
        console.log("getting new data");
        cachedData = queryCrest(url);
        cachedData.success(function(resp) {
            console.log('success');
            console.log(resp);
            cache(resp, additional);
            parseSeriesData(resp);
        });
    }
    else {
        parseSeriesData(cachedData[additional]);
    }
}




/*
 * parse data from /tournaments/<id>/series into a table
 * heading: Bye | Winner | Red FC | Blue FC | Series Matches Won
*/
function parseSeriesData(data) {
    var lenItems = data['totalCount'];
    var i = 0;
    var redT = '';
    var blueT = '';
    var winner = '';
    while (i < lenItems) {
    // blueTeam has bye, no redTeam present, blue wins
    $('#series').append('<tr>');
    if ('isBye' in data['items'][i]['redTeam']
    				&& data['items'][i]['redTeam']['isBye'] === true) {
        blueT = winner = data['items'][i]['winner']['team']['teamName'];
        redT = 'N/A - Bye';
        $('#series').append('<td class="ui info message"><i class="icon circle"></i></td>');
    }
    // redTeam has bye, no blueTeam present, red wins
    else if ('isBye' in data['items'][i]['blueTeam']
    				&& data['items'][i]['blueTeam']['isBye'] === true) {
        redT = winner = data['items'][i]['winner']['team']['teamName'];
        blueT = 'N/A - Bye';
        $('#series').append('<td class="negative"><i class="icon circle"></i></td>');
    }
    // nobody wins by default, get both teams and winner
    // actual match
    else {
        redT = data['items'][i]['redTeam']['team']['teamName'];
        blueT = data['items'][i]['blueTeam']['team']['teamName'];
        winner = data['items'][i]['winner']['team']['teamName'];
        $('#series').append('<td ><i class="icon circle thin"></i></td>');
    }
    // color coordinate winner
    if (winner === redT) {
        $('#series').append('<td class="negative">'+winner+'</td>');
    }
    else {
        $('#series').append('<td class="ui info message">'+winner+'</td>');
    }
    $('#series').append('<td class="negative">'+redT+'</td>');
    $('#series').append('<td class="ui info message">'+blueT+'</td>');

    // add matches won, link to team info
    // should be converted to dropdown table info instead
    var rWon = data['items'][i]['matchesWon']['redTeam_str'];
    var bWon = data['items'][i]['matchesWon']['blueTeam_str'];
    var rLink = data['items'][i].redTeam.team.href;
    var bLink = data['items'][i].blueTeam.team.href;
    var red_blue_teams = "<a target='blank' href='"+rLink+"'><i class='red icon user'/></a> " + rWon + "&nbsp;&nbsp;" + "<a target='blank' href='"+bLink+"'><i class='blue icon user'/></a> " + bWon;


    $('#series').append(
        '<td class="positive " id=match' + i + '>'
        + red_blue_teams + '</td>'
    );


    i++; // next match
    $('#series').append('</tr>');
  }
}


/*
 * not cached or expired cache, get data
*/
function queryCrest(crestURL) {
    console.log('querying for new data at: \n');
    console.log(crestURL);
    return $.ajax({
      type: "GET",
      url: crestURL,
    });
}


/*
 * determine if browser supports localStorage
 * then determine if the data is already cached
 * returns data if cached or null if not cached yet
 * returns null if expired
*/
function getCached(queryStr) {
    var data = null;
    if (typeof(Storage) !== "undefined") {
        if (localStorage.getItem(queryStr) !== null) {
            data = JSON.parse(localStorage.getItem(queryStr));
            // if data hasn't expired yet return it
            var now = new Date().getTime();
            if (now < data.cached_until) {
                console.log('valid cached until: ' + new Date(data.cached_until));
                console.log(data);
                return data;
            }
            // otherwise don't return it
            else {
                console.log('cached data expired, return null');
                console.log('cache_expires: ' + data.cached_until);
                console.log('          now: ' + now);
                console.log('         diff: ' + (now-data.cached_until));
                data = null;
            }
        }
        // data is null anyway don't need else {}
    }
    else {
        console.log("localStorage unsupported");
    }
    return data;
}


/*
 * data is cached for 5 minutes if no parameter passed
 * actually need to parse cache-control header for offset
*/
function cache(data, queryStr, cacheOffset) {
    var offset = cacheOffset;
    var cacheDuration = new Date().getTime(); // now
    if (offset === undefined) {
        offset = 300000;
    }
    cacheDuration = cacheDuration + offset;
    var cacheMe = {};
    cacheMe[queryStr] = data;
    // cache for 5 minutes (30000 ms)
    cacheMe['cached_until'] = cacheDuration;
    // stringify the object so getItem returns the object
    localStorage.setItem(queryStr, JSON.stringify(cacheMe));
    console.log("cached until: " + cacheMe.cached_until);
}
