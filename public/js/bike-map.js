function initialize() {
	
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(40.791686, -77.856176),
    disableDefaultUI: true
  };

  $('#map-placeholder').css('width', '55%');
  $('#map-placeholder').css('height', '50%');


  var map = new google.maps.Map(document.getElementById('map-placeholder'),
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