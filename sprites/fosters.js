(function () {
    window.SpriteLibrary = window.SpriteLibrary || { };

    SpriteLibrary.fosters = function (houseSpecs) {
        var ctx = houseSpecs.ctx;

        ctx.save();
        var image = new Image();
        image.src = "../sprites/fosters-background.jpg";
        ctx.drawImage(image, 0, 0);
        ctx.restore();
    }

}())