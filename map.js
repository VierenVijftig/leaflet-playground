//The Map
var map;
var markers = new Array();

$( document ).ready(function() {

	//This uses MapQuest
	var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
	'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	mbUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
	mb = new L.tileLayer(mbUrl,  {id: 'examples.map-i86knfo3', attribution: mbAttr, maxZoom: 18});

	// L.tileLayer(, {
	//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	//     maxZoom: 18
	// }).addTo(map);
	//end MapQuest

	//To use OpenStreetMap
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
	osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});
    // osm.addTo(map);
	// map.setView(new L.LatLng(51.538594, -0.198075), 12).addLayer(osm);
	//End OpenStreetMap

	map = L.map('map', {layers: [mb, osm]}).setView([45.54155, 10.21180], 13);

	//Add a marker
	var marker = L.marker([45.54155, 10.21180]);	
	map.addLayer(marker);
	markers[marker._leaflet_id] = marker;

	//Base map layers (OSM or MapBox)
	var baseMaps = {
		"MapBox": mb,
		"OpenStreetMap": osm
	};

	
	L.control.layers(baseMaps).addTo(map);

	
});

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
