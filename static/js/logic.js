var mapBox = "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" + 
"access_token=pk.eyJ1Ijoic2pyb2phbm8iLCJhIjoiY2tqcHpobTljMWQybjJ4bGVoY3RmYWVpOSJ9.gHa1inmOrpUBLiij5Ce34w";

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";


d3.json(queryUrl, function(data) {

  d3.json(platesUrl, function(plates_data) {

    createFeatures(data.features, plates_data.features);
  });
});

function createFeatures(earthquakeData, platesData) {

  var latitude = [];
  var longitude = [];
  var allMagnitude = [];
  var allLocation = [];
  var allTime = [];

  var markers = [];

  for (var i=0; i<earthquakeData.length; i++) {
    var magnitude = earthquakeData[i]["properties"]["mag"];
    var location = earthquakeData[i]["properties"]["place"];
    var time = earthquakeData[i]["properties"]["time"];
    

    if (magnitude < 1) {
      markers.push(
      L.circle([earthquakeData[i]["geometry"]["coordinates"][1], earthquakeData[i]["geometry"]["coordinates"][0]], 
      {fillColor: "green",
      stroke: false,
      fillOpacity: 0.5,
      radius: (magnitude * 50) + 20000})
      .bindPopup("<h4>" + location + "<br>Magnitude" + magnitude)
      );
    }

    else if (magnitude >=1 && magnitude < 2) {
      markers.push(
        L.circle([earthquakeData[i]["geometry"]["coordinates"][1], earthquakeData[i]["geometry"]["coordinates"][0]],
        {fillColor: "lightgreen",
        stroke: false,
        fillOpacity: 0.5,
        radius: (magnitude * 50) + 40000})
        .bindPopup("<h4>" + location + "<br>Magnitude" + magnitude)
      );
    }

    else if (magnitude >=2 && magnitude < 3) {
      markers.push(
        L.circle([earthquakeData[i]["geometry"]["coordinates"][1], earthquakeData[i]["geometry"]["coordinates"][0]],
        {fillColor: "yellow",
        stroke: false,
        fillOpacity: 0.5,
        radius: (magnitude * 50) + 60000})
        .bindPopup("<h4>" + location + "<br>Magnitude" + magnitude)
      );
    }

    else if (magnitude >=3 && magnitude < 4) {
      markers.push(
        L.circle([earthquakeData[i]["geometry"]["coordinates"][1], earthquakeData[i]["geometry"]["coordinates"][0]], 
        {fillColor: "orange",
        stroke: false,
        fillOpacity: 0.5,
        radius: (magnitude * 30) + 80000})
        .bindPopup("<h4>" + location + "<br>Magnitude" + magnitude)
      );
    }

    else if (magnitude >=4 && magnitude < 5) {
      markers.push(
        L.circle([earthquakeData[i]["geometry"]["coordinates"][1], earthquakeData[i]["geometry"]["coordinates"][0]],
        {fillColor: "darkorange",
        stroke: false,
        fillOpacity: 0.5,
        radius: (magnitude * 50) + 100000})
        .bindPopup("<h4>" + location + "<br>Magnitude" + magnitude)
      );
    }

    else if (magnitude >=5) {
      markers.push(
        L.circle([earthquakeData[i]["geometry"]["coordinates"][1], earthquakeData[i]["geometry"]["coordinates"][0]],
        {fillColor: "red",
        stroke: false,
        fillOpacity: 0.5,
        radius: (magnitude * 50) + 120000})
        .bindPopup("<h4>" + location + "<br>Magnitude" + magnitude)
      );
    }
  }
  var earthquakes = L.layerGroup(markers);

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
  "T6YbdDixkOBWH_k9GbS8JQ");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
  "T6YbdDixkOBWH_k9GbS8JQ");

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" + 
  "access_token=pk.eyJ1IjoiamVubnljaGluNjUwIiwiYSI6ImNqZHdnbGEzbDQzazAzNHFoaXNzenR4Z2MifQ.Tjt7336QJMX553gETPX9Ag");

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
  "T6YbdDixkOBWH_k9GbS8JQ");

  // Define plates layer
  var faultLines = {
    "fillColor": "orange",
    "weight": 2,
    "color": "orange",
    "fillOpacity": 0
  }



}