var drawSquare = function(p) {
    var ctx = p.ion.context;
       ctx.translate(p.x, p.y);
       // context.fillStyle = color;
       if(p.rotation) {
          ctx.rotate(p.orient + p.rotationVelocity);
          p.orient++;
       }
       ctx.moveTo(p.x,p.y);
       ctx.beginPath();
       ctx.rect(0, 0, p.size, p.size);
       ctx.fill();
       if(p.borderWidth) {
        ctx.stroke();
       }
       ctx.closePath();
}