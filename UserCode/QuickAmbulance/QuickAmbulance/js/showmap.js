var uname = localStorage.uname;
var contact = localStorage.contact;
var imgData = localStorage.imgdata;
var pos;
var map = null;
var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getLocationandSendReq() {
    $('#updates').html('Placing a request. Please Wait ...');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendReq);
    } else {
        var error = '<div class="row">GPS inaccessible</div>';
        $('#ambDetails').html(error);
        $('#updates').html("");
    }
}

function sendReq(position) {
    var randString = getRandomString(32);
    var requestData = {
        name: uname,
        contact: contact,
        imgData: imgData,
        lati: position.coords.latitude,
        longi: position.coords.longitude,
        email: randString
    }

    jsonData = JSON.stringify(requestData);
    $.post("http://quick-ambulance.cloudapp.net:8081", jsonData, function (data, status) {
        if (status == "success") {
            data = JSON.parse(data);
            var error = data.error;
            if (error != "true") {
                var details = "";
                var reg_id = data._id;
                var driverName = data.name;
                var driverContact = '+91' + data.contact;
                var vehicleNumber = data.vehicle;
                var vlatitude = data.lati;
                var vlongitude = data.longi;
                var timeToReach = data.duration;
                timeToReach = parseInt(timeToReach);
                $('#updates').html('Ambulance will reach you within ' + timeToReach + ' minutes.<br>' +
                                   'You can also call the driver below.');
                details += '<div class="col-xs-5 text-center"><div class="row">Driver</div><div class="row">' +
                           driverName + '</div><div class="row">' + driverContact + '</div></div>';
                details += '<div class="col-xs-2 text-center">' +
                           '<div class="row"><span class="btn btn-outline-inverse btn-lg glyphicon glyphicon-earphone" onclick="window.location.href=\'tel:' +
                           driverContact + '\';"></span></div></div>';
                details += '<div class="col-xs-5 text-center"><div class="row">Vehicle</div><div class="row">Number</div><div class="row">' + vehicleNumber + '</div></div>';
                details = '<div class="panel panel-default"><div class="panel-body">' + details + '</div></div>';
                $('#ambDetails').html(details);

                vlatitude = parseFloat(vlatitude);
                vlongitude = parseFloat(vlongitude);

                var pushpinOptions = { htmlContent: "<div style='font-size:12px;font-weight:bold;'>Ambulance</div><img src='images/ambulance_icon.gif'/>" };
                var coords = map.getCenter();
                var usercoords = map.getCenter();
                coords.latitude = vlatitude;
                coords.longitude = vlongitude;
                var pushpin = new Microsoft.Maps.Pushpin(coords, pushpinOptions);
                map.entities.push(pushpin);

                map.setView({
                    bounds: Microsoft.Maps.LocationRect.fromLocations(
                    new Microsoft.Maps.Location(usercoords.latitude, usercoords.longitude),
                    new Microsoft.Maps.Location(coords.latitude, coords.longitude))
                });
            }
            else {
                var error = '<div class="row">No ambulances available right now</div><div class="row">Please call 108</div>';
                $('#ambDetails').html(error);
                $('#updates').html("");
            }
        }
        else {
            var error = '<div class="row">Unable to contact Service</div><div class="row">Please call 108</div>';
            $('#ambDetails').html(error);
            $('#updates').html("");
        }
    });
}

function GetMap()
{
    map = new Microsoft.Maps.Map(document.getElementById("mapDiv"),
        {
            credentials: "J9x6F6ixu47wMMYDT1UN~VdJLq9tkt3kUNBC95k_uKQ~AnD_WNnFareMwCJpvYJ8OSCCIAheCGpSeTiJbVVWiWEIovvDvVlstSleoe0HMIYE",
            center: new Microsoft.Maps.Location(45.5, -122.5),
            mapTypeId: Microsoft.Maps.MapTypeId.road,
            zoom: 7
        });
    var geolocationProvider = new Microsoft.Maps.GeoLocationProvider(map);
    geolocationProvider.getCurrentPosition({ showAccuracyCircle: false, successCallback: displayCenter });
    geolocationProvider
}

function displayCenter(args) {
    var pushpinOptions = { htmlContent: "<div style='font-size:12px;font-weight:bold;'>You</div><span class='glyphicon glyphicon glyphicon-user'></span>" };
    var pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), pushpinOptions);
    map.entities.push(pushpin);
}

function getRandomString(length)
{
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

$(document).ready(function () {
    GetMap();
});