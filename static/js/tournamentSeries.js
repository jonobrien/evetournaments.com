/*
 * Proof of concept CREST parsing for tournament series
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
    $('#rl').empty();
    if (url === undefined || url === null) {
        console.log("cannot get series, no  url passed");
        return -1;
    }
    // hard code url here to avoid querying an extra time
    // also hardcode it as some data is not correct currently on the endpoint
    // due to AT changes -- see ccp doc issue 199 for reference
    url += 'series/';
    retrieveAndParse(url, parseSeries);
    // done parsing, TODO -- loading icon with async support
    $('#rl').empty();
    $('#rl').append('<div class="ui compact info message"><i class="close icon parsed"></i> parse completed successfully</div>'
    );
    // update footer with series we query from
    $('#ft').append("data pulled from <a target='blank' href='"+url+"'>here</a>");

    // messages with close icons can be closed
    $('.message .close').on('click', function() {
        $(this)
            .closest('.message')
            .transition('fade');
    });
}


/*
 * parse data from /tournaments/<id>/series/ into a table
 * heading: ? | Winner | Red | Blue | Series Wins
 * first column is dropdown with match information and colored by winner
 * Series Win column appears to be number of match wins as that color team in the overall tournament (needs documentation to confirm)
 *
*/
function parseSeries(data) {
    if (data === undefined || data === null) {
        console.log("cannot parse series data, none passed");
        return -1;
    }
    var lenItems = data.totalCount;
    var i = 0;
    var redT = '';
    var blueT = '';
    var winner = '';
    var matchPopup = '';
    var bye = '- - bye - -';
    var solidDot = '<i class="icon circle"></i>';
    var emptyDot = '<i class="icon circle thin"></i>';
    while (i < lenItems) {
        // new series
        $('#series').append('<tr>');

        // ? COLUMN
        // undecided - nobody wins
        // winner - either red or blue
        // bye series - only 1 team data present

        // nobody wins by default (undecided) series
        winner = 'undecided';
        matchPopup = '' +  // no series winner
            '<td id="matchMenu'+i+'" class="ui message pop">'+
                '<i class="icon warning circle"></i>'+
            '</td>';
        // bye series:
        // blueTeam wins/has bye, no redTeam present
        if ('isBye' in data.items[i].redTeam
                        && data.items[i].redTeam.isBye === true) {
            blueT = winner = data.items[i].winner.team.teamName;
            redT = bye;
            matchPopup = ''+  // blue wins
            '<td id="matchMenu'+i+'" class="ui info message pop">'+
                emptyDot +
            '</td>';
        }
        // bye series:
        // redTeam wins/has bye, no blueTeam present
        else if ('isBye' in data.items[i].blueTeam
                            && data.items[i].blueTeam.isBye === true) {
            redT = winner = data.items[i].winner.team.teamName;
            blueT = bye;
            matchPopup = ''+  // red wins
                '<td id="matchMenu'+i+'" class="ui negative message pop">'+
                   emptyDot +
                '</td>';
        }
        //
        // actual matches played:
        // get both teams and series winner
        else {
            redT = data.items[i].redTeam.team.teamName;
            blueT = data.items[i].blueTeam.team.teamName;
            if (data.items[i].winner.isDecided === true) {
                winner = data.items[i].winner.team.teamName;
                if (winner === redT) {
                    matchPopup = ''+  // redTeam winner
                        '<td id="matchMenu'+i+'" class="ui negative message pop">'+
                            solidDot +
                        '</td>';
                }
                else {
                    matchPopup = ''+  // blueTeam winner
                        '<td id="matchMenu'+i+'" class="ui info message pop">'+
                            solidDot +
                        '</td>';
                }
            }
        }
        $('#series').append(matchPopup);

        // RED COLUMN | BLUE COLUMN
        // bold winner
        if (winner === redT) {
            $('#series').append(''+
                '<td class="ui negative message win">'+winner+'</td>'+
                '<td class="ui info message">'+blueT+'</td>'
            );
        }
        else  if (winner === blueT) {
            $('#series').append(''+
                '<td class="ui negative message">'+redT+'</td>'+
                '<td class="ui info message win">'+winner+'</td>'
            );
        }
        else { // undecided series
            $('#series').append('' +
                '<td class="ui negative message">'+redT+'</td>'+
                '<td class="ui info message">'+blueT+'</td>'
            );
        }

        // SERIES WINS COLUMN
        // add matches won, popup showing team information
        var rWon = data.items[i].matchesWon.redTeam_str;
        var bWon = data.items[i].matchesWon.blueTeam_str;
        
        // parse each team info respectively
        var red = '';
        var blue = '';
        var rLink = '#';
        var bLink = '#';
        // bye var here associated with team being parsable or not
        // see above comments about who is actually
        var rPresent = true;
        var bPresent = true;
        var rArgs = {"url":rLink, "series": i};
        var bArgs = {"url":bLink, "series": i};
        // TODO -- refactor this logic

        // make icons and add click event for making popup
        // if team href not in json, just make simple popup
        if ('team' in data.items[i].redTeam && 'href' in data.items[i].redTeam.team) {
            rLink = data.items[i].redTeam.team.href;
            rArgs.url = rLink;
            rArgs.series = 'rTeam' + i;
            red = '<i id="rTeam' + i + '" class="red icon user pop" '+
                    'onclick=populateTeam('+JSON.stringify(rArgs)+')/> ' + rWon;
        }
        else {
            red = '<i id="rTeam' + i + '" class="red icon user pop" <i/> ' + rWon;
            rPresent = false;
        }
        if ('team' in data.items[i].blueTeam && 'href' in data.items[i].blueTeam.team) {
            bLink = data.items[i].blueTeam.team.href;
            bArgs.url = bLink;
            bArgs.series = 'bTeam' + i;
            blue = '<i id="bTeam' + i + '" class="blue icon user pop" '+
                    'onclick=populateTeam('+JSON.stringify(bArgs)+')/> ' + bWon;
        }
        else {
            blue = '<i id="bTeam' + i + '" class="blue icon user pop" <i/> ' + bWon;
            bPresent = false;
        }
        var red_blue_teams = '' +
                red + '&nbsp;&nbsp;' + blue;

        // add the html with or without the click event
        $('#series').append('<td>'+ red_blue_teams + '</td>');

        // add simple popups if no team data present
        if (rPresent === false) {
            $('#rTeam'+i)
            .popup({
                on: 'click',
                html: '<p>bye series, no team data available</p>'
            });
        }
        if (bPresent === false) {
            $('#bTeam'+i)
            .popup({
                on: 'click',
                html: '<p>bye series, no team data available</p>'
            });
        }

        // ? COLUMN dropdown with match data makeup of each series
        //show match info and score with winner colored circle
        populateMatches(data.items[i].matches.href);

        i++; // next match
        $('#series').append('</tr>');
    } // - while

    $('.ui.dropdown').dropdown();  // re-init dropdowns just once not every item


}
