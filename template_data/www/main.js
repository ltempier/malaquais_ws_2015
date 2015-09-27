
var url = "";

$.ajax({
    type: 'GET',
    url: url,
    data: {

    },
    dataType: 'jsonp',
    success: function (json) {
        console.log(json);
    },
    error: function (e) {
        console.log(e.message);
    }
});
