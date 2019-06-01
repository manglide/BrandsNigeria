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
    var map = new google.maps.Map(document.getElementById('mapstoreacc'),
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
    var map = new google.maps.Map(document.getElementById('mapstorerej'),
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
    var el = document.getElementById('mapstoreacc');
    $(el).css({'height':'auto'});
    el.innerHTML = "<div class='noLocationDataFound'>No Location Data Found</div>";
  }
  function AreaRejectionMapFuncNoData() {
    var el = document.getElementById('mapstorerej');
    $(el).css({'height':'auto'});
    el.innerHTML = "<div class='noLocationDataFound'>No Location Data Found</div>";
  }
  function preMapCallAccept(pid) {
    $.ajax(
            {
                url : '/areasofacceptance',
                type: "POST",
                data: {data: pid},
                beforeSend: function ()
                {
                   $('#mapstoreacc').html('<div><i class="fa fa-refresh fa-spin"></i></div>');
                },
                success:function(response)
                {
                  var areas = JSON.parse(response).data.map(obj => obj);
                  console.log(areas);
                  if (areas.length === 0) {
                    AreaAcceptanceMapFuncNoData();
                  } else {
                    AreaAcceptanceMapFunc(areas, areas[0].latitude, areas[0].longitude);
                  }
                },
                error: function()
                {
										$("#mapstoreacc").fadeIn(2000).html('<div style="text-align:center;font-size:16px;color:#5CB85C;font-family: Open Sans, sans-serif;">Operation failed</div>');
                }
            });
  }
  function preMapCallReject(pid) {
    $.ajax(
            {
                url : '/areasofrejection',
                type: "POST",
                data: {data: pid},
                beforeSend: function ()
                {
                   $('#mapstorerej').html('<div><i class="fa fa-refresh fa-spin"></i></div>');
                },
                success:function(response)
                {
                  var areas = JSON.parse(response).data.map(obj => obj);
                  if (areas.length === 0) {
                    AreaRejectionMapFuncNoData();
                  } else {
                    AreaRejectionMapFunc(areas, areas[0].latitude, areas[0].longitude);
                  }
                },
                error: function()
                {
										$("#mapstorerej").fadeIn(2000).html('<div style="text-align:center;font-size:16px;color:#5CB85C;font-family: Open Sans, sans-serif;">Operation failed</div>');
                }
            });
  }
  function makeBarChartHighLikes(areas) {
    var load = areas.split(',');
    $.ajax(
            {
                url : '/chartsreviewlikes',
                type: "POST",
                data: {data1: load[0], data2: load[1], data3: load[2]},
                beforeSend: function ()
                {
                   $('#productsreviewlikes').html('<div><i class="fa fa-refresh fa-spin"></i></div>');
                },
                success:function(response)
                {
                  const areasX = JSON.parse(response).data.map(obj => obj);
                  var _load = areasX;
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
                },
                error: function()
                {
										$("#productsreviewlikes").fadeIn(2000).html('<div style="text-align:center;font-size:16px;color:#5CB85C;font-family: Open Sans, sans-serif;">Operation failed</div>');
                }
            });
  }
  function makeBarChartHighDisLikes(areas) {
    var load = areas.split(',');
    $.ajax(
            {
                url : '/chartsreviewdislikes',
                type: "POST",
                data: {data1: load[0], data2: load[1], data3: load[2]},
                beforeSend: function ()
                {
                   $('#productsreviewdislikes').html('<div><i class="fal fa-spinner-third"></i></div>');
                },
                success:function(response)
                {
                  const areasX = JSON.parse(response).data.map(obj => obj);
                  var _load = areasX;
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
                },
                error: function()
                {
										$("#productsreviewdislikes").fadeIn(2000).html('<div style="text-align:center;font-size:16px;color:#5CB85C;font-family: Open Sans, sans-serif;">Operation failed</div>');
                }
            });

  }
  function makeBarChartHighRating(areas) {
    var load = areas.split(',');
    $.ajax(
            {
                url : '/chartsreviewrating',
                type: "POST",
                data: {data1: load[0], data2: load[1], data3: load[2]},
                beforeSend: function ()
                {
                   $('#productsreviewrating').html('<div><i class="fal fa-spinner-third"></i></div>');
                },
                success:function(response)
                {
                  const areasX = JSON.parse(response).data.map(obj => obj);
                  var _load = areasX;
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
                },
                error: function()
                {
										$("#productsreviewrating").fadeIn(2000).html('<div style="text-align:center;font-size:16px;color:#5CB85C;font-family: Open Sans, sans-serif;">Operation failed</div>');
                }
            });
  }
  function loadCompetitors1(title) {
    $.ajax(
            {
                url : '/productsAPICompetitor',
                type: "POST",
                data: {data: title},
                beforeSend: function ()
                {
                   $('#firstCompetitor').html('<div><i class="fal fa-spinner-third"></i></div>');
                },
                success:function(response)
                {
                  $('#firstCompetitor').empty().html(response);
                },
                error: function()
                {
                    $("#firstCompetitor").fadeIn(2000).html('<div style="text-align:center;font-size:16px;color:#5CB85C;font-family: Open Sans, sans-serif;">Operation failed</div>');
                }
            });
  }
  function loadCompetitors2(title) {
    $.ajax(
            {
                url : '/productsAPICompetitor',
                type: "POST",
                data: {data: title},
                beforeSend: function ()
                {
                   $('#secondCompetitor').html('<div><i class="fal fa-spinner-third"></i></div>');
                },
                success:function(response)
                {
                  $('#secondCompetitor').empty().html(response);
                },
                error: function()
                {
                    $("#secondCompetitor").fadeIn(2000).html('<div style="text-align:center;font-size:16px;color:#5CB85C;font-family: Open Sans, sans-serif;">Operation failed</div>');
                }
            });
  }
  function prRecommended(products) {
    var load = products.split(',');
    $.ajax(
            {
                url : '/productrecommendation',
                type: "POST",
                data: {data1: load[0], data2: load[1], data3: load[2]},
                beforeSend: function ()
                {
                  $('#productsrecommendation').html('<div><i class="fal fa-spinner-third"></i></div>');
                },
                success:function(response)
                {
                  $('#productsrecommendation').empty().html(response);
                },
                error: function()
                {
                  $("#productsrecommendation").fadeIn(2000).html('<div style="text-align:center;font-size:16px;color:#5CB85C;font-family: Open Sans, sans-serif;">Operation failed</div>');
                }
              });
  }
