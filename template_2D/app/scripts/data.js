'use strict';

$(document).ready(function () {

  $("#refresh").on("click", function (e) {
    e.preventDefault();
    fetchData(_spreadsheetKeys, true)
  });

  document.addEventListener('setting-loaded', function (e) {
    fetchData(e.spreadsheetKeys, true)
  }, false);

  function fetchData(spreadsheetKeys, showSpinner) {
    _data = [];
    var keys = [];
    var errorKeys = [];
    if (showSpinner)
      $('body').addClass('whirl traditional'); //show spinner
    async.each(_.uniq(spreadsheetKeys), function (key, cb) {
      var timeout = setTimeout(function () {
        errorKeys.push(key);
        cb()
      }, 10000);
      Tabletop.init({
        key: key,
        callback: function (data) {
          clearTimeout(timeout);
          keys.push(key); //save key
          _.each(data, function (d) {
            _.each(d, function (value, key) {
              d[key] = value === "0" ? 0 : parseInt(value) || value;
            });
            _data.push(d);
          });
          cb()
        },
        simpleSheet: true
      });
    }, function () {
      $('body').removeClass('whirl traditional'); //hide spinner
      if (errorKeys.length)
        addTimeoutAlert(errorKeys);
      fireDataLoadedEvent(_data);
      _spreadsheetKeys = keys;
      var params = keys.join(';');
      window.location = window.location.origin + "#" + params;
    });
  }

  function fireDataLoadedEvent(data) {
    var event = document.createEvent('Event');
    event.initEvent('data-loaded', true, true);
    document.dispatchEvent(event);
  }

  function addTimeoutAlert(key) {
    var html = '<div class="alert alert-dismissible alert-danger">' +
      '<button type="button" class="close" data-dismiss="alert">×</button>' +
      '<h5>Error for key:</h5>' +
      '<p>' + key + '</p>' +
      '</div>';
    $(".alert-list").append(html);
    setTimeout(function () {
      $(".alert-list .alert").first().alert('close');
    }, 5000);
  }
});
