//mapbox api key and link
var mapBox = "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" + 
"access_token=pk.eyJ1Ijoic2pyb2phbm8iLCJhIjoiY2tqcHpobTljMWQybjJ4bGVoY3RmYWVpOSJ9.gHa1inmOrpUBLiij5Ce34w";

//url to query all of the historic geojson earthquake data 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//geojson data of the tectonic 
var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

//reading and creating a function for both geojson data sets 
//calling out the features collection in the geojson data set 
d3.json(queryUrl, function(data) {

  d3.json(platesUrl, function(plates_data) {

    features(data.features, plates_data.features);
  });
});

//function that will be used to manipulate the data that is being stored in features 
function features(earthquakeData, platesData) {

  //creating empty lists for necessary variables for all data values that will be extracted from the data sets 
  var latitude = []; 
  var longitude = [];
  var allMagnitude = [];
  var allLocation = [];
  var allTime = [];

  var markers = [];

  //for loop that will append magnitude, location and time data from the properties collections of the data sets
  for (var i=0; i<earthquakeData.length; i++) {
    var magnitude = earthquakeData[i]["properties"]["mag"];
    var location = earthquakeData[i]["properties"]["place"];
    var time = earthquakeData[i]["properties"]["time"];
    
    //if the magnitude is less than 1 then the fill color will be green and dimensions are given by the radius
    //colors are given by level of magnitude
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
  } //end of the for loop 
  
  //defining earthquake layergroup markers
  var earthquakes = L.layerGroup(markers);

  //defining the tile layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
  "T6YbdDixkOBWH_k9GbS8JQ");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
  "T6YbdDixkOBWH_k9GbS8JQ");

  
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" + 
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

  plates = L.geoJSON(plates, {style: faultLines});


  // Define a baseMaps object to hold  base layers
  var base = {
      "Satellite": satellite,
      "Grayscale": lightmap,
      "Outdoors": streetmap
  };

  // Create overlay object to hold  overlay layer
  var overlay = {
      Earthquakes: earthquakes,
      Faultlines: plates
  };

  var myMap = L.map("map", {
    center: [40.851824075995296, -116.39751334605495],
    zoom: 4,
    layers: [satellite, earthquakes, plates]
  });

  L.tileLayer(mapBox).addTo(myMap);

  // creating a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control
      .layers(base, overlay, {
          collapsed: false
      }).addTo(myMap);


  function colorMag(data) {
    // using ? is a shorter way of saying an if statement
    return data < 1 ? "green":
           data < 2 ?"yellowgreen":
           data < 3 ? "yellow":
           data < 4 ? "orange":
           data < 5 ? "darkorange":
                      "red";
  }
  ///creating our legen
  var legend = L.control({position: "bottomright"});

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "magnitude legend"),
      magScale = [0, 1, 2, 3, 4, 5],
      magnitudeLabels = [];

      for (var i=0; i<magScale.length; i++) {
        div.innerHTML += '<i style="background:' + colorMag(magScale[i]) + '"></i>' + 
                          magScale[i] + (magScale[i+1] ? '&ndash;' + magScale[i+1] + '<br>' : '+'); 
      }

      return div;
  };

  legend.addTo(myMap);

  var timeInterval = function (earthquakeData) {
    return {start: earthquakeData.properties.time,
            end: earthquakeData.properties.time + earthquakeData.mag};
  };

  var timeline = L.timelineSliderControl({
    formatOutput: function(date) {
      return new Date(date).toString();
    }
  });

  timeline.addTo(myMap);
  timeInterval.addTo(myMap);

}