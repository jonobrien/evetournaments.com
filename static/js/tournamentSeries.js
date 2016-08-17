/*
 * Proof of concept CREST parsing for tournaments series
*/


/*
 * called by item on tournament dropdown
 * TODO -- passed to new page from server
 *
 * we can render the data after a caching attempt
 * yes client-side caching is horribly insecure
 * but needed proof of concept first
*/
function getSeries(url) {
    $('#series').empty();
    $('#ft').empty();
    if (url === undefined || url === null) {
        console.log("cannot get series, no  url passed");
        return -1;
    }
    // hard code url here to avoid querying an extra time
    // also hardcode it as some data is not correct currently on the endpoint
    // due to AT changes
    url += 'series/';
    var key = url.replace("https://crest-tq.eveonline.com","");
    // check if data is already cached
    var cachedData = getCached(key);
    // expired or not cached, get new data, cache, parse
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
    // update footer with series we query from
    $('#ft').append("data pulled from <a target='blank' href='"+url+"'>here</a>");
}


/*
 * parse data from /tournaments/<id>/series/ into a table
 * heading: ? | Winner | Red | Blue | Series Wins
 * first column is dropdown with match information and colored by winner
 * Series Win column appears to be number of match wins as that color team in the overall tournament (needs documentation to confirm)
 *
*/
function parseSeriesData(data) {
    if (data === undefined || data === null) {
        console.log("cannot parse series data, none passed");
        return -1;
    }
    var lenItems = data.totalCount;
    var i = 0;
    var redT = '';
    var blueT = '';
    var winner = '';
    var matchDrop = '';
    var bye = '- - bye - -';
    while (i < lenItems) {
        // ? COLUMN
        // attach dropdown to later attach table of matches, etc

        // blueTeam has bye, no redTeam present, blue wins
        $('#series').append('<tr>');
        if ('isBye' in data.items[i].redTeam
                        && data.items[i].redTeam.isBye === true) {
            blueT = winner = data.items[i].winner.team.teamName;
            redT = bye;
            matchDrop = ''+
            '<td class="ui info message">'+
                '<div class="ui dropdown">'+
                    '<i class="icon circle thin"></i>'+
                    '<div class="menu" id="matchMenu'+i+'"></div>'+
                '</div></td>';
        }
        // redTeam has bye, no blueTeam present, red wins
        else if ('isBye' in data.items[i].blueTeam
                            && data.items[i].blueTeam.isBye === true) {
            redT = winner = data.items[i].winner.team.teamName;
            blueT = bye;
            matchDrop = ''+
                '<td class="negative">'+
                    '<div class="ui dropdown">'+
                        '<i class="icon circle thin"></i>'+
                    '<div class="menu" id="matchMenu'+i+'"></div>'+
                '</div></td>';
        }
        // nobody wins by default, get both teams and winner
        // actual match
        else {
            redT = data.items[i].redTeam.team.teamName;
            blueT = data.items[i].blueTeam.team.teamName;
            if (data.items[i].winner.isDecided === true) {
                winner = data.items[i].winner.team.teamName;
                if (winner === redT) {
                    matchDrop = ''+ // redTeam winner
                        '<td class="negative">'+
                            '<div class="ui dropdown">'+
                                '<i class="icon circle"></i>'+
                                '<div class="menu" id="matchMenu'+i+'"></div>'+
                            '</div></td>';
                }
                else {
                    matchDrop = ''+ // blueTeam winner
                        '<td class="ui info message">'+
                            '<div class="ui dropdown">'+
                                '<i class="icon circle"></i>'+
                                '<div class="menu" id="matchMenu'+i+'"></div>'+
                            '</div></td>';
                }
            }
            else {
                winner = 'undecided';
                matchDrop = '<td>'+ // no series winner
                        '<div class="ui dropdown">'+
                            '<i class="icon warning circle"></i>'+
                            '<div class="menu" id="matchMenu'+i+'"></div>'+
                        '</div></td>';
            }
        }
        $('#series').append(matchDrop);
        // WINNER column
        // color coordinate winner
        if (winner === redT) {
            $('#series').append('<td class="negative">'+winner+'</td>');
        }
        else {
            $('#series').append('<td class="ui info message">'+winner+'</td>');
        }
        // RED COLUMN | BLUE COLUMN
        $('#series').append('<td class="negative">'+redT+'</td>'+
                '<td class="ui info message">'+blueT+'</td>'
        );

        // SERIES WINS COLUMN
        // add matches won, link to team info
        // should be converted to dropdown table info instead
        // bye matches don't always have team urls/winners
        // so don't link teams or show wins
        var rWon = data.items[i].matchesWon.redTeam_str;
        var bWon = data.items[i].matchesWon.blueTeam_str;
        var rLink = '';
        var bLink = '';
        if ('team' in data.items[i].redTeam && 'href' in data.items[i].redTeam.team) {
            rLink = data.items[i].redTeam.team.href;
        }
        else {
            rLink = '#';
        }
        if ('team' in data.items[i].blueTeam && 'href' in data.items[i].blueTeam.team) {
            bLink = data.items[i].blueTeam.team.href;
        }
        else {
            bLink = '#';
        }
        // TODO -- should dynamically link team info off this element
        var red_blue_teams = "<a id=rWon" + i + "' target='blank' href='"+rLink+"'>"+
                "<i class='red icon user'/></a> " + rWon + "&nbsp;&nbsp;" +
                "<a id=bWon" + i + "' target='blank' href='"+bLink+"'>"+
                "<i class='blue icon user'/></a> " + bWon;
        $('#series').append('<td id=match' + i + '>'+ red_blue_teams + '</td>');


        // ? COLUMN dropdown with match data makeup of each series
        //show match info and score with winner colored circle
        seriesUrl = data.items[i].self.href;
        populateMatches(seriesUrl, data.items[i].matches.href);

        i++; // next match

        // close off row
        $('#series').append('</tr>');

    } // - while

    // re-init dropdowns just once not every item
    $('.ui.dropdown').dropdown();

}
