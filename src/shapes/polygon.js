var initPolygon = function(p, options) {

	polygonPoints = options.polygonPoints || 5;
	
	p.setProperty({
		property: 'polygonPoints',
		value: polygonPoints,
		acceptedValues: [3,4,5,6,7,8,9,10,11,12]
	});

	p.polygonAngle = 2*Math.PI/p.polygonPoints;

}

var drawPolygon = function(p) {
	var ctx = p.ion.context,
		points = new Array();
	// Set new radius is the original size has
	for(i=1; i<=p.polygonPoints; i++) {
		var point = [
			p.size*Math.cos(p.polygonAngle*i-(2*Math.PI*0.2)),
			p.size*Math.sin(p.polygonAngle*i-(2*Math.PI*0.2))
		];
		points.push(point);
	}
  
   ctx.translate(p.x, p.y);
   ctx.moveTo(0,0);
   if(p.orient) {
      ctx.rotate(p.orient*Math.PI/180);
   }

   ctx.moveTo(points[0][0], points[0][1]);

   ctx.beginPath();

   for(var t=1;t<points.length;t++) {
   	 ctx.lineTo(points[t][0], points[t][1]);
   }

   ctx.lineTo(points[0][0], points[0][1]);

   ctx.closePath();

   if(p.strokeWidth) {
    ctx.stroke();
   }
   ctx.fill()
    
}