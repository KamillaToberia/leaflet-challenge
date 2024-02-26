// Store the API query variables
let baseURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//set map
let myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//retreive data
d3.json(baseURL).then(function (data) {
  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: mapColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: mapRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function mapColor(depth) {
    switch(true) {
      case depth > 90:
        return "red";
      case depth > 70:
        return "orangered";
      case depth > 50:
        return "orange";
      case depth > 30:
        return "yellow";
      case depth > 10:
        return "lightyellow";
      default:
        return "lightgreen";

    }
  }

  function mapRadius(mag) {
    if(mag===0) {
      return 1;
    }
    return mag *4
  }

  //earthquake data
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: mapStyle,

    //Pop-up data
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude:" + feature.properties.mag + "<br>Location:" +feature.properties.place + "<br>Depth:" + feature.geometry.coordinates[2]);
    }
  }).addTo(myMap);
  })





