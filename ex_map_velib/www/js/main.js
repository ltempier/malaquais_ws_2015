var mapboxTiles =
    L.tileLayer('https://api.mapbox.com/v4/ltempier.ngnbec0e/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibHRlbXBpZXIiLCJhIjoiVjVCTkw2NCJ9.u23u7IQLUuo2Z0KUuAfz4g');


var velibLayer = new L.LayerGroup();
var pathLayer = new L.LayerGroup();

var map = L.map('map', {
    center: {
        lat: 48.858859,
        lng: 2.347556
    },
    zoom: 13,
    layers: [mapboxTiles]
});

var overlays = {
    "Velib": velibLayer,
    "Path": pathLayer
};

L.control.layers({}, overlays).addTo(map);

$(document).ready(function () {
    $.ajax({
        url: "https://api.jcdecaux.com/vls/v1/stations",
        data: {
            contract: 'paris',
            apiKey: "fe2bf527170619f1c17248cc613f85ecdda13ef1"
        },
        type: "GET",
        success: function (datas) {
            _.each(datas, function (data) {
                var circleLocation = new L.LatLng(data.position.lat, data.position.lng),
                    circleOptions = {
                        stroke: false,
                        fillColor: 'black',
                        fillOpacity: 0.5
                    };

                var circle = new L.Circle(circleLocation, 40, circleOptions);
                velibLayer.addLayer(circle);
            });
        },
        error: function (xhr) {

        }
    });

    $.ajax({
        url: "http://opendata.paris.fr/api/records/1.0/search",
        data: {
            dataset: 'reseau-cyclable',
            rows: 9223,
            facet: 'geo_shape'
        },
        type: "GET",
        success: function (datas) {
            _.each(datas.records, function (record) {

                if (!record || !record.fields || !record.fields.geo_shape) return

                var coordinates = record.fields.geo_shape.coordinates;

                coordinates = _.map(coordinates, function (coordinate) {
                    return [coordinate[1], coordinate[0]]
                });

                L.polyline(coordinates, {
                    color: 'green',
                    stroke: true,
                    fill: false,
                    weight: 2
                }).addTo(pathLayer);
            })
        },
        error: function (xhr) {

        }
    });
});

function clearMap() {
    for (var i in map._layers) {
        if (map._layers[i]._path != undefined) {
            try {
                map.removeLayer(map._layers[i]);
            }
            catch (e) {
                console.log("problem with " + e + map._layers[i]);
            }
        }
    }
}
