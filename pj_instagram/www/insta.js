$(document).ready(function () {
    var access_token = '1562602301.1677ed0.85cb5e98dfc44c3f82631d69f4dd0790';
    var timestamp = 0;
    var gridSteps = 20;

    var instaQuery = {
        lat: 48.858859,
        lng: 2.3475569,
        distance: 5000,
        _ids: []
    };

    var _projection = d3.geo.mercator()
        .center([instaQuery.lng, instaQuery.lat]) // Geographic coordinates of map centre
        .translate([instaQuery.distance, -instaQuery.distance])
        .scale(2100000 * 2);

    map.on('click', function (e) {
        console.log(getProjection(e.latlng));
    });

    var container = document.getElementById('graph');
    var datas = new vis.DataSet();


    var step = instaQuery.distance / gridSteps;
    for (var x = 0; x < instaQuery.distance * 2; x += step) {
        for (var y = 0; y < instaQuery.distance * 2; y += step) {
            datas.add({x: x, y: y, z: 0});
        }
    }

    var graph = new vis.Graph3d(container, datas, {
        width: '600px',
        height: '600px',
        style: 'bar',
        showPerspective: true,
        showGrid: false,
        showShadow: false,
        keepAspectRatio: true,
        verticalRatio: 0.5,
        axisColor: 'transparent',
        gridColor: 'transparent',
        dataColor: {
            fill: 'transparent',
            stroke: '#3267D2',
            strokeWidth: -1
        }
    });

    graph.setCameraPosition({
        horizontal: -0.261,
        vertical: 0.2
    });

    //function onCameraPositionChange(event) {
    //    console.log('The camera position changed to:\n' +
    //    'Horizontal: ' + event.horizontal + '\n' +
    //    'Vertical: ' + event.vertical + '\n' +
    //    'Distance: ' + event.distance);
    //}
    //
    //graph.on('cameraPositionChange', onCameraPositionChange);

    trt();
    setInterval(trt, 3000);

    function trt() {
        $.ajax({
            type: 'GET',
            url: "https://api.instagram.com/v1/media/search",
            data: {
                lat: instaQuery.lat,
                lng: instaQuery.lng,
                access_token: access_token,
                distance: instaQuery.distance,
                min_timestamp: timestamp
            },
            dataType: 'jsonp',
            success: function (json) {
                var feeds = json.data;
                var first = _.first(feeds);
                if (first)
                    timestamp = first.created_time;
                _.each(feeds, function (feed) {
                    if (instaQuery._ids.indexOf(feed.id) > -1)
                        return;
                    addNewFeed(feed)
                })
            },
            error: function (e) {
                console.log(e.message);
            }
        });
    }

    function getProjection(location) {
        var projection = _projection([location.lng || location.longitude, location.lat || location.latitude]);
        return {
            x: projection[0],
            y: -projection[1]
        }
    }

    function addNewFeed(feed) {

        var icon = L.AwesomeMarkers.icon({
            prefix:'fa',
            icon: 'fa-instagram',
            markerColor: 'blue'
        });

        var lat = feed.location.latitude;
        var lng = feed.location.longitude;

        var marker = L.marker(
            [lat, lng], {
                icon: icon
            });
        marker.addTo(map);

        var projection = getProjection(feed.location);
        var step = instaQuery.distance / gridSteps;
        var gridX = Math.round(projection.x / step) * step;
        var gridY = Math.round(projection.y / step) * step;
        var stepZ = 0.1;
        _.each(datas._data, function (data, id) {
            if (data.x == gridX && data.y == gridY && data.z < 5 * stepZ) {
                datas._data[id].z += stepZ;
            }
        });
        graph.setData(datas);
        graph.redraw();

        instaQuery._ids.push(feed.id);
    }
});
