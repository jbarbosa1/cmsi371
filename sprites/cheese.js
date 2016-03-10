(function () {
    window.SpriteLibrary = window.SpriteLibrary || { };
    var image = new Image();
    image.src = '../sprites/cheese.jpg';

    SpriteLibrary.cheese = function (cheeser) {
        var ctx = cheeser.ctx;

        ctx.save();
        ctx.drawImage(image, 0, 0);
        ctx.restore();
    }

}())