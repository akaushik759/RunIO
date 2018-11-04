//$("#carouselvideo").carousel({ interval: false });

// First three images are loaded from google top images search

var links = [];
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBP6QPTLhIx9r5D05AR_p5gQkgJM2jorwI",
    authDomain: "blogs-221213.firebaseapp.com",
    databaseURL: "https://blogs-221213.firebaseio.com",
    projectId: "blogs-221213",
    storageBucket: "blogs-221213.appspot.com",
    messagingSenderId: "492239457223"
};
firebase.initializeApp(config);
var i = 0;
//$("#search").val("Kerela flood");


$(document).ready(function() {
    console.log("ready!");

    function image_search() {

        $.ajax({
            url: "https://www.googleapis.com/customsearch/v1?key=AIzaSyB1StKYCid43-b2UEjPU7wbZNyAnnE1wnM&searchType=image&cx=015195275159114245235:wgr_cir1weu&q=" + $("#search").val() + "&maxResults=1&order=relevance",
            async: true,
            success: function(result) {
                var results = result;


                //console.log(result);
                $.each(results.items, function(index, item) {
                    if (index == 0) {
                        $("#image_container").append('<div class="carousel-item active"> <img src = "' + item.link + '"alt = "New York" width = "1100" height = "500" ></div>');
                    } else {
                        $("#image_container").append('<div class="carousel-item"> <img src = "' + item.link + '"alt = "New York" width = "1100" height = "500" ></div>');
                    }
                    links[index] = item.image.contextLink;
                });

                scanweb();

            }
        });

        loadtweets();
    }
    var tech = getUrlParameter('data');
    var image = getUrlParameter('image');
    var title = getUrlParameter('title');
    var text = getUrlParameter('text');
    if (tech != null && tech != "") {
        i = 1;
        $("#search").val(tech);
        $('#background').css('background-image', 'url(' + image + ')');
        $("#title").text(title);
        $("#text").text(text);
        image_search();
    }

    $("form").on("submit", function(e) {
        e.preventDefault();
        i = 0;
        image_search();
    });

});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

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
        q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
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

// Twitter latest tweet are loaded

function loadtweets() {
    var rapid = new RapidAPI("default-application_5bdca111e4b02e44153fe1b2", "f4106874-ab35-4e58-8614-91b818cb9e93");

    rapid.call('Twitter', 'search', {
        'consumerKey': 'J9JJhHRDwK5R4v2vMUxpYFM1c',
        'query': $("#search").val(),
        'accessTokenKey': '1058415465205137408-LdNfvMnqE7MFwupnV7Q4lqivY87i86',
        'consumerSecret': 'IvJBb9TGnIh2oyOnRx55TqNH6iuzOeJa5J9tbZqZve6jChkIdo',
        'accessTokenSecret': 'dsieVnV0Dv07QEVqBQaubIPrte6LEtUcZVBRpPzNfvl00'

    }).on('success', function(payload) {
        /*YOUR CODE GOES HERE*/
        //console.log(payload);
        loadyoutube();
        $.each(payload.statuses, function(index, item) {

            if (index < 5)
                $("#twitter_container").append('<p><i class="fas fa-arrow-alt-circle-right"></i> ' + item.text + '</p>');

        });

    }).on('error', function(payload) {
        /*YOUR CODE GOES HERE*/
        console.log(payload);
    });


}

// web scraping started, scanning websites using sentiment analysis

function scanweb() {
    // prepare the request
    for (var i = 0; i < links.length; i++) {
        //Do something

        if (i < 6) {
            //console.log(links[i]);
            $.ajax({
                url: "https://api.diffbot.com/v3/analyze?token=cba2a888ac3b1c1378394b9239789427&url=" + links[i],
                async: true,
                success: function(result) {

                    console.log(result.objects[0].images[0].url);
                    //console.log(result.objects[0].text.substring(0, 500));

                    $("#article_container").append('<div class="card col-md-12 p-3" style="margin-bottom: 10px;"><div class="row"><div class="col-md-4"> <img class="w-100" src="' + result.objects[0].images[0].url + '" style="height: 300px; width: 100%;"></div><div class="col-md-8"><div class="card-block"> <h6 class="card-title"><a href="' + result.request.pageUrl + '">' + result.title + '</a></h6><p class="card-text text-justify">' + result.objects[0].text.substring(0, 800) + '</p><a href="' + result.request.pageUrl + '" class="btn btn-primary">read more...</a></div></div></div></div>');
                    //console.log(result.objects);

                    $('#background').css('background-image', 'url(' + result.objects[0].images[1].url + ')');
                    $("#title").text($("#search").val());
                    $("#text").text(result.title);

                    /*if (result.objects) {
                        //console.log(result.objects[0].text);
                        if (result.objects.images) {
                            console.log(result.objects[0].images[0].url);
                            console.log(result.objects[0].text.substring(0, 50));
                        }
                    }*/
                }
            });
        }
    }
}

// Google panorama view and google map loading

var map;
var panorama;

function initMap() {

    var berkeley = {
        lat: 10.8505,
        lng: 76.2711
    };

    $.ajax({
        url: "https://maps.google.com/maps/api/geocode/json?address=" + $("#search").val() + "&key=AIzaSyB1StKYCid43-b2UEjPU7wbZNyAnnE1wnM",
        async: true,
        success: function(result) {
            berkeley = {
                lat: result.results[0].geometry.location.lat,
                lng: result.results[0].geometry.location.lng
            };
        }
    });


    var sv = new google.maps.StreetViewService();

    panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));

    // Set up the map.
    map = new google.maps.Map(document.getElementById('map'), {
        center: berkeley,
        zoom: 16,
        streetViewControl: true
    });

    // Set the initial Street View camera to the center of the map
    sv.getPanorama({
        location: berkeley,
        radius: 100
    }, processSVData);

    // Look for a nearby Street View panorama when the map is clicked.
    // getPanorama will return the nearest pano when the given
    // radius is 50 meters or less.
    map.addListener('click', function(event) {
        sv.getPanorama({
            location: event.latLng,
            radius: 100
        }, processSVData);
    });
}

function processSVData(data, status) {
    if (status === 'OK') {
        var marker = new google.maps.Marker({
            position: data.location.latLng,
            map: map,
            title: data.location.description
        });

        panorama.setPano(data.location.pano);
        panorama.setPov({
            heading: 270,
            pitch: 0
        });
        panorama.setVisible(true);

        marker.addListener('click', function() {
            var markerPanoID = data.location.pano;
            // Set the Pano to use the passed panoID.
            panorama.setPano(markerPanoID);
            panorama.setPov({
                heading: 270,
                pitch: 0
            });
            panorama.setVisible(true);
        });
    } else {
        console.error('Street View data not found for this location.');
    }
}