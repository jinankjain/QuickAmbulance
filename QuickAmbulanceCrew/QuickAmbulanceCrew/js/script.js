function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchloc);
    } else {
        //x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function createDrivingRoute() {
    if (!directionsManager) {
        var displayMessage;
        if (!directionsManager) {
            directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
            displayMessage = 'Directions Module loaded\n';
            displayMessage += 'Directions Manager loaded';
        }
        console.log(displayMessage);
        directionsManager.resetDirections();
        directionsErrorEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', function (arg) { console.log(arg.message) });
        directionsUpdatedEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function () { console.log('Directions updated') });
    }
    directionsManager.resetDirections();
    // Set Route Mode to driving
    directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.driving });
    var seattleWaypoint = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(curcoords.latitude, curcoords.longitude) });
    directionsManager.addWaypoint(seattleWaypoint);
    var tacomaWaypoint = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(localStorage.lati, localStorage.longi) });
    directionsManager.addWaypoint(tacomaWaypoint);
    // Set the element in which the itinerary will be rendered
    directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('directionsItinerary') });
    console.log('Calculating directions...');
    directionsManager.calculateDirections();
}

function fetchloc(position) {
    curcoords = position.coords;
    map = new Microsoft.Maps.Map(document.getElementById('mapDiv'), { credentials: 'J9x6F6ixu47wMMYDT1UN~VdJLq9tkt3kUNBC95k_uKQ~AnD_WNnFareMwCJpvYJ8OSCCIAheCGpSeTiJbVVWiWEIovvDvVlstSleoe0HMIYE', mapTypeId: Microsoft.Maps.MapTypeId.road });
    if (!directionsManager) {
        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { callback: createDrivingRoute });
    }
    else {
        createDrivingRoute();
    }
}

$(document).ready( function() {
    getLocation();
    details += '<div class="col-xs-5 text-center wtext"><div class="row">Patient</div><div class="row">Name</div><div class="row">' +
                         localStorage.name +'</div></div>';
    details += '<div class="col-xs-2 text-center wtext">' +
             '<div class="row"><span class="btn btn-outline-inverse btn-lg glyphicon glyphicon-earphone" onclick="window.location.href=\'tel:' +
             localStorage.contact + '\';"></span></div></div>';
    details += '<div class="col-xs-5 text-center wtext"><div class="row">Patient</div><div class="row">Contact</div><div class="row"> +91' + localStorage.contact + '</div></div>';
    details = '<div class="panel panel-default" style="background:#0064bf;"><div class="panel-body">' + details + '</div></div>';
    // console.log(details);
    $('#ambDetails').html(details);
});