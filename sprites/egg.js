(function () {
    window.SpriteLibrary = window.SpriteLibrary || { };

    SpriteLibrary.egg = function (eggSpecs) {
        var ctx = eggSpecs.ctx;
        var open = eggSpecs.open || 0;

        //west egg
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(160, 200);
        ctx.lineTo(160, 140);
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.fillStyle = "yellow";
        ctx.arc(160, 170, 30, Math.PI / 2, 3 * Math.PI / 2, false);
        ctx.fill();
        ctx.stroke();
        if(open === 0){
        //east egg 
            //closed
            ctx.beginPath();
            ctx.moveTo(160, 200);
            ctx.bezierCurveTo(220, 195, 220, 145, 160, 140);
            ctx.fill();
            ctx.stroke();       
        } else {
            //open
            ctx.beginPath();
            ctx.moveTo(160, 200);
            ctx.bezierCurveTo(165, 260, 215, 260, 220, 200);
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();

    }
}())