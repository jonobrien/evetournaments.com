

$(document).ready(function() {


  $('#ft').append("data pulled from <a target='blank' href='https://crest-tq.eveonline.com/tournaments/1/series/'>here</a>");

});// doc.ready
function getSeries() {
    var url = "https://crest-tq.eveonline.com/tournaments/1/series/";
    queryCrestSeries(url);
}

function queryCrestSeries(crestURL) {
    $.ajax({
      type: "GET",
      url: crestURL,
      success: function(data) {
        $('#series').empty();
        parseSeriesData(data);
      }
    });
  }


/*
 * parse data from /tournaments/<id>/series into a table
 * heading: Bye | Winner | Red FC | Blue FC | Series Matches Won
*/
function parseSeriesData(data) {
  var lenItems = data['items'].length;
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
      redT = 'N/A - Bye'
      $('#series').append('<td class="ui info message"><i class="icon circle"></i></td>');
    }
    // redTeam has bye, no blueTeam present, red wins
    else if ('isBye' in data['items'][i]['blueTeam']
    				&& data['items'][i]['blueTeam']['isBye'] === true) {
      redT = winner = data['items'][i]['winner']['team']['teamName'];
      blueT = 'N/A - Bye'
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
    var rWon = data['items'][i]['matchesWon']['redTeam_str'];
    var bWon = data['items'][i]['matchesWon']['blueTeam_str'];
    $('#series').append('<td class="positive center aligned">'+' red: '+rWon+' blue: '+bWon+'</td>');

    i++; // next
    $('#series').append('</tr>');
  } //$('#stuff').append(JSON.stringify(data,undefined,2));
}



function getSeriesTeam(crestURL) {
    $.ajax({
      type: "GET",
      url: crestURL,
      success: function(data) {
        $('#series').empty();
        parseTeamData(data);
      }
    });
  }


  function parseTeamData(data) {

  }