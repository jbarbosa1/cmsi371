/*
 * This demo script uses the Nanoshop module to apply a simple
 * filter on a canvas drawing.
 */
(function () {
    var canvas = $("#picture")[0];
    var renderingContext = canvas.getContext("2d");

    renderingContext.save();
    renderingContext.translate(0, 0);
    SpriteLibrary.bloo({
    ctx: renderingContext
    });
    renderingContext.restore();
    renderingContext.save();
    renderingContext.translate(30, -30);
    SpriteLibrary.paddle({
    ctx: renderingContext
    });
    renderingContext.restore();
    renderingContext.save();
    renderingContext.translate(20, -10);
    SpriteLibrary.egg({
    ctx: renderingContext
    });
    renderingContext.restore();

    //Set a little event handler to apply the filter.
    $("#apply-dark-button").click(function () {
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                Nanoshop.darkener
            ),
            0, 0
        );
    });

    $("#apply-color-button").click(function () {
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                Nanoshop.colorShiftLeft
            ),
            0, 0
        );
    });

    $("#apply-grayscale-button").click(function () {
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                Nanoshop.grayscale
            ),
            0, 0
        );
    });

    $("#apply-bright-button").click(function () {
        renderingContext.putImageData(
            Nanoshop.applyFilter(
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                Nanoshop.brighten
            ),
            0, 0
        );
    });
}());