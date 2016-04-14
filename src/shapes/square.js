var drawSquare = function(p) {
    var ctx = p.ion.context;
       ctx.translate(p.x, p.y);
       ctx.moveTo(0, 0);
       if(p.orient) {
          ctx.rotate(p.orient*Math.PI/180);
       }
       ctx.moveTo(p.x-p.size*0.5, p.y-p.size*0.5);
       ctx.beginPath();
       ctx.rect(-p.size*0.5, -p.size*0.5, p.size, p.size);
       ctx.fill();
       if(p.strokeWidth) {
        ctx.stroke();
       }
       ctx.closePath();
}