// get a random number provided min & max values
function randomNumber(min, max, frac) {
   var num = Math.random() * (max - min) + min;
   if(!frac) {
      var num = Math.floor(num);
    }
    return num;
};

// Get a random rgba value
function randomRGBA() {
  return "rgba("+randomNumber(0,255)+","+randomNumber(0,255)+","+randomNumber(0.255)+","+randomNumber(0,1,true)+")";
}

// Convert hex values to rgba values
function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    if(!opacity) { opacity = 1; }

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

// Create an array of separate values from an rgba color string
function colorArray(rgbaString) {
  return p.color.match(/(\d{1,4})/g);
}

// Strip any trailing zeros from decimal places on numbers
function getAbsValue(val) {
  var abs = Math.abs(parseFloat(val));;
  if(val.match("-")) {
    abs = -abs;
  }
  return abs;
}

// Get the number of decimal places provided a number
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

function defaultOptions(standard, user) {
  // console.log("Utilites:defaultOptions:55")
  // console.log(standard);
  if (typeof user === 'object') {
    for (var key in standard) {
      if(user[key] != undefined) {
         // console.log(standard[key]);
         // console.log(user[key]);
          standard[key] = user[key];
      }
    }
  }
  // console.log("Utilities:defaultOptions:Line64")
  // console.log(standard);
  return standard;
};

isArray = function(val) {
  return Object.prototype.toString.call(val) == '[object Array]'
}