'use strict';

paper.install(window);
var canvas = document.getElementById('myCanvas');
paper.setup(canvas);

$(document).ready(function () {

  window.onresize = function () {
    if (_autoScaling)
      drawData()
  };

  function drawData() {
    if (_autoScaling)
      scaleData(_data);

    project.clear();
    _.each(_data, function (param) {
      var circlePath = new Path.Circle(new Point(param.x, param.y), param.radius);
      circlePath.fillColor = param.fillColor;
    });
    paper.view.draw();
  }

  function scaleData() {
    var xMax = getMax('x');
    var yMax = getMax('y');
    var canvasWidth = project.view.size._width;
    var canvasHeight = project.view.size._height;
    var coef = Math.min.apply(null, [canvasWidth / xMax, canvasHeight / yMax]);
    _data = _.map(_data, function (d) {
      d.x *= coef;
      d.y *= coef;
      d.radius *= coef;
      return d
    });

    function getMax(key) {
      var max = _.max(_data, function (d) {
        return d[key]
      });
      if (max)
        return max.radius ? max[key] + max.radius : max[key]
    }
  }

  document.addEventListener('data-loaded', function (e) {
    drawData(e.data)
  }, false);
});
