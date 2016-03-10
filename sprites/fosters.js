(function () {
    window.SpriteLibrary = window.SpriteLibrary || { };
    var image = new Image();
    image.src = '../sprites/fosters-background.jpg';

    SpriteLibrary.fosters = function (houseSpecs) {
        var ctx = houseSpecs.ctx;

        ctx.save();
        ctx.drawImage(image, 0, 0);
        ctx.restore();
    }

}())