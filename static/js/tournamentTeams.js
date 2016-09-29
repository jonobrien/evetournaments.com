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
    $('#teamH').empty();
    $('#teamB').empty();

    console.log(data)
    // members object seem redundant, can get same information in the pilots array
    // ** does allow for linking endpoints dynamically though
    var nPilots = data.pilots.length;
    var pilots = ''; var i = 0;
    header = '' +
        '<th>'+ data.shipsKilled_str +' ships killed by </th>' +
        '<th>'+data.name+'</th>'
    var rTeam = '' ; var endrow = '</tr>';
    var rDot = '<i class="red icon circle"></i>';
    var bDot = '<i class="blue icon circle"></i>';
    var winDot = '';
    var name = ''; var pic = '';
    // all other series have data
    // assume red wins
    while (i < nPilots) {
        pic ='<td class="ui small image"><img src="' +  data.pilots[i].icon.href.replace('_128','_64') + '"></td>';
        console.log(data.pilots[i].name)
        console.log(data.captain.name)
        if (data.pilots[i].name === data.captain.name) {
            name = '<td class="win">' + data.pilots[i].name + '</td>';
        }
        else {
            name = '<td>' + data.pilots[i].name + '</td>';
        }
        pilots += '<tr>'+ pic + name + endrow;

        i++;
    }



    // attach to the dropdown in the 'SERIES WINS' icons
    //cleanupHtml(seriesID);
    $('#teamH').append(header);
    $('#teamB').append(pilots);
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