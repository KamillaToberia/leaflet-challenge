//Store the API query variables
//let baseURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


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
  

function createMap(_earthquakes) {
  //let tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

  
  //create tile layer Mapbox Satellite
  let satellite=L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token={pk.eyJ1Ijoia2FtaWxsYXRvYmVyaWEiLCJhIjoiY2x0MzU1YjdoMXc0cTJpcDQzdXoydzkxeiJ9.U53l-AGZErhUJP2J1TtZBA}', {
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors',
    style: 'mapbox/satellite-v9',
  });

  let grayscale=L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token={pk.eyJ1Ijoia2FtaWxsYXRvYmVyaWEiLCJhIjoiY2x0MzU1YjdoMXc0cTJpcDQzdXoydzkxeiJ9.U53l-AGZErhUJP2J1TtZBA}', {
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors',
    style: 'mapbox/satellite-v11',
  });

  let outdoors=L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token={pk.eyJ1Ijoia2FtaWxsYXRvYmVyaWEiLCJhIjoiY2x0MzU1YjdoMXc0cTJpcDQzdXoydzkxeiJ9.U53l-AGZErhUJP2J1TtZBA}', {
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors',
    style: 'mapbox/satellite-v12',
  });
  
  tectonicPlates= new L.layerGroup();

    // Get request with d3
    d3.json(tectonicUrl).then(function (plates) {

      console.log(plates);
      L.geoJSON(plates, {
        color:"orange",
        weight:4
      }).addTo(tectonicPlates);
    });

    //baseMaps
    let baseMaps ={
      "Satellite": satellite,
      "Grayscale": grayscale,
      "Outdoors": outdoors
    };

    // Overlay
    let overlayMaps= {
      "Earthquakes": _earthquakes,
      "Tectonic Plates": tectonicPlates
   };

   let myMap=L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom:5,
    layers:[satellite, _earthquakes, tectonicPlates]
   });

   let legend= L.control({position: "bottomright"});
   legend.onAdd=function() {
    let div= L.DomUtil.create("div", "info legend"),
    depth=[-10, 10, 30, 50, 70,90];

    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
    
    for (let i=0; i < depth.length; i++) {
      div.innerHTML +=
      '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;

   };
   legend.addTo(myMap)

   //Layer control
   L.control.layers(baseMaps, overlayMaps, {
    collapsed:false
   }).addTo(myMap);



};
