/*
 * Proof of concept CREST parsing for tournaments series
*/


/*
 * assuming we pass the url to the new page
 * we can render the data after a caching attempt
 * yes client-side caching is horribly insecure
 * but needed proof of concept first
*/
function getSeries(url) {
    $('#series').empty();
    $('#ft').empty();
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
        cachedData = queryCrest(url);
        cachedData.success(function(resp) {
            cache(resp, key);
            parseSeriesData(resp);
        });
    }
    else {
        parseSeriesData(cachedData[key]);
    }
    $('#ft').append("data pulled from <a target='blank' href='"+url+"'>here</a>")
}


/*
 * parse data from /tournaments/<id>/series into a table
 * heading: Bye | Winner | Red FC | Blue FC | Series Matches Won
 * matchesWon contains a dropdown to further parse into the tournament
 *
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
            $('#series').append('<td class="ui info message"><i class="icon circle thin"></i></td>');
        }
        // redTeam has bye, no blueTeam present, red wins
        else if ('isBye' in data['items'][i]['blueTeam']
        				&& data['items'][i]['blueTeam']['isBye'] === true) {
            redT = winner = data['items'][i]['winner']['team']['teamName'];
            blueT = 'N/A - Bye';
            $('#series').append('<td class="negative"><i class="icon circle thin"></i></td>');
        }
        // nobody wins by default, get both teams and winner
        // actual match
        else {
            redT = data['items'][i]['redTeam']['team']['teamName'];
            blueT = data['items'][i]['blueTeam']['team']['teamName'];
            if (data['items'][i]['winner']['isDecided'] === true) {
                winner = data['items'][i]['winner']['team']['teamName'];
                if (winner === redT) {
                    $('#series').append('<td class="negative">'+
                            '<i class="icon circle"></i></td>'
                    );
                }
                else {
                    $('#series').append('<td class="ui info message">'+
                            '<i class="icon circle"></i></td>'
                    );
                }
            }
            else {
                winner = 'undecided';
                $('#series').append('<td ><i class="icon warning circle"></i></td>');
            }
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
        // bye matches don't always have team urls/winners
        // so don't link teams or show wins
        var rWon = data['items'][i].matchesWon.redTeam_str;
        var bWon = data['items'][i].matchesWon.blueTeam_str;
        var rLink = '';
        var bLink = '';
        if ('team' in data['items'][i].redTeam && 'href' in data['items'][i].redTeam.team) {
            rLink = data['items'][i].redTeam.team.href;
        }
        else {
            rLink = '#';
        }
        if ('team' in data['items'][i].blueTeam && 'href' in data['items'][i].blueTeam.team) {
            bLink = data['items'][i].blueTeam.team.href;
        }
        else {
            bLink = '#';
        }
        // should dynamically link team info off this element
        var red_blue_teams = "<a id=rWon" + i + "' target='blank' href='"+rLink+"'>"+
                "<i class='red icon user'/></a> " + rWon + "&nbsp;&nbsp;" +
                "<a id=bWon" + i + "' target='blank' href='"+bLink+"'>"+
                "<i class='blue icon user'/></a> " + bWon;
        $('#series').append('<td id=match' + i + '>'+ red_blue_teams + '</td>');

        // just make the icons, data should be cached here and thus only called
        // a single time for each series, but still could hit rate-limit
        // as 1 GET for series data, 1 for matches, 1 for team x lots = >150/sec
        // append the last <td> 6 match circles here </td>
        // bye series have no matches
        $('#series').append('<td><div id="subSeries' + i + '"><div></td>');
        seriesUrl = data.items[i].self.href;
        populateMatches(seriesUrl, data.items[i].matches.href);

        i++; // next match
        $('#series').append('</tr>');
    }
}
