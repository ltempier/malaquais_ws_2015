$(document).ready(function () {

    var schoolLayer = new L.LayerGroup();
    var shopLayer = new L.LayerGroup();
    var equipmentLayer = new L.LayerGroup();
    var meetLayer = new L.LayerGroup();
    var ratpLayer = new L.LayerGroup();
    var matrixLayer = new L.LayerGroup();
    var resultLayer = new L.LayerGroup();
    var bridgeLayer = new L.LayerGroup();

    var myScope = {
        no: {
            lat: 48.8640821,
            lng: 2.3379439
        },
        se: {
            lat: 48.8467589,
            lng: 2.3585647
        }
    };

    var map = L.map('map', {
        center: {
            lat: (myScope.no.lat + myScope.se.lat) / 2,
            lng: (myScope.no.lng + myScope.se.lng) / 2
        },
        zoom: 15,
        layers: L.tileLayer('https://api.mapbox.com/v4/ltempier.nhl1g957/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibHRlbXBpZXIiLCJhIjoiVjVCTkw2NCJ9.u23u7IQLUuo2Z0KUuAfz4g')
    });

    var rect = L.rectangle([[myScope.no.lat, myScope.no.lng], [myScope.se.lat, myScope.se.lng]], {
        className: "bound",
        fill: false

    });
    map.addLayer(rect);
    rect.editing.enable();
    rect.on('edit', function () {
        console.log(rect.getBounds());
        trt(rect.getBounds())
    });

    var overlays = {
        "school": schoolLayer,
        "shop": shopLayer,
        "equiment": equipmentLayer,
        "meet": meetLayer,
        "ratp": ratpLayer,
        "matrix": matrixLayer,
        "result": resultLayer,
        "bridge": bridgeLayer
    };
    L.control.layers({}, overlays).addTo(map);

    trt()

    function trt(bound) {

        if (bound)
            myScope = {
                no: {
                    lat: bound._northEast.lat,
                    lng: bound._southWest.lng
                },
                se: {
                    lat: bound._southWest.lat,
                    lng: bound._northEast.lng
                }
            };

        var startPoint = {
            lat: (myScope.no.lat + myScope.se.lat) / 2,
            lng: (myScope.no.lng + myScope.se.lng) / 2
        };

        schoolLayer.clearLayers();
        shopLayer.clearLayers();
        equipmentLayer.clearLayers();
        meetLayer.clearLayers();
        ratpLayer.clearLayers();
        matrixLayer.clearLayers();
        resultLayer.clearLayers();
        bridgeLayer.clearLayers();
        clearMap();

        var queries = 0;
        var geofilterPolygon = "(" + myScope.no.lat + "," + myScope.no.lng + "),(" + myScope.no.lat + "," + myScope.se.lng + "),(" + myScope.se.lat + "," + myScope.se.lng + "),(" + myScope.se.lat + "," + myScope.no.lng + ")";
        var openDataUrl = "http://opendata.paris.fr/api/records/1.0/search";

        $.ajax({
            url: openDataUrl,
            type: 'GET',
            data: {
                dataset: "liste_des_etablissements_scolaires2",
                rows: 670,
                "geofilter.polygon": geofilterPolygon
            },
            success: function (datas) {
                var records = datas.records;
                for (var i = 0; i < records.length; i = i + 1) {
                    var record = records[i];
                    if (!record || !record.geometry || !record.geometry.coordinates) {
                        console.log(record)
                    } else {
                        var adresse = record.geometry.coordinates.reverse();
                        var circle = L.circle(adresse, 50, {
                            color: 'red',
                            fillColor: '#f03',
                            fillOpacity: 0.5
                        });
                        schoolLayer.addLayer(circle)
                    }
                }
            },
            error: function (error) {
                console.log(error)
            },
            complete: function () {
                queries++
            }
        });


        $.ajax({
            url: openDataUrl,
            type: 'GET',
            data: {
                dataset: "petits_marchands_sur_l_espace_public_en_2012",
                rows: 120,
                "geofilter.polygon": geofilterPolygon
            },
            success: function (datas) {
                var records = datas.records;
                for (var i = 0; i < records.length; i = i + 1) {
                    var record = records[i];
                    if (!record || !record.geometry || !record.geometry.coordinates) {
                        console.log(record)
                    } else {
                        var adresse = record.geometry.coordinates.reverse();
                        var circle = L.circle(adresse, 50, {
                            color: 'blue',
                            fillColor: 'blue',
                            fillOpacity: 0.5
                        });
                        shopLayer.addLayer(circle)
                    }
                }
            },
            error: function (error) {
                console.log(error)
            },
            complete: function () {
                queries++
            }
        });


        $.ajax({
            url: openDataUrl,
            type: 'GET',
            data: {
                dataset: "accessibilite_des_equipements_de_la_ville_de_paris",
                rows: 2000,
                "geofilter.polygon": geofilterPolygon
            },
            success: function (datas) {
                var records = datas.records;
                for (var i = 0; i < records.length; i = i + 1) {
                    var record = records[i];
                    if (!record || !record.geometry || !record.geometry.coordinates) {
                        console.log(record)
                    } else {
                        var adresse = record.geometry.coordinates.reverse();
                        var circle = L.circle(adresse, 50, {
                            color: 'yellow',
                            fillColor: 'yellow',
                            fillOpacity: 0.5
                        });
                        equipmentLayer.addLayer(circle)
                    }
                }
            },
            error: function (error) {
                console.log(error)
            },
            complete: function () {
                queries++
            }
        });


        $.ajax({
            url: openDataUrl,
            type: 'GET',
            data: {
                dataset: "zones-de-rencontre",
                rows: 31,
                "geofilter.polygon": geofilterPolygon
            },
            success: function (datas) {
                var records = datas.records;
                for (var i = 0; i < records.length; i = i + 1) {
                    var record = records[i];
                    if (!record || !record.geometry || !record.geometry.coordinates) {
                        console.log(record)
                    } else {
                        var adresse = record.geometry.coordinates.reverse();
                        var circle = L.circle(adresse, 50, {
                            color: 'green',
                            fillColor: 'green',
                            fillOpacity: 0.5
                        });
                        meetLayer.addLayer(circle)
                    }
                }
            },
            error: function (error) {
                console.log(error)
            },
            complete: function () {
                queries++
            }
        });

        var ratpUrl = "http://data.ratp.fr/api/records/1.0/search";

        $.ajax({
            url: ratpUrl,
            type: 'GET',
            data: {
                dataset: "positions-geographiques-des-stations-du-reseau-ratp",
                rows: 10000,
                "geofilter.polygon": geofilterPolygon
            },
            success: function (datas) {
                var records = datas.records;
                for (var i = 0; i < records.length; i = i + 1) {
                    var record = records[i];
                    if (!record || !record.geometry || !record.geometry.coordinates) {
                        console.log(record)
                    } else {
                        var coord = record.geometry.coordinates.reverse();
                        var circle = L.circle(coord, 50, {
                            color: 'grey',
                            fillColor: 'grey',
                            fillOpacity: 0.5
                        });
                        ratpLayer.addLayer(circle)
                    }
                }
            },
            error: function (error) {
                console.log(error)
            },
            complete: function () {
                queries++
            }
        });

        render();

        function render() {
            if (queries < 5) {
                setTimeout(render, 500);
                return
            }

            var step = 10;
            var results = [];

            var latStep = Math.abs(myScope.se.lat - myScope.no.lat) / step;
            var lngStep = Math.abs(myScope.no.lng - myScope.se.lng) / step;

            var lat = myScope.se.lat;

            for (var x = 0; x < step; x++) {
                var lng = myScope.no.lng;
                for (var y = 0; y < step; y++) {
                    var bound = {
                        lat: {
                            min: lat,
                            max: lat + latStep
                        },
                        lng: {
                            min: lng,
                            max: lng + lngStep
                        }
                    };

                    var result = {
                        "school": {},
                        "shop": {},
                        "equiment": {},
                        "meet": {},
                        "ratp": {}
                    };

                    _.each(overlays, function (overlay, name) {
                        if (_.keys(result).indexOf(name) < 0)
                            return;
                        var layers = _.values(overlay._layers);
                        layers = _.filter(layers, function (layer) {
                            return layer._latlng.lat >= bound.lat.min &&
                                layer._latlng.lat < bound.lat.max &&
                                layer._latlng.lng >= bound.lng.min &&
                                layer._latlng.lng < bound.lng.max
                        });

                        layers = _.map(layers, function (layer) {
                            return {
                                lat: layer._latlng.lat,
                                lng: layer._latlng.lng
                            }
                        });
                        result[name].score = layers.length;
                        var center = getCenter(layers);
                        result[name].center = center
                    });

                    var center = getCenter(_.pluck(result, 'center'));

                    var boundScore = 0;
                    _.each(result, function (r) {
                        boundScore += r.score
                    });
                    results.push({
                        id: x + ':' + y,
                        //details: result,
                        center: center,
                        score: boundScore
                    });

                    matrixLayer.addLayer(L.polygon([
                        [bound.lat.min, bound.lng.min],
                        [bound.lat.min, bound.lng.max],
                        [bound.lat.max, bound.lng.max],
                        [bound.lat.max, bound.lng.min]
                    ], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        weight: 1
                    }));
                    lng += lngStep
                }
                lat += latStep
            }

            results = _.filter(results, function (result) {
                return result.center
            });

            _.each(results, function (result) {
                var circle = L.circle([result.center.lat, result.center.lng], result.score * 1, {
                    color: 'LightGray'
                }).addTo(map);
                resultLayer.addLayer(circle)
            });

            var bufferResults = _.sortBy(results, function (result) {
                return -result.score
            });

            var lastPoint = startPoint;

            var latlngs = [[lastPoint.lat, lastPoint.lng]];

            for (var bridge = 0; bridge < 20; bridge++) {

                var buffers = _.sortBy(bufferResults, function (result) {
                    var delta = Math.pow(result.center.lat - lastPoint.lat, 2) + Math.pow(result.center.lng - lastPoint.lng, 2);
                    return Math.sqrt(delta)
                });

                buffers = _.first(buffers, 10);
                var newPoint = _.max(buffers, function (point) {
                    return point.score
                });

                latlngs.push([newPoint.center.lat, newPoint.center.lng]);
                bufferResults = _.reject(bufferResults, function (result) {
                    return result.id == newPoint.id
                });
                lastPoint = newPoint.center;
            }

            bridgeLayer.addLayer(L.polyline(latlngs, {
                color: 'white',
                opacity: 0.9
            }).addTo(map));
        }

    }


    function getCenter(listLatLng) {
        var center = {
            lat: 0,
            lng: 0
        };
        listLatLng = _.filter(listLatLng, function (latlng) {
            return latlng
        });
        if (listLatLng.length > 0) {
            _.each(listLatLng, function (latlng) {
                if (!latlng) return;
                center.lat += latlng.lat;
                center.lng += latlng.lng
            });
            return {
                lat: center.lat / listLatLng.length,
                lng: center.lng / listLatLng.length
            }
        } else
            return null
    }

    function clearMap() {
        for (var i in map._layers) {
            if (map._layers[i]._path != undefined) {
                if (map._layers[i].options && map._layers[i].options.className == "bound") {

                } else
                    try {
                        map.removeLayer(map._layers[i]);
                    }
                    catch (e) {
                        console.log("problem with " + e + map._layers[i]);
                    }
            }
        }
    }
});
