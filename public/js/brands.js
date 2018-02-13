/**
   * Update a map's viewport to fit each geometry in a dataset
   * @param {google.maps.Map} map The map to adjust
   */
  function zoom(googlemap) {
    var bounds = new google.maps.LatLngBounds();
    googlemap.data.forEach(function(feature) {
      processPoints(feature.getGeometry(), bounds.extend, bounds);
    });
    googlemap.fitBounds(bounds);
  }
  /**
   * Process each point in a Geometry, regardless of how deep the points may lie.
   * @param {google.maps.Data.Geometry} geometry The structure to process
   * @param {function(google.maps.LatLng)} callback A function to call on each
   *     LatLng point encountered (e.g. Array.push)
   * @param {Object} thisArg The value of 'this' as provided to 'callback' (e.g.
   *     myArray)
   */
  function processPoints(geometry, callback, thisArg) {
    if (geometry instanceof google.maps.LatLng) {
      callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
      callback.call(thisArg, geometry.get());
    } else {
      geometry.getArray().forEach(function(g) {
        processPoints(g, callback, thisArg);
      });
    }
  }
  function AreaAcceptanceMapFunc(areas, lat, lon) {
    var map = new google.maps.Map(document.getElementById('AreaAcceptanceMapElem'),
                  {center: {lat: lat, lng: lon}, zoom: 13});
    areas.map(function(item, index) {
      var myLatLng = {lat: item.latitude, lng: item.longitude};
      // var contentString = "Behold";
      // var infowindow = new google.maps.InfoWindow({content: contentString});
      var marker = new google.maps.Marker({position: myLatLng, map: map});
      // marker.addListener('click', function() {infowindow.open(map, marker);});
    });
  }
  function AreaRejectionMapFunc(areas, lat, lon) {
    var map = new google.maps.Map(document.getElementById('AreaRejectionMapElem'),
                  {center: {lat: lat, lng: lon}, zoom: 13});
    areas.map(function(item, index) {
      var myLatLng = {lat: item.latitude, lng: item.longitude};
      // var contentString = "Behold";
      // var infowindow = new google.maps.InfoWindow({content: contentString});
      var marker = new google.maps.Marker({position: myLatLng, map: map});
      // marker.addListener('click', function() {infowindow.open(map, marker);});
    });
  }
  function AreaAcceptanceMapFuncNoData() {
    var el = document.getElementById('AreaAcceptanceMapElem');
    $(el).css({'height':'auto'});
    el.innerHTML = "<div class='noLocationDataFound'>No Location Data Found</div>";
  }
  function AreaRejectionMapFuncNoData() {
    var el = document.getElementById('AreaRejectionMapElem');
    $(el).css({'height':'auto'});
    el.innerHTML = "<div class='noLocationDataFound'>No Location Data Found</div>";
  }
  function makeBarChartHighLikes(areas) {
    var _load = areas;
                    this.point = [];
                                            for(var key in _load) {
                                                  if(_load.hasOwnProperty(key)) {
                                                    var _obj = {};
                                                    _obj.name = _load[key].productname;
                        _obj.y = parseInt(_load[key].likes);
                        this.point.push(_obj);
                                                  }
                                            }
                                            var tx = [];
                                           var bx = {
                                                    type: "bar",
                                                    name: "Products Likes Bar Chart",
                                                    colorByPoint :true,
                                                    data: this.point
                                            };
                                            tx.push(bx);
                    var options = {
                                                chart: {
                                                    renderTo: 'productsreviewlikes',
                                                    plotBackgroundColor: null,
                                                    plotBorderWidth: null,
                                                    plotShadow: false
                                                },
                                                title: {
                                                    text: 'Products Likes Bar Chart'
                                                },
                                                tooltip: {
                                                    formatter: function() {
                                                        return '<b>' + this.point.name + '</b> ' + this.point.y;
                                                    }
                                                },
                                                plotOptions: {
                                                    pie: {
                                                        allowPointSelect: true,
                                                        cursor: 'pointer',
                                                        dataLabels: {
                                                            enabled: true,
                                                            color: '#000000',
                                                            connectorColor: '#000000',
                                                            formatter: function() {
                                                                return '<b>' + this.point.name + '</b> ' + this.point.y;
                                                            }
                                                        },
                                                        showInLegend: true
                                                    }
                                                },
                                                series: []
                                            };
                                            options.series = tx;
                                            chart = new Highcharts.Chart(options);
  }
  function makeBarChartHighDisLikes(areas) {
    var _load = areas;
                    this.point = [];
                                            for(var key in _load) {
                                                  if(_load.hasOwnProperty(key)) {
                                                    var _obj = {};
                                                    _obj.name = _load[key].productname;
                        _obj.y = parseInt(_load[key].dislikes);
                        this.point.push(_obj);
                                                  }
                                            }
                                            var tx = [];
                                           var bx = {
                                                    type: "pie",
                                                    name: "Products DisLikes Pie Chart",
                                                    colorByPoint :true,
                                                    data: this.point
                                            };
                                            tx.push(bx);
                    var options = {
                                                chart: {
                                                    renderTo: 'productsreviewdislikes',
                                                    plotBackgroundColor: null,
                                                    plotBorderWidth: null,
                                                    plotShadow: false
                                                },
                                                title: {
                                                    text: 'Products DisLikes Pie Chart'
                                                },
                                                tooltip: {
                                                    formatter: function() {
                                                        return '<b>' + this.point.name + '</b> ' + this.point.y;
                                                    }
                                                },
                                                plotOptions: {
                                                    pie: {
                                                        allowPointSelect: true,
                                                        cursor: 'pointer',
                                                        dataLabels: {
                                                            enabled: true,
                                                            color: '#000000',
                                                            connectorColor: '#000000',
                                                            formatter: function() {
                                                                return '<b>' + this.point.name + '</b> ' + this.point.y;
                                                            }
                                                        },
                                                        showInLegend: true
                                                    }
                                                },
                                                series: []
                                            };
                                            options.series = tx;
                                            chart = new Highcharts.Chart(options);
  }
  function makeBarChartHighRating(areas) {
    var _load = areas;
                    this.point = [];
                                            for(var key in _load) {
                                                  if(_load.hasOwnProperty(key)) {
                                                    var _obj = {};
                                                    _obj.name = _load[key].productname;
                        _obj.y = parseInt(_load[key].rating);
                        this.point.push(_obj);
                                                  }
                                            }
                                            var tx = [];
                                           var bx = {
                                                    type: "pie",
                                                    name: "Products Rating Pie Chart",
                                                    colorByPoint :true,
                                                    data: this.point
                                            };
                                            tx.push(bx);
                    var options = {
                                                chart: {
                                                    renderTo: 'productsreviewrating',
                                                    plotBackgroundColor: null,
                                                    plotBorderWidth: null,
                                                    plotShadow: false
                                                },
                                                title: {
                                                    text: 'Products Rating Pie Chart'
                                                },
                                                tooltip: {
                                                    formatter: function() {
                                                        return '<b>' + this.point.name + '</b> ' + this.point.y;
                                                    }
                                                },
                                                plotOptions: {
                                                    pie: {
                                                        allowPointSelect: true,
                                                        cursor: 'pointer',
                                                        dataLabels: {
                                                            enabled: true,
                                                            color: '#000000',
                                                            connectorColor: '#000000',
                                                            formatter: function() {
                                                                return '<b>' + this.point.name + '</b> ' + this.point.y;
                                                            }
                                                        },
                                                        showInLegend: true
                                                    }
                                                },
                                                series: []
                                            };
                                            options.series = tx;
                                            chart = new Highcharts.Chart(options);
  }
