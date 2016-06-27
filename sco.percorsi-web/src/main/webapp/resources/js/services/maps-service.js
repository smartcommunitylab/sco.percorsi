angular.module('MapsService', [])

// Google maps shape drawing
.service('drawMap', function (usSpinnerService) {
    // This contains the google.maps.Map istance
    var map;
    // This is the line drawed on the map
    var polyPath;
    // Handler for update $scope variable when something chnage in this service
    var eventHandler;

    // Array of pois markers
    var markers;
    // Array of coordinates, polyPath reference to this
    var pointsOfPolyline;

    // Draw the map with his shape
    this.createMap = function (idMap, poiCoordinates, shape, event, listOfPois) {
        eventHandler = event;
        // Google Maps + path edit
        map = new google.maps.Map(document.getElementById(idMap), {
            center: {
                lat: parseFloat(poiCoordinates.lat),
                lng: parseFloat(poiCoordinates.lng)
            },
            zoom: 16
        });

        var decodedPoints = google.maps.geometry.encoding.decodePath(shape);

        // Draw the polyline on the map
        polyPath = new google.maps.Polyline({
            path: decodedPoints,
            geodesic: true,
            strokeColor: '#2980b9',
            strokeOpacity: 1.0,
            strokeWeight: 4,
            map: map,
            editable: false
        });

        // Add reference to the global variable
        pointsOfPolyline = polyPath.getPath();

        markers = [];
        // Draw markers on the map
        drawMarkers(listOfPois);
    };

    // Tell the view that the shape is changed
    function pathChanged() {
        var newShape = google.maps.geometry.encoding.encodePath(pointsOfPolyline);
        eventHandler(newShape);
    };

    // Create and draw a list of markers on the map
    function drawMarkers(pois) {
        for (var i = 0; i < pois.length; i++) {
            markers.push(new google.maps.Marker({
                position: {
                    lat: parseFloat(pois[i].coordinates.lat),
                    lng: parseFloat(pois[i].coordinates.lng)
                }
            }));
        };
    };

    // Reset events change of the polyline
    function addListenerOfPoly() {
        google.maps.event.addListener(polyPath, 'rightclick', function (e) {
            // Check if click was on a vertex control point
            if (e.vertex == undefined) return;
            pointsOfPolyline.removeAt(e.vertex);
        });

        google.maps.event.addListener(polyPath, "dragend", pathChanged);
        google.maps.event.addListener(pointsOfPolyline, "insert_at", pathChanged);
        google.maps.event.addListener(pointsOfPolyline, "remove_at", pathChanged);
        google.maps.event.addListener(pointsOfPolyline, "set_at", pathChanged);
        // Add a listener for the click event (add new point shape)
        map.addListener('click', function (e) {
            pointsOfPolyline.push(e.latLng);
        });
    };

    function clearListenerOfPoly() {
        google.maps.event.clearListeners(map, 'click');
        google.maps.event.clearListeners(polyPath, 'rightclick');
    }

    // Enable edit of the polyline
    this.editPoli = function () {
        polyPath.setMap(null);
        polyPath = new google.maps.Polyline({
            path: pointsOfPolyline,
            geodesic: true,
            strokeColor: '#2980b9',
            strokeOpacity: 1.0,
            strokeWeight: 4,
            map: map,
            editable: true
        });
        clearListenerOfPoly();
        addListenerOfPoly();
        usSpinnerService.stop('map-spinner');
    }

    // Disable edit of the line
    this.viewPoli = function () {
        polyPath.setMap(null);
        polyPath = new google.maps.Polyline({
            path: pointsOfPolyline,
            geodesic: true,
            strokeColor: '#2980b9',
            strokeOpacity: 1.0,
            strokeWeight: 4,
            map: map,
            editable: false
        });
        clearListenerOfPoly();
        usSpinnerService.stop('map-spinner');
    }


    // Update map polyline from the controllers
    this.updatePoly = function (newShape) {
        var decodedPoints = google.maps.geometry.encoding.decodePath(newShape);
        polyPath.setPath(decodedPoints);
        pointsOfPolyline = polyPath.getPath();
        if (polyPath.editable) {
            clearListenerOfPoly();
            addListenerOfPoly();
        }
    };

    // Shows markers on the map
    this.showMarkers = function () {
        for (var i in markers)
            markers[i].setMap(map);
    };

    // Hides markers on the map
    this.hideMarkers = function () {
        for (var i in markers) {
            markers[i].setMap(null);
        }
    };

    /* Called when a poi is deleted
    this.removeMarker = function (idMarker) {
        console.log(markers);
        markers[idMarker].setMap(null);
        markers.splice(idMarker, 1);
    }*/

    // Generates the new path from the list of pois
    this.generatesPath = function (pois) {
        //var directionsService = new google.maps.DirectionsService();
        polyPath.setPath([]);
        pointsOfPolyline = polyPath.getPath();

        for (var i = 0; i < pois.length; i++)
            calcRoute(pois[i].coordinates);

        pathChanged();
    };

    // Calculate route beetwen 2 points using Google Maps API
    function calcRoute(point) {
        // Add the 2 points to the array;
        pointsOfPolyline.push(new google.maps.LatLng(point.lat, point.lng));
        /* Future:
        var request = {
            origin: {
                lat: origin.lat,
                lng: origin.lng
            },
            destination: {
                lat: destination.lat,
                lng: destination.lng
            },
            travelMode: google.maps.TravelMode.WALKING
        };
        directionsService.route(request, function (result, status) {
            polyPath.setPath([]);
            var points = [];
            if (status == google.maps.DirectionsStatus.OK) {
                var ov_poly = result.routes[0].overview_polyline;
                points = google.maps.geometry.encoding.decodePath(ov_poly);
            } else {
                // Add the 2 points to the array;
                points.push(new google.maps.LatLng(origin.lat, origin.lng));
                points.push(new google.maps.LatLng(destination.lat, destination.lng));
            }

            // push the new points shape to the global array
            for (var i in points)
                globalPoints.push(points[i]);

            polyPath.setPath(globalPoints);
            // Check if the path is complete generated
            if (idx == (length - 1)) {
                addListenerOfPoly();
                //eventHandler(google.maps.geometry.encoding.encodePath(globalPoints));
            }
        });*/
    };

    // Calc of the distance in km of the path
    google.maps.LatLng.prototype.kmTo = function (a) {
        var e = Math,
            ra = e.PI / 180;
        var b = this.lat() * ra,
            c = a.lat() * ra,
            d = b - c;
        var g = this.lng() * ra - a.lng() * ra;
        var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) + e.cos(b) * e.cos(c) * e.pow(e.sin(g / 2), 2)));
        return f * 6378.137;
    };

    google.maps.Polyline.prototype.inKm = function (n) {
        var a = this.getPath(n),
            len = a.getLength(),
            dist = 0;
        for (var i = 0; i < len - 1; i++) {
            dist += a.getAt(i).kmTo(a.getAt(i + 1));
        }
        return dist;
    };

    this.shapeLength = function () {
        return parseInt(polyPath.inKm() * 1000);
    };

    this.shapeTime = function () {
        return parseInt((polyPath.inKm() / 5) * 100);
    };
})

// This service draw the map in the poi page
.service("drawMapPoi", function () {
    var handler;
    var marker;
    this.createMap = function (divName, lat, lng, evenHandler) {
        handler = evenHandler;
        var map = new google.maps.Map(document.getElementById(divName), {
            center: {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            },
            zoom: 16
        });

        marker = new google.maps.Marker({
            position: {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            },
            animation: google.maps.Animation.DROP,
            map: map,
            draggable: true
        });

        google.maps.event.addListener(marker, 'dragend', function (ev) {
            handler(ev.latLng.lat(), ev.latLng.lng());
        });
    };

    this.updateMarker = function (lat, lng) {
        marker.setPosition(new google.maps.LatLng(lat, lng));
    };
});