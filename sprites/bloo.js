(function () {
    window.SpriteLibrary = window.SpriteLibrary || { };

    SpriteLibrary.bloo = function (blooSpecs) {
        var ctx = blooSpecs.ctx;
        var smile = blooSpecs.smile || 0;

        //body
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "rgb(95,145,255)";
        ctx.moveTo(40, 200);
        ctx.bezierCurveTo(40, 130, 40, 130, 40, 60);
        ctx.bezierCurveTo(85, 60, 85, 60, 130, 60);
        ctx.bezierCurveTo(130, 130, 130, 130, 130, 200);
        ctx.bezierCurveTo(85, 200, 85, 200, 40, 200);

        //head
        ctx.moveTo(40, 60);
        ctx.arc(85, 60, 45, 0, Math.PI, true);
        ctx.fill();

        //eyes
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.moveTo(90, 45);
        ctx.arc(78, 45, 12, 0, Math.PI * 2, false);
        ctx.arc(101, 45, 11, 0, Math.PI * 2, false);
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.fill();

        //pupils
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.moveTo(82, 45);
        ctx.arc(84, 45, 2, 0, Math.PI * 2, false);
        ctx.moveTo(98, 45);
        ctx. arc(96, 45, 2, 0, Math.PI * 2, false);
        ctx.fill();

        //mouth
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.moveTo(58, 53);
        ctx.bezierCurveTo(62, 60, 66, 64, 84, 65);
        
        if(smile === 0) {
            //Close
            ctx.lineWidth = 1.5;
            ctx.stroke();
        } else {
            //Open
            ctx.bezierCurveTo(78, 76, 54, 72, 58, 53);
            ctx.fill();
            ctx.clip();

            //tongue
            ctx.beginPath();
            ctx.fillStyle = "pink";
            ctx.moveTo(58, 72);
            ctx.arc(65, 72, 7, 0, Math.PI * 2, true);
            ctx.fill();
            //Finish
        }

        ctx.restore();
    }

}())