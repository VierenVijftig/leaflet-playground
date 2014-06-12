//The Map
var map;
var markers = new Array();
var currentQuery = '';
var cdkLayer;
var cdkFeatureGroup;

$( document ).ready(function() {

	//This uses MapQuest
	var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
	'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	mbUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
	mb = new L.tileLayer(mbUrl,  {id: 'examples.map-i86knfo3', attribution: mbAttr, maxZoom: 18});

	var AMSTERDAM = [52.373056, 4.892222];

	//To use OpenStreetMap
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
	osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});
    // osm.addTo(map);
	// map.setView(new L.LatLng(51.538594, -0.198075), 12).addLayer(osm);
	//End OpenStreetMap

	map = L.map('map', {layers: [mb, osm]}).setView(AMSTERDAM, 13);

	//Add a marker
	var marker = L.marker(AMSTERDAM);	
	map.addLayer(marker);
	markers[marker._leaflet_id] = marker;

	//Base map layers (OSM or MapBox)
	var baseMaps = {
		"MapBox": mb,
		"OpenStreetMap": osm
	};

	L.control.layers(baseMaps).addTo(map);

	//Add the cdk FeatureGroup
	cdkFeatureGroup = new L.LayerGroup(Array()).addTo(map);

	//Add the Locate control
	L.control.locate().addTo(map);

	// //Add the callbacks to load data from OSM API (Overpass)
	// map.on('load', onMapMove);
	// map.on('moveend', onMapMove);
	map.on('moveend', loadQuery);

	//Locate the user
	locateUser();


	//This code from Waag

    // var lineStyle = {
    //   color: randomColor(),
    //   weight: 3,
    //   opacity: 0.90
    // };

    map.on('click', function(e) {
    	addBouncingMarker(e.latlng);
	});


    cdkLayer = new L.geoJson(null, {
      style: lineStyle(),
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, pointStyle);
      }
    }).addTo(map);

    //End Waag code

    getBorders();

	
});

function onFeatureClick(e) {
  feature = e.target.feature;
  // setNodeData(feature.properties);
  // alert(feature.properties);
  
}

function onEachFeature(feature, layer) {
  // layer.on('click', onFeatureClick);
  var popupContent = JSON.stringify(feature.properties, undefined, 2);
  layer.bindPopup(popupContent);
}

function randomColor(){
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function lineStyle(){
	var lineStyle = {
      color: randomColor(),
      weight: 3,
      opacity: 0.90
	};
return lineStyle;
}

function getBorders(){

	var url = "http://api.citysdk.waag.org/admr.nl.amsterdam/nodes?admr::admn_level=5&layer=osm&per_page=200&geom=true";
	 $.getJSON(url, function(data) {
        // If data is returned, and data.results.length > 0,
        // add URL to urlHistory

         for (var i = 0; i < data.results.length; i++) {
           var node = data.results[i];

           if(node.geom) {
             var geom = node.geom
             delete node["geom"];
             var feature = {
               type: "Feature",
               properties: node,
               geometry: geom
             };
           } else if(node.bbox) {
             var geom = node.bbox
             delete node["bbox"];
             var feature = {
               type: "Feature",
               properties: node,
               geometry: geom
             };

           } else {
             continue;
           }
           // cdkLayer.addData(feature);

         	cdkL = new L.geoJson(feature, {
      			style: lineStyle(),
      			onEachFeature: onEachFeature,
      			pointToLayer: function (feature, latlng) {
    			return L.circleMarker(latlng, pointStyle);
      		}
    		});
    		cdkFeatureGroup.addLayer(cdkL);

         }
         // formatResult(data);

         // spinner.stop();

         // /*
         // We want to fit all the data on the map.
         // Normally, map.fitBounds(cdkLayer.getBounds())
         // would do. But the floatbox is obscuring part
         // of the map.
         // We must calculate the bounds of the data
         // and resize the width to include floatbox width
         // */

         // var dataBounds = cdkLayer.getBounds();
         // var southWest = dataBounds.getSouthWest();
         // var northEast = dataBounds.getNorthEast();
         // // TODO: Dit is dus NIET goed. Ik moet hier nog 'ns even goed over na gaan denken. Nu naar bed. Daag!

         // var lngScale = $("#map").width() / (($("#map").width() - ($("#floatbox").width() + 30)));

         // map.fitBounds([
         //     [southWest.lat, southWest.lng],
         //     [northEast.lat, (northEast.lng - southWest.lng) * lngScale + southWest.lng]
         // ]);

       }).fail(function(e) {
         if(e.responseText)
		   {
		   		var data = $.parseJSON(e.responseText);
               	formatResult(data)
             }
		   else
		   {
		   		alert("unknown error");
				// $('#nodedata').html("unknown error (maybe server is unavailable / maybe the requested was not formatted correctly)")
		   }
     });
}

function addBouncingMarker(latlng)
{
	var bouncingMarker = L.marker(latlng, 
	{ 	
		riseOnHover: true,
		riseOffset: 300,
		bounceOnAdd: true, 
		bounceOnAddOptions: {duration: 500, height: 100}, 
		bounceOnAddCallback: function() {
			// console.log("done");
			// bouncingMarker.animate({opacity: 0.25,width: "70%"}, {
			// 	queue: false,
			// 	duration: 3000
			// });
			newLatLng = latlng;
			newLatLng.lat = latlng.lat+0.001;
			
			var myInt=setInterval(function(){
			bouncingMarker.setLatLng(newLatLng);
			var myInt2=setInterval(function(){
				// map.removeLayer(bouncingMarker);	
			},1000);
			window.clearInterval(myInt);
			},1000);


		}
	}).addTo(map);
}

function locateUser(){
	    map.locate({setView: true, watch: true}) /* This will return map so you can do chaining */
        .on('locationfound', function(e){
        		
    		//Remove all markers
    		markers.forEach(function(entry){
				// var marker = map.getLayer(entry);
				map.removeLayer(entry);
			});

            var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your location');
            markers[marker._leaflet_id] = marker;
            var circle = L.circle([e.latitude, e.longitude], e.accuracy/2, {
                weight: 1,
                color: 'blue',
                fillColor: '#cacaca',
                fillOpacity: 0.2
            });
            map.addLayer(marker);
            map.addLayer(circle);
        })
       .on('locationerror', function(e){
            console.log(e);
            // alert("Location access denied.");
        });
}

function onMapMove(){
	//Called when the map is moved
	var bounds = map.getBounds(); //this is an object of type latLngBounds http://leafletjs.com/reference.html#latlngbounds
	var minLat = bounds.getSouth();
	var minLon = bounds.getWest();
	var maxLat = bounds.getNorth();
	var maxLon = bounds.getEast();
	//Load from OSM API OverPass
	var queryRecycling = 'http://overpass-api.de/api/interpreter?data=[out:json];node[amenity=recycling]('+ minLat +','+ minLon +','+ maxLat +','+ maxLon +');out;';
	$.getJSON(queryRecycling, function(data){
		//Debug
		// console.log(data);

		//Remove all markers
		markers.forEach(function(entry){
			// var marker = map.getLayer(entry);
			map.removeLayer(entry);
		});

		for (var i = data.elements.length - 1; i >= 0; i--) {
			e = data.elements[i]; //each "e" is a element returned from the query 
			//The icon
			 var greenIcon = L.AwesomeMarkers.icon({
    			icon: 'recycle',
    			prefix: 'fa', //use ony for font-awesome icon
    			markerColor: 'green',
    			iconColor: 'white'
  			});
			//The popup content
			var popupContent = '<p>id: '+e.id+'<br>amenity:'+ e.tags.amenity+'</p>'
  			var marker = L.marker([e.lat,e.lon], {icon: greenIcon}).addTo(map);
  			markers[marker._leaflet_id] = marker;
  			marker.bindPopup(popupContent);

		};

	});
}

$('#address').keyup(function(event) {
	event.preventDefault();
	//If Enter was pressed make a search
	if (event.keyCode == '13') {
		addr_search();
	}
	return false;
});

$('#button-go').click(function(event) {
	event.preventDefault();
	var elem = $( this );
	var searchString = $("#address").val();
	if (searchString.length > 0) { 
		addr_search();
	};
});


function addr_search() {

	var searchString = $("#address").val();

	$.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + searchString, function(data) {
		var items = [];

		$.each(data, function(key, val) {
		//Debug
		console.log(val.display_name);

		items.push(
			"<li><a href='#' onclick='chooseAddr(" +
				val.lat + ", " + val.lon + ");return false;'>" + val.display_name +
		'</a></li>'
		)});

		$('#results').empty();
		if (items.length != 0) {
			$('<p>', { html: "Search results:" }).appendTo('#results');
			$('<ul/>', {
				'class': 'my-new-list',
				html: items.join('')
			}).appendTo('#results');
		} else {
			$('<p>', { html: "No results found" }).appendTo('#results');
		}
	});
}


