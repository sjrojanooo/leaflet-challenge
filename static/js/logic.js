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

  platesData = L.geoJSON(platesData, {style: faultLines});


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
      "Satellite": satellitemap,
      "Grayscale": lightmap,
      "Outdoors": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
      Earthquakes: earthquakes,
      Faultlines: platesData
  };

  var myMap = L.map("map", {
    center: [40.851824075995296, -116.39751334605495],
    zoom: 4,
    layers: [satellitemap, earthquakes, platesData]
  });

  L.tileLayer(mapBox).addTo(myMap);

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control
      .layers(baseMaps, overlayMaps, {
          collapsed: false
      }).addTo(myMap);


  function colorMagnitude(data) {
    // using ? is a shorter way of saying an if statement
    return data < 1 ? "green":
           data < 2 ? "yellowgreen":
           data < 3 ? "yellow":
           data < 4 ? "orange":
           data < 5 ? "darkorange":
                      "red";
  }

  var magnitudeLegend = L.control({position: "bottomright"});

  magnitudeLegend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "magnitude legend"),
      magScale = [0, 1, 2, 3, 4, 5],
      magnitudeLabels = [];

      for (var i=0; i<magScale.length; i++) {
        div.innerHTML += '<i style="background:' + colorMagnitude(magScale[i]) + '"></i>' + 
                          magScale[i] + (magScale[i+1] ? '&ndash;' + magScale[i+1] + '<br>' : '+'); 
      }

      return div;
  };

  magnitudeLegend.addTo(myMap);

  var timeInterval = function (earthquakeData) {
    return {start: earthquakeData.properties.time,
            end: earthquakeData.properties.time + earthquakeData.mag};
  };

  var timelineControl = L.timelineSliderControl({
    formatOutput: function(date) {
      return new Date(date).toString();
    }
  });

  timelineControl.addTo(myMap);
  timeInterval.addTo(myMap);

}