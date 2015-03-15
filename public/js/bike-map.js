function initialize() {
	
  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(40.789936, -77.856348),
    disableDefaultUI: true
  };

  var pos = $('#map-placeholder').position();
  var cell = $('#map-placeholder').parent();
  cell.append("<div id='real-map'></div>");
  
  $('#real-map').css('left', pos.left + 'px');
  $('#real-map').css('top', pos.top + 'px');
  $('#real-map').css('width', '58.5%');
  $('#real-map').css('height', '56%');
  $('#real-map').css('z-index', '5');

  $('#map-placeholder').html('');

  var map = new google.maps.Map(document.getElementById('real-map'),
      mapOptions);
  
  var hc1 = new google.maps.LatLng(40.790232, -77.855726);
  
  var hc2 = new google.maps.LatLng(40.789087, -77.858451);

  var hc3 = new google.maps.LatLng(40.789436, -77.856348);
  
  var marker1 = new google.maps.Marker({
      position: hc1,
      map: map,
      title:"Hype Cycle 1"
  });  

  var marker2 = new google.maps.Marker({
      position: hc2,
      map: map,
      title:"Hype Cycle 2"
  });  

  var marker3 = new google.maps.Marker({
      position: hc3,
      map: map,
      title:"Hype Cycle 3"
  });  

}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=false&callback=initialize';
  document.body.appendChild(script);
}

$(function() {
	
	loadScript();
	
});