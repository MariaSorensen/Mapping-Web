// Creating map object
var map = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var geojson;
// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  function chooseColor(mag) {
      switch (true) {
          case (mag > 5):
            return "#cc0000";
          case (mag > 4):
            return "#ff3300";
          case (mag > 3):
            return "#ff8c1a";
          case (mag > 2):
            return "#ffcc00";
          case (mag > 1):
            return "#ffff66";
          case (mag > 0):
            return "#ace600";
          default:
            return "#99ccff";
      }
  }
    function geojsonMarkerOptions(feature) {
      return {
      fillColor: chooseColor(feature.properties.mag),
      radius: feature.properties.mag * 3,
      color: "#000",
      weight: .5,
      fillOpacity: 0.75
      };
  }
  // Creating a GeoJSON layer with the retrieved data
  L.geoJSON(data, {
        pointToLayer: function (feature,latlng) {
          // Must convert to string, .bindTooltip can't 
          //  use straight 'feature.properties.<keyvalue>'
          
          return new L.CircleMarker(latlng);
        },
        style:geojsonMarkerOptions,
  
  // Binding a pop-up to each layer
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.place + "<br>Magnitude:<br>" + feature.properties.mag);
    }
  }).addTo(map); 

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [],
      
			from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background-color:'+ chooseColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};


  // Adding legend to the map
  legend.addTo(map);

});

