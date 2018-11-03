$("#carouselvideo").carousel({ interval: false });

$(document).ready(function() {
    console.log("ready!");

    // First three images are loaded from google top images search

    $.ajax({
        url: "https://www.googleapis.com/customsearch/v1?key=AIzaSyB1StKYCid43-b2UEjPU7wbZNyAnnE1wnM&searchType=image&cx=015195275159114245235:wgr_cir1weu&q=kerela flood&maxResults=1&order=relevance",
        async: true,
        success: function(result) {
            var results = result;
            loadyoutube();

            //console.log(result);
            $.each(results.items, function(index, item) {
                if (index == 0) {
                    $("#image_container").append('<div class="carousel-item active"> <img src = "' + item.link + '"alt = "New York" width = "1100" height = "500" ></div>');
                } else {
                    $("#image_container").append('<div class="carousel-item"> <img src = "' + item.link + '"alt = "New York" width = "1100" height = "500" ></div>');
                }
            });

        }
    });

    loadtweets();

});

// Youtube Videos are loaded

function init() {
    gapi.client.setApiKey("AIzaSyB1StKYCid43-b2UEjPU7wbZNyAnnE1wnM");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
}

function loadyoutube() {
    var request = gapi.client.youtube.search.list({
        part: "snippet",
        type: "video",
        maxResults: 10,
        q: encodeURIComponent("Kerela flood").replace(/%20/g, "+"),
        order: "relevance",
        safeSearch: "moderate"

    });

    request.execute(function(response) {
        //console.log(response);
        var results = response.result;

        $.each(results.items, function(index, item) {
            if (index == 0) {
                $("#video_container").append('<div class="carousel-item active"><iframe width="1100" height="345" src="https://www.youtube.com/embed/' + item.id.videoId + '"></iframe> </div>');
            } else {
                $("#video_container").append('<div class="carousel-item"><iframe width="1100" height="345" src="https://www.youtube.com/embed/' + item.id.videoId + '"></iframe> </div>');
            }
        });

    });
}

function loadtweets() {
    var rapid = new RapidAPI("default-application_5bdca111e4b02e44153fe1b2", "f4106874-ab35-4e58-8614-91b818cb9e93");

    rapid.call('Twitter', 'search', {
        'consumerKey': 'J9JJhHRDwK5R4v2vMUxpYFM1c',
        'query': 'Amritsar train accident',
        'accessTokenKey': '1058415465205137408-LdNfvMnqE7MFwupnV7Q4lqivY87i86',
        'consumerSecret': 'IvJBb9TGnIh2oyOnRx55TqNH6iuzOeJa5J9tbZqZve6jChkIdo',
        'accessTokenSecret': 'dsieVnV0Dv07QEVqBQaubIPrte6LEtUcZVBRpPzNfvl00'

    }).on('success', function(payload) {
        /*YOUR CODE GOES HERE*/
        console.log(payload);

        $.each(payload.statuses, function(index, item) {

            $("#twitter_container").append('<p><i class="fas fa-arrow-alt-circle-right"></i> ' + item.text + '</p>');

        });

    }).on('error', function(payload) {
        /*YOUR CODE GOES HERE*/
        console.log(payload);
    });


}