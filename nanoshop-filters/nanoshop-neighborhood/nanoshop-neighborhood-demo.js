/*
 * This demo script uses the NanoshopNeighborhood module to apply a
 * "pixel neighborhood" filter on a canvas drawing.
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

    // Set a little event handler to apply the filter.
    $("#apply-dark-button").click(function () {
        // Filter time.
        renderingContext.putImageData(
            NanoshopNeighborhood.applyFilter(
                renderingContext,
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                NanoshopNeighborhood.darkener
            ),
            0, 0
        );
    });

    $("#apply-edge-button").click(function () {
        // Filter time.
        renderingContext.putImageData(
            NanoshopNeighborhood.applyFilter(
                renderingContext,
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                NanoshopNeighborhood.edgeDetect2
            ),
            0, 0
        );
    });

    $("#apply-emboss-button").click(function () {
        // Filter time.
        renderingContext.putImageData(
            NanoshopNeighborhood.applyFilter(
                renderingContext,
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                NanoshopNeighborhood.embossLow
            ),
            0, 0
        );
    });

    $("#apply-thresh-button").click(function () {
        // Filter time.
        renderingContext.putImageData(
            NanoshopNeighborhood.applyFilter(
                renderingContext,
                renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                NanoshopNeighborhood.threshold
            ),
            0, 0
        );
    });
}());