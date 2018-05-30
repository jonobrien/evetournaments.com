/*
 * Proof of concept CREST parsing for tournament matches
*/


/*
 * query for team information
*/
function populateTeam(args) {
    if (args.url === undefined || args.url === null) {
        console.log("cannot populate team, no url passed");
        return -1;
    }
    if (args.series === undefined || args.series === null) {
        console.log("cannot populate team, no series id passed");
        return -1;
    }
    retrieveAndParse(args.url, parseTeam, args.series);
}


/*
 * parse data from /tournaments/teams/<id>/
 * added switch statement in crestCache.retrieveAndParse just for seriesID
*/
function parseTeam(data, seriesID) {
    if (data.captain === undefined || data.captain === null) {
        console.log("cannot parse team, invalid data passed");
        return -1;
    }
    if (seriesID === undefined || seriesID === null) {
        console.log("cannot attach team, no id passed");
        return -1;
    }
    // valid new data, so clear out old
    $('#teamH').empty();
    $('#teamB').empty();
    $('#banH').empty();
    $('#banB').empty();

    // members object seem redundant, can get same information in the pilots array
    // ** does allow for linking endpoints dynamically though
    var nPilots = data.pilots.length;
    var nBans = data.banFrequency.length;
    var nBansAgainst = data.banFrequencyAgainst.length;
    var pilots = '';
    var bans = '';
    var bansAgainst = '<tr class="win"><td>opponents</td><td>banned</td></tr>';
    var i = 0;
    var j = 0;
    var k = 0;
    tHeader = '' +
        '<th>' + data.shipsKilled_str + ' kills for '+ data.iskKilled_str +  ' ISK</th>' +
        '<th>' + data.name + '</th>'
    bHeader = '' +
        '<th> banned</th>' +
        '<th> #/this AT - ship</th>'
    var rTeam = '' ; var endrow = '</tr>';
    var rDot = '<i class="red icon circle"></i>';
    var bDot = '<i class="blue icon circle"></i>';
    var winDot = '';
    var name = ''; var pic = '';
    var picUrl = ''; var shipUrl = '';
    // all other series have data
    // assume red wins
    //
    // TODO -- image urls use http not https, fix that
    //
    while (i < nPilots) {
        picUrl = data.pilots[i].icon.href.replace('_128','_32').replace("http://", "https://")

        pic ='<td class="ui tiny image"><img src="' +  picUrl + '"></td>';
        if (data.pilots[i].name === data.captain.name) {
            name = '<td class="win">' + data.pilots[i].name + '</td>';
        }
        else {
            name = '<td>' + data.pilots[i].name + '</td>';
        }
        pilots += '<tr>'+ pic + name + endrow;

        i++;
    }
    // numBans is number of times current team banned X ship from being used by other team
    while (j < nBans) {
        shipUrl = data.banFrequency[j].shipType.icon.href.replace('_64','_32').replace("http://", "https://")
        numBans = data.banFrequency[j].numBans_str;

        pic ='<td class="ui tiny image"><img src="' +  shipUrl + '"></td>';
        name = '<td>'+ numBans + ' x ' + data.banFrequency[j].shipType.name +'</td>';
        bans += '<tr>'+ pic + name + endrow;

        j++
    }
    // numBans is number of times other team banned X ship from being used by current team
    //
    // just appending all bans to a single table, could be huge, wanted another table
    // but need to figure out @media for mobile and smaller widths first
    //
    while (k < nBansAgainst) {
        numBans = data.banFrequencyAgainst[k].numBans_str;
        pic ='<td class="ui tiny image"><img src="' +  data.banFrequencyAgainst[k].shipType.icon.href.replace('_64','_32') + '"></td>';
        name = '<td>'+ numBans + ' x ' + data.banFrequencyAgainst[k].shipType.name +'</td>';
        bansAgainst += '<tr>'+ pic + name + endrow;
        k++
    }



    // attach to the team and ban tables
    //cleanupHtml(seriesID);
    $('#teamH').append(tHeader);
    $('#teamB').append(pilots);
    $('#banH').append(bHeader);
    $('#banB').append(bans);
    $('#banB').append(bansAgainst);

}


// remove the hardcoded onclick
function cleanupHtml(id) {
    //console.log($('#'+id));
    var str = $('#'+id)[0].outerHTML;
    var arr = str.split('"');
    arr.splice(4,2);
    str = arr.join('"');
    $('#'+id)[0].outerHTML = str;
}
