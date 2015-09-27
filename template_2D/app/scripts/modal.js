'use strict';

$(document).ready(function () {

  var hash = window.location.hash.substring(1);
  var urlKeys = _.reject(hash.split(';'), function (key) {
    return key.length == 0
  });
  if (urlKeys.length > 0) {
    _.each(urlKeys, function (key) {
      addSpreadsheet(key);
    });
    fireSettingLoadedEvent(urlKeys);
  } else {
    addSpreadsheet();
    $("#setting").click();
  }

  $("#add-spreadsheet").on("click", function (e) {
    e.preventDefault();
    addSpreadsheet()
  });

  $("#setting-form").on('submit', function (e) {
    e.preventDefault();
    var spreadsheetKeys = $(this).find('.spreadsheet-value').map(function () {
      var val = $(this).val();
      if (val)
        return val;
      else
        $(this).parent().remove();
    });

    _autoScaling = $('#auto-scaling').is(":checked");

    console.log(_autoScaling)

    fireSettingLoadedEvent(spreadsheetKeys);
    $('#setting-modal').modal('hide');
  });


  function fireSettingLoadedEvent(spreadsheetKeys) {
    var event = document.createEvent('Event');
    event.initEvent('setting-loaded', true, true);
    event.spreadsheetKeys = spreadsheetKeys;
    document.dispatchEvent(event);
  }

  function addSpreadsheet(defaultValue) {
    $("#spreadsheet-list").append(function () {
      var html = getSpreadsheetHtml(defaultValue);
      var $html = $(html);
      $html.find('.remove-spreadsheet').on('click', function () {
        $html.remove()
      });
      return $html
    });
  }

  function getSpreadsheetHtml(value) {
    value = value || "";
    return '<div class="spreadsheet-item input-group">' +
      '<input type="text" class="spreadsheet-value form-control" value="' + value + '">' +
      '<span class="input-group-btn">' +
      '<button class="remove-spreadsheet btn btn-default" type="button">remove</button>' +
      '</span>' +
      '</div>';
  }
});
