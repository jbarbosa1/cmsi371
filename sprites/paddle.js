(function () {
    window.SpriteLibrary = window.SpriteLibrary || { };

    SpriteLibrary.paddle = function (paddleSpecs) {
        var ctx = paddleSpecs.ctx;

        //paddle
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "rgb(255, 228, 181)";
        ctx.moveTo(165, 100);
        ctx.arc(150, 100, 15, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.lineWidth = 0.3;
        ctx.stroke();

        //handle
        ctx.beginPath();
        ctx.fillStyle = "rgb(255, 228, 181)";
        ctx.moveTo(136, 106);
        ctx.bezierCurveTo(157, 128, 128, 140, 150, 140);
        ctx.bezierCurveTo(160, 135, 140, 125, 163, 107);
        ctx.fill();
        ctx.lineWidth = 0.3;
        ctx.stroke();

        //string
        ctx.beginPath();
        ctx.moveTo(150, 100);
        ctx.lineTo(172, 125);
        ctx.stroke();

        //ball
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.moveTo(175, 125);
        ctx.arc(170, 123, 5, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.restore();

    }
}())