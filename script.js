// "StAuth10244: I John Doe, 123456 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
let map;
let markers = [];
let directionsService;
let directionsRenderer;

// Function to initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 43.2557, lng: -79.8711 }, // Centered on Hamilton
        zoom: 10
    });

    // Initialize DirectionsService and DirectionsRenderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);


    // List of predefined locations (parks and wineries)
    let locations = [
        {name:  "Bayfront Park", type: "park", lat: 43.2735, lng: -79.8801 },
        { name: "Gage Park", type: "park", lat: 43.2415, lng: -79.8314 },
        { name: "Confederation Park", type: "park", lat: 43.2494, lng: -79.7550 },
        { name: "Dundurn Castle", type: "park", lat: 43.26853, lng: -79.88501 },
        { name: "Chedoke Falls", type: "park", lat: 43.2484, lng: -79.8972 },
        { name: "Royal Botanical Gardens", type: "park", lat: 43.2506, lng: -79.8885 },
        { name: "Rattlesnake Point", type: "park", lat: 43.3762, lng: -79.9436 },
        { name: "Webster's Falls", type: "park", lat: 43.2726, lng: -80.0254 },
        { name: "Albion Falls", type: "park", lat: 43.2265, lng: -79.8034 },
        { name: "Tiffany Falls", type: "park", lat: 43.2497, lng: -79.9071 },
        { name: "Siemens Park", type: "park", lat: 43.2625, lng: -79.9261 },
        // Add more predefined locations...
        { name: "Peller Estates Winery", type: "winery", lat: 43.2045, lng: -79.0896 },
        { name: "Peller Estates Winery", type: "winery", lat: 43.2045, lng: -79.0896 },
        { name: "Wayne Gretzky Estates", type: "winery", lat: 43.1654, lng: -79.1075 },
        { name: "Trius Winery", type: "winery", lat: 43.1952, lng: -79.1028 },
        { name: "Niagara College Teaching Winery", type: "winery", lat: 43.1042, lng: -79.0425 },
        { name: "Jackson-Triggs Niagara Estate", type: "winery", lat: 43.0915, lng: -79.0613 },
        { name: "Inniskillin Wines", type: "winery", lat: 43.1001, lng: -79.0439 },
        { name: "Ravine Vineyard Estate Winery", type: "winery", lat: 43.0969, lng: -79.0677 },
        { name: "Château des Charmes", type: "winery", lat: 43.0898, lng: -79.0550 },
        { name: "The Foreign Affair Winery", type: "winery", lat: 43.0919, lng: -79.0920 },
        { name: "Two Sisters Vineyards", type: "winery", lat: 43.0973, lng: -79.0371 }
        // Add more predefined locations...
    ];

    // fix three
    // Add each location as a marker on the map
    locations.forEach(loc => addMarker(loc));

    // fixed one 
    // Geolocation: Get user's current position if possible
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Create a marker for the user's location
            let userMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                title: "Your Location",
                icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            });

            // Center map on user's location
            map.setCenter(userLocation);
        });
    }

    // Add a click listener to each marker to show directions to that location
    markers.forEach(marker => {
        marker.addListener('click', function () {
            calculateAndDisplayRoute(marker.position);
        });
    });
}

// Function to add a marker to the map
function addMarker(location) {
    let marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        // Change icon color based on location type (winery or park)
        icon: location.type === "winery" ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    });

    // Create an InfoWindow to show location details when clicked
    let infoWindow = new google.maps.InfoWindow({
        content: `<strong>${location.name}</strong><br>Type: ${location.type}`
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });

    marker.type = location.type;
    markers.push(marker);
}

// Function to calculate and display directions from user's location to the selected marker
function calculateAndDisplayRoute(destination) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let origin = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            let request = {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            };

            // Request directions and render them on the map
            directionsService.route(request, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(response);
                } else {
                    alert('Directions request failed due to ' + status);
                }
            });
        });
    }
}

// fixed 2
// Function to filter markers based on type (park, winery, or all)
function filterMarkers(type) {
    markers.forEach(marker => {
        marker.setVisible(type === "all" || marker.type === type);
    });
}

// Function to add a new location (from form input)
document.getElementById("locationForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let name = document.getElementById("locationName").value;
    let address = document.getElementById("locationAddress").value;
    let type = document.getElementById("locationType").value;

    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function (results, status) {
        if (status === "OK") {
            // Create new location with geocoded coordinates
            let newLocation = {
                name: name,
                type: type,
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            };
            addMarker(newLocation);
        } else {
            alert("Geocode failed: " + status);
        }
    });
});

// Ensure `initMap` runs only when Google Maps is loaded
window.onload = () => {
    if (typeof google === "object" && typeof google.maps === "object") {
        initMap();
    } else {
        alert("Google Maps failed to load. Check your API key.");
    }
};

// Array of colors for background toggle
const colors = ['red', 'blue', 'black', 'white'];
let currentColorIndex = 0;

// Function to toggle the background color of the page
function toggleBackgroundColor() {
    document.body.style.backgroundColor = colors[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % colors.length;
}
