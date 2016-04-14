// function convertHex(hex,opacity){
//     hex = hex.replace('#','');
//     r = parseInt(hex.substring(0,2), 16);
//     g = parseInt(hex.substring(2,4), 16);
//     b = parseInt(hex.substring(4,6), 16);

//     result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
//     return result;
// }


function getAbsValue(val) {
	var number;
	if(typeof(val) == 'string') {
		number = Math.abs(parseFloat(val));
		if(val.match("-")) {
			number = -number;
		};
	} else {
		if(val < 0) {
			number = -Math.abs(number);
		} else {
			number = Math.abs(number);
		}
	}
	return number;
}

$.fn.rangeVal = function() {
	var $range
		$el = $(this);

	if($el.hasClass('range-slider') || $el.hasClass('range')) {
		$range = $el;
	} else {
		$range = $el.parents('[class*="range"]');
	}

	var val = $range[0].noUiSlider.get();

	if($.isArray(val)) {
		val.filter(function(el,i,arr) {
			arr[i] = getAbsValue(el);
		});
	} else {
		val = getAbsValue(val);
	}

	return val;
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

// Toolbox interface
// ========================================

// Initialize noUiSlider double-range inputs
$('.range-slider').each(function() {
	var ranges = $(this).find('input[type="range"]'),
		min = ranges.first(),
		max = ranges.last(),
		step = min.attr('step');

	noUiSlider.create(this, {
		start: [getAbsValue(min.val()), getAbsValue(max.val())],
		connect: true,
		step: getAbsValue(step),
		format: wNumb({ decimals: decimalPlaces(step) }),
		range: {
			'min': getAbsValue(min.attr('min')),
			'max': getAbsValue(max.attr('max'))
		}
	});

});

// Initialize noUiSlider single-range inputs
$('.range').each(function() {
	var range = $(this).find('input[type="range"]'),
		val = getAbsValue(range.val());

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

// Intialize custom materialize selects
$('select').material_select();

// Emulate field focus for custom color fields
$('.color-field input').focus(function() {
	$(this).parents('.color-field').addClass('focus');
}).blur(function() {
	$(this).parents('.color-field').removeClass('focus');
});

// Disable fieldsets when fieldset on/off switch is toggles
$('.switch input[type="checkbox"]').on('change', function() {
	if($(this).is(":checked")) {
		$(this).parents('fieldset').removeClass('disabled').find('input, select').not('[id*="Bool"]').prop('disabled', false);
		$(this).parents('fieldset').find('select').material_select();

	} else {
		$(this).parents('fieldset').addClass('disabled').find('input, select').not('[id*="Bool"]').prop('disabled', true);
		$(this).parents('fieldset').find('.caret').addClass('disabled');
	}
});

//Set the value of the hidden select when clicking on shape icons
$('fieldset.shape .fields ul li').click(function(e) {
	var shape = $(this).data('shape');
	$('fieldset.shape .fields ul li').removeClass('selected');
	$(this).addClass('selected');
	$('#shape').val($(this).data('shape')).trigger('change');
	if(shape == 'star' || shape == 'polygon') {
		$('.points-range').removeClass('disabled').find('input').prop('disabled', false);
	} else {
		$('.points-range').addClass('disabled').find('input').prop('disabled', true);
	}
	if(shape == 'star') {
		$('.girth-range').removeClass('disabled').find('input').prop('disabled', false);
	} else {
		$('.girth-range').addClass('disabled').find('input').prop('disabled', true);
	}
});

// Ion Particle Generator
// ========================================

// Start Ion on page load
var ion = new Ion('testcanvas');

ion.setOptions({
	canvasBackground: $('#canvasBackground').val()
});

ion.setParticles({
	strokeColor: $('#strokeColor').val(),
	strokeWidth: $('.strokeWidth-range').rangeVal(),
	strokeOpacity: $('.strokeOpacity-range').rangeVal(),
	color: $('#color').val(),
	density: $('#density').rangeVal(),
	death: false,
	fade: false,
	gravity: $('.gravity-range').rangeVal(),
	grow: false,
	colorOpacity: $('.colorOpacity-range').rangeVal(),
	origin: ['random', 'random'],
	rotationVelocity: 0,
	shape: $('#shape').val(),
	size: [4,10,35,90],
	spawnRate: $('#spawnRate').rangeVal(),
	spawnOrigin: ['random', 'bottom'],
	wind: $('.wind-range').rangeVal()
});

ion.start();


// Update Ion Generator on value changes
// ========================================

// Read values and re-initialize Ion Particle Generator with new settings
var updateCanvas = function() {

	// Clear the canvas & destroy the previous Ion Generator
	$('#testcanvas').remove();
	$('header').before('<canvas id="testcanvas"></canvas>');
	

	// Default values for settings when a fieldset is disabled or "off"
	var stroke = false,
		strokeColor = 'rgba(0,0,0,0)',
		strokeWidth = 0,
		color = 'rgba(0,0,0,0)',
		death = false,
		fade = false,
		fadeRate = 0,
		gravity = 0,
		colorOpacity = [10,30],
		orient = 0,
		origin,
		originX = $('[name="originXPreset"]:checked').val(),
		originY = $('[name="originYPreset"]:checked').val(),
		rotationDirection = false,
		rotationVelocity = 0,
		spawnOrigin,
		spawnOriginX = $('[name="spawnOriginXPreset"]:checked').val(),
		spawnOriginY = $('[name="spawnOriginYPreset"]:checked').val(),
		spawnRate = 0,
		wind = 0,
		scale = false,
		shape = $('#shape').val(),
		polygonPoints = false,
		starGirth = false;


	// Starting Population
	if(!isNaN(parseInt(originX))) {
		originX = getAbsValue(originX);
	}
	if(!isNaN(parseInt(originY))) {
		originY = getAbsValue(originY);
	}

	if(originX == "custom") {
		$('#originX').prop('disabled', false);
		originX = getAbsValue($('#originX').val());
	}
	if(originY == "custom") {
		$('#originY').prop('disabled', false);
		originY = getAbsValue($('#originY').val());
	}

	// Spawn
	if(!isNaN(parseInt(spawnOriginX))) {
		spawnOriginX = getAbsValue(spawnOriginX);
	}

	if(!isNaN(parseInt(spawnOriginY))) {
		spawnOriginY = getAbsValue(spawnOriginY);
	}

	if(spawnOriginX == "custom") {
		$('#spawnOriginX').prop('disabled', false);
		spawnOriginX = getAbsValue($('#spawnOriginX').val());
	}
	if(spawnOriginY == "custom") {
		$('#spawnOriginY').prop('disabled', false);
		spawnOriginY = getAbsValue($('#spawnOriginY').val());
	}

	spawnOrigin = [spawnOriginX, spawnOriginY];

	if($('#spawnBool').is(':checked')) {
		spawnRate = $('.spawnRate-range').rangeVal();
	}

	//Color
	if($('#colorBool').is(':checked')) {
		colorOpacity = $('.colorOpacity-range').rangeVal();
		if($('#colorRandomize').is(':checked')) {
			color = 'random';
		} else {
			color = $('#color').val();
		}
	}

	//Border
	if($('#strokeBool').is(':checked')) {
		strokeWidth = $('.strokeWidth-range').rangeVal();
		strokeOpacity = $('.strokeOpacity-range').rangeVal();
		if($('#strokeRandomize').is(':checked')) {
			strokeColor = 'random';
		} else {
			strokeColor = $('#strokeColor').val();
		}
	}

	//Gravity
	if($('#gravityBool').is(':checked')) {
		gravity = $('.gravity-range').rangeVal();
	}

	//Wind
	if($('#windBool').is(':checked')) {
		wind = $('.wind-range').rangeVal();
	}

	//Rotation
	if($('#rotationBool').is(':checked')) {
		orient = $('.orient-range').rangeVal();
		rotationVelocity = $('.rotationVelocity-range').rangeVal();
	}

	//Fade
	if($('#fadeBool').is(':checked')) {
		fade = $('#fade').val();
		fadeRate = $('.fadeRate-range').rangeVal();
	}

	//Life
	if($('#deathBool').is(':checked')) {
		death = $('.death-range').rangeVal();
	}

	//Size Dynamic
	if($('#scaleBool').is(':checked')) {
		scale = $('[name="scale"]:checked').val();
	}

	if(shape == 'star' || shape == 'polygon') {
		polygonPoints = $('.points-range').rangeVal();
	}

	if(shape == 'star') {
		starGirth = $('.girth-range').rangeVal();
	}

	// Create a new instance of Ion with the new settings
	var ion =  new Ion('testcanvas', {
		strokeColor: strokeColor,
		strokeWidth: strokeWidth,
		strokeOpacity: strokeOpacity,
		color: color,
		density: $('#density').rangeVal(),
		death: death,
		fade: fade,
		fadeRate: fadeRate,
		gravity: gravity,
		colorOpacity: colorOpacity,
		origin: origin,
		orient: orient,
		rotationVelocity: rotationVelocity,
		rotationDirection: $('#rotationDirection').val(),
		shape: shape,
		size: $('.size-range').rangeVal(),
		spawnRate: spawnRate,
		spawnOrigin: spawnOrigin,
		wind: wind,
		scale: scale,
		scaleRate:  $('.scaleRate-range').rangeVal(),
		scaleLimit: $('.scaleLimit-range').rangeVal(),
		shapeProperties: {
			polygonPoints: polygonPoints,
			starGirth: starGirth
		}
	}, {
		canvasBackground: $('#canvasBackground').val()
	});
}

// Update the canvas on setting change from UI
$('input, select').on('change', function() {
	updateCanvas();
});
$('.range-slider, .range').each(function() {
	this.noUiSlider.on('set', updateCanvas);
});
