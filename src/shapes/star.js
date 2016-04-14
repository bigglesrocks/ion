// function mapPoint(x,y,ctx,size) {
// 	var size = size || 2;
// 	ctx.moveTo(x,y);
// 	ctx.fillStyle = '#ffffff';
// 	ctx.beginPath();
// 	ctx.arc(x,y,size,0,Math.PI*2,true);
// 	ctx.fill();
// 	ctx.closePath()
// 	ctx.fillText("["+x.toString().substring(0,6)+","+y.toString().substring(0,6)+"]", x, y);
// }

var initStar = function(p, options) {

	polygonPoints = options.polygonPoints || 5;
	starGirth = options.starGirth || 0.5;
	
	p.setProperty({
		property: 'polygonPoints',
		value: polygonPoints,
		acceptedValues: [3,4,5,6,7,8,9,10,11,12]
	});

	p.setProperty({
		property: 'starGirth',
		value: starGirth,
		randomize: [0.05,1]
	});

	p.starAngle = 2*Math.PI/p.polygonPoints;

}

var drawStar = function(p) {
	var ctx = p.ion.context,
		points = new Array();
	// Set new radius is the original size has
	for(i=1; i<=p.polygonPoints; i++) {
		var outerPoint = [
			0+p.size*Math.cos(p.starAngle*i-(2*Math.PI*0.2)),
			0+p.size*Math.sin(p.starAngle*i-(2*Math.PI*0.2))
		],
		innerPoint = [
			0+(p.size*p.starGirth)*Math.cos((p.starAngle*(i-1)+p.starAngle*0.5)-(2*Math.PI*0.2)),
			0+(p.size*p.starGirth)*Math.sin((p.starAngle*(i-1)+p.starAngle*0.5)-(2*Math.PI*0.2))
		]
		points.push(innerPoint);
		points.push(outerPoint);
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