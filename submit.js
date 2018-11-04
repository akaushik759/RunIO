var coord;

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


$(document).ready(function() {

    console.log("ready!");
    $("form").on("submit", function(e) {
        e.preventDefault();

        if ($("#title").val() != "" && coord != null) {

            firebase.database().ref("article").push({

                    title: $("#title").val(),
                    data: $("#content").val(),
                    coord: coord

                }).then(() => {
                    window.open("index.html", "_SELF");
                    alert("successfully submitted");

                })
                .catch(function(error) {
                    alert("Unfortunately there was an error, please try again");
                });


        } else {
            console.log("coooo");
        }
    });
});


function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -33.8688,
            lng: 151.2195
        },
        zoom: 13,
        mapTypeId: 'satellite'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        console.log(places);
        if (places.length == 0) {
            return;
        }
        places.forEach(function(item) {
            //console.log(item.name);
            coord = item.formatted_address;
        });

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));
            console.log(place.geometry.location);


            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                //console.log()
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}