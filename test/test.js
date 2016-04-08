function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}


function getAbsValue(val) {
	return Math.abs(parseFloat(val));
}

function decimalPlaces(num) {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0)
       // Adjust for scientific notation.
       - (match[2] ? +match[2] : 0));
}

$('.range-slider').each(function() {
	var ranges = $(this).find('input[type="range"]'),
		min = ranges.first(),
		max = ranges.last();


	noUiSlider.create(this, {
		start: [getAbsValue(min.val()), getAbsValue(max.val())],
		connect: true,
		step: getAbsValue(min.attr('step')),
		format: wNumb({ decimals: 0 }),
		range: {
			'min': getAbsValue(min.attr('min')),
			'max': getAbsValue(max.attr('max'))
		}
	});
});

$('.range').each(function() {


	var range = $(this).find('input[type="range"]'),
		val = getAbsValue(range.val());

	console.log(wNumb({ decimals: decimalPlaces(val) }));

	var opts = {
		start: val,
		step: getAbsValue(range.attr('step')),
		format: wNumb({ decimals: decimalPlaces(val) }),
		connect: "lower",
		range: {
			'min': getAbsValue(range.attr('min')),
			'max': getAbsValue(range.attr('max'))
		}
	};
	noUiSlider.create(this, opts);
});



var ion = new Ion('testcanvas');

var $select = $('#shape');
for(var key in ion.shapes) {
	$select.append('<option value="'+key+'">'+key+'</option>');
}

$('select').not('.disabled').material_select();

ion.setOptions({
	canvasBackground: convertHex($('#canvasBackground').val(), 100)
});

var size = $('.size .range-slider')[0].noUiSlider.get();

ion.setParticles({
	shape: $('#shape').val(),
	color: convertHex($('#color').val(), getAbsValue($('#colorOpacity').val())),
	density: getAbsValue($('#density').val()),
	maxLife: getAbsValue($('#maxLife').val()),
	spawnRate: getAbsValue($('#spawnRate').val()),
	minSize: getAbsValue(size[0]),
	maxSize: getAbsValue(size[1]),
	rotationDirection: $('#rotationDirection').val(),
	rotationVelocity: getAbsValue($('#rotationVelocity').val()),
	fade: false,
	fadeSpeed: getAbsValue($('#fadeSpeed').val()),
	gravity: getAbsValue($('#gravity').val()),
	wind: getAbsValue($('#wind').val()),
	borderColor: convertHex($('#borderColor').val(), getAbsValue($('#borderOpacity').val())),
	borderWidth: getAbsValue($('#borderWidth').val()),
	originX: 'random',
	originY: 'random'
});

ion.start();

$('#immortal').on('change', function() {
	if($(this).is(':checked')) {
		$('#maxLife').prop('disabled', true);
	} else {
		$('#maxLife').prop('disabled', false);
	}
});

$('.color-field input').focus(function() {
	$(this).parents('.color-field').addClass('focus');
}).blur(function() {
	$(this).parents('.color-field').removeClass('focus');
});

$('.switch input[type="checkbox"]').on('change', function() {
	if($(this).is(":checked")) {
		$(this).parents('fieldset').removeClass('disabled').find('input, select').not('[id*="Bool"]').prop('disabled', false);
	} else {
		$(this).parents('fieldset').addClass('disabled').find('input, select').not('[id*="Bool"]').prop('disabled', true);
	}
});

$('.random input[type="checkbox"]').on('change', function() {
	if($(this).is(":checked")) {
		$(this).parents('fieldset').addClass('disabled').find('input, select').not('[id*="Bool"], [id*="Randomize"]').prop('disabled', true);
	} else {
		$(this).parents('fieldset').removeClass('disabled').find('input, select').not('[id*="Bool"], [id*="Randomize"]').prop('disabled', false);
		
	}
});

$('input, select').on('change', function() {


	$('#testcanvas').remove();
	$('header').before('<canvas id="testcanvas"></canvas>');
	

	var spawnRate = 0,
		color = 'rgba(0,0,0,0)',
		rotationVelocity = 0,
		gravity = 0,
		wind = 0,
		border = false,
		fade = false,
		fadeSpeed = 0,
		borderColor = 'rgba(0,0,0,0)',
		borderWidth = 0,
		orient = 0,
		rotationDirection = false,
		fade = false,
		originX = $('[name="originXPreset"]:checked').val(),
		originY = $('[name="originYPreset"]:checked').val();
		size = $('.size .range-slider')[0].noUiSlider.get();


	if(!isNaN(parseInt(originX))) {
		originX = getAbsValue(originX);
	}

	if(!isNaN(parseInt(originY))) {
		originY = getAbsValue(originY);
	}

	if($('#spawnBool').is(':checked')) {
		spawnRate = getAbsValue($('#spawnRate').val());
	}
	if($('#colorBool').is(':checked')) {
		color = convertHex($('#color').val(), getAbsValue($('#colorOpacity').val()));
	}
	if($('#borderBool').is(':checked')) {
		borderColor = convertHex($('#borderColor').val(), getAbsValue($('#borderOpacity').val()));
		borderWidth = getAbsValue($('#borderWidth').val());
	}
	if($('#gravityBool').is(':checked')) {
		gravity = getAbsValue($('#gravity').val());
	}
	if($('#windBool').is(':checked')) {
		wind = getAbsValue($('#wind').val());
	}
	if($('#rotationBool').is(':checked')) {
		rotationVelocity = getAbsValue($('#rotationVelocity').val())*0.01;
	}
	if($('#fadeBool').is(':checked')) {
		fade = $('#fade').val();
		fadeSpeed = getAbsValue($('#fadeSpeed').val());
	}

	if(!$('#immortal').is(':checked')) {
		maxLife == false;
	}

	if(originX == "custom") {
		$('#originX').prop('disabled', false);
		originX = getAbsValue($('#originX').val());
	}
	if(originY == "custom") {
		$('#originY').prop('disabled', false);
		originY = getAbsValue($('#originY').val());
	}

	var ion =  new Ion('testcanvas', {
		shape: $('#shape').val(),
		color: color,
		density: getAbsValue($('#density').val()),
		maxLife: getAbsValue($('#maxLife').val()),
		spawnRate: spawnRate,
		minSize: getAbsValue(size[0]),
		maxSize: getAbsValue(size[1]),
		rotationVelocity: rotationVelocity,
		rotationDirection: $('#rotationDirection').val(),
		fade: fade,
		fadeSpeed: fadeSpeed,
		gravity: gravity,
		wind: wind,
		borderColor: borderColor,
		borderWidth: borderWidth,
		originX: originX,
		originY: originY
	}, {
		frameRate: getAbsValue($('#frameRate').val()),
		canvasBackground: convertHex($('#canvasBackground').val(), 100)
	});

});
