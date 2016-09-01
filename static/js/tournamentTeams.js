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
    console.log(data)
    // members object seem redundant, can get same information in the pilots array
    // ** does allow for linking endpoints dynamically though
    var nPilots = data.pilots.length;
    var pilots = '<div class="ui segments">';
    var seg = '<div class="ui segment">';
    var i = 0;
    var rTeam = '' ; var endiv = '</div>';
    var rScore = ''; var bScore = '';
    var winner = ''; var winName = '';
    var matches = ''; var match = '';
    var rDot = '<i class="red icon circle"></i>';
    var bDot = '<i class="blue icon circle"></i>';
    var winDot = '';
    var name = ''; var pic = '';
    // all other series have data
    // assume red wins
    while (i < 2) {
        name = '<p>' + data.pilots[i].name + '</p>';
        pic ='<div class="ui small image"><img src="' +  data.pilots[i].icon.href.replace('_128','_64') + '">' + endiv;
        pilots += seg + pic + name + endiv;

        i++;
    }
    pilots += endiv;
    // attach to the dropdown in the 'SERIES WINS' icons
    cleanupHtml(seriesID);
    $('#'+seriesID)
    .popup({
        on: 'click',
        html: pilots
    }).popup('show');
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