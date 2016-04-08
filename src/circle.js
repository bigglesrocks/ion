var drawCircle = function(p) {
    var ctx = p.ion.context;
    var size = p.randomNumber(p.minSize, p.maxSize);
       ctx.translate(p.x, p.y);
       // ctx.fillStyle = p.color;
       ctx.moveTo(p.x,p.y);
       ctx.beginPath();
       ctx.arc(30, 30, p.size, 0, Math.PI*2, true);
       ctx.fill();
       if(p.borderWidth) {
        ctx.stroke();
       }
       ctx.closePath();
}