function chooseAddr(lat, lng, type) {
	var location = new L.LatLng(lat, lng);
	map.panTo(location);

	markers.forEach(function(entry){
		// var marker = map.getLayer(entry);
		map.removeLayer(entry);
	});

	var marker = L.marker([lat, lng]).addTo(map);
	markers[marker._leaflet_id] = marker;
	
	if (type == 'city' || type == 'administrative') {
		map.setZoom(11);
	} else {
		map.setZoom(13);
	}
}

function loadQuery(query){
	baseUrl = 'http://api.citysdk.waag.org/admr.nl.amsterdam/';
	var icon;
	if (query=='bike-park') {
		queryStr = baseUrl+'nodes?layer=divv.parking.bicycles&per_page=100';
		icon = L.AwesomeMarkers.icon({
		iconUrl: 'icons/bicycle.svg',
		iconRetinaUrl: 'icons/bicycle@2x.svg',
		markerColor: 'red',
		iconColor: 'white'
		});
	}
	else if(query=='car-park'){
		queryStr = baseUrl+'nodes?layer=divv.parking.car&per_page=100';
		icon = L.AwesomeMarkers.icon({
		prefix: 'fa',
		icon: 'fa-car',
		markerColor: 'red',
		iconColor: 'white'
		});
	}
	else{
		return false;
	}
	queryStr = queryStr + "&geom";

	$.getJSON(queryStr, function(data){
		//Debug
		console.log(data);

		//Remove all markers
		markers.forEach(function(entry){
			// var marker = map.getLayer(entry);
			map.removeLayer(entry);
		});

		for (var i = data.results.length - 1; i >= 0; i--) {
			result = data.results[i];
			name = result.name;
			coordinates = result.geom.coordinates;
			var lat = coordinates[1];
			var lon = coordinates[0];


			//The popup content
			var popupContent = '<p>'+result.name+'</p>'
  			var marker = L.marker([lat, lon], {icon: icon}).addTo(map);
  			markers[marker._leaflet_id] = marker;
  			marker.bindPopup(popupContent);

		};

	});

}

//Buttons

$('#car-park').click(function(event) {
	//User tapped to get the bike parkings
	event.preventDefault();
	currentQuery = 'car-park';
	loadQuery('car-park');
});

$('#bike-park').click(function(event) {
	//User tapped to get the bike parkings
	event.preventDefault();
	currentQuery = 'bike-park';
	loadQuery('bike-park');

});
