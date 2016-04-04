function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

var ion = new Ion('testcanvas');

var $select = $('#shape');
for(var key in ion.shapes) {
	$select.append('<option value="'+key+'">'+key+'</option>');
}

ion.setOptions({
	canvasBackground: convertHex($('#canvasBackground').val(), 100)
});


ion.setParticles({
	shape: $('#shape').val(),
	color: convertHex($('#color').val(), parseInt($('#colorOpacity').val())),
	density: parseInt($('#density').val()),
	maxLife: parseInt($('#maxLife').val()),
	spawnRate: parseInt($('#spawnRate').val()),
	minSize: parseInt($('#minSize').val()),
	maxSize: parseInt($('#maxSize').val()),
	rotationDirection: $('#rotationDirection').val(),
	rotationVelocity: parseInt($('#rotationVelocity').val()),
	fade: $('#fade').val(),
	fadeSpeed: parseInt($('#fadeSpeed').val()),
	gravity: parseInt($('#gravity').val())*0.1,
	wind: parseInt($('#wind').val())*0.1,
	borderColor: convertHex($('#borderColor').val(), parseInt($('#borderOpacity').val())),
	borderWidth: parseInt($('#borderWidth').val())
});


ion.start();

$('input, select').on('change', function() {


	$('#testcanvas').remove();
	$('header').before('<canvas id="testcanvas"></canvas>');

	if($(this).attr('type') == 'checkbox') {
		$(this).parents('fieldset').removeClass('disabled').find('input, select').prop('disabled', false);
	}

	var spawnRate = 0,
		color = 'rgba(0,0,0,0)',
		rotationVelocity = 0,
		gravity = 0,
		wind = 0,
		border = false,
		fade = false,
		fadeSpeed = 0,
		borderColor = 'rgba(0,0,0,0)',
		borderWidth = 0;

	if($('#spawnBool').is(':checked')) {
		spawnRate = parseInt($('#spawnRate').val());
	}
	if($('#colorBool').is(':checked')) {
		color = convertHex($('#color').val(), parseInt($('#colorOpacity').val()));
	}
	if($('#borderBool').is(':checked')) {
		borderColor = convertHex($('#borderColor').val(), parseInt($('#borderOpacity').val()));
		borderWidth = parseInt($('#borderWidth'));
	}
	if($('#gravityBool').is(':checked')) {
		gravity = parseInt($('#gravity').val())*0.1;
	}
	if($('#windBool').is(':checked')) {
		windBool = parseInt($('#wind').val())*0.1;
	}
	if($('#rotationBool').is(':checked')) {
		rotationVelocity = parseInt($('#rotationVelocity').val())*0.01;
	}
	if($('#fadeBool').is(':checked')) {
		fade = $('#fade').val();
		fadeSpeed = parseInt($('#fadeSpeed').val());
	}

	var ion =  new Ion('testcanvas', {
		shape: $('#shape').val(),
		color: color,
		density: parseInt($('#density').val()),
		maxLife: parseInt($('#maxLife').val()),
		spawnRate: spawnRate,
		minSize: parseInt($('#minSize').val()),
		maxSize: parseInt($('#maxSize').val()),
		rotationVelocity: rotationVelocity,
		rotationDirection: $('#rotationDirection').val(),
		fade: fade,
		fadeSpeed: fadeSpeed,
		gravity: gravity,
		wind: wind,
		borderColor: borderColor,
		borderWidth: borderWidth
	}, {
		frameRate: parseInt($('#frameRate').val()),
		canvasBackground: convertHex($('#canvasBackground').val(), 100)
	});

	console.log(ion);

});