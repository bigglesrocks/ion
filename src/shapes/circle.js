var drawCircle = function(p) {
    var ctx = p.ion.context;
       ctx.translate(p.x, p.y);
       ctx.moveTo(p.x,p.y);
       ctx.beginPath();
       ctx.arc(0, 0, p.size*0.5, 0, Math.PI*2, true);
       ctx.fill();
       if(p.strokeWidth) {
        ctx.stroke();
       }
       ctx.closePath();
}