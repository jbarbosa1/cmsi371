/*
 * This is a very simple module that demonstrates rudimentary,
 * pixel-level image processing using a pixel's "neighborhood."
 */
var NanoshopNeighborhood = {
    /*
     * A basic "darkener"---this one does not even use the entire pixel neighborhood;
     * just the exact current pixel like the original Nanoshop.
     */
    darkener: function (x, y, rgbaNeighborhood) {
        return [
            rgbaNeighborhood[4].r / 2,
            rgbaNeighborhood[4].g / 2,
            rgbaNeighborhood[4].b / 2,
            rgbaNeighborhood[4].a
        ];
    },

    lighten: function (x, y, rgbaNeighborhood) {
        return [
            (rgbaNeighborhood[4].r + 5) * 1.1,
            (rgbaNeighborhood[4].g + 5) * 1.1,
            (rgbaNeighborhood[4].b + 5) * 1.1,
            rgbaNeighborhood[4].a
        ];
    },

    /*
     * A basic "averager"---this one returns the average of all the pixels in the
     * given neighborhood.
     */
    averager: function (x, y, rgbaNeighborhood) {
        var rTotal = 0;
        var gTotal = 0;
        var bTotal = 0;
        var aTotal = 0;

        for (var i = 0; i < 9; i += 1) {
            rTotal += rgbaNeighborhood[i].r;
            gTotal += rgbaNeighborhood[i].g;
            bTotal += rgbaNeighborhood[i].b;
            aTotal += rgbaNeighborhood[i].a;
        }

        return [ rTotal / 9, gTotal / 9, bTotal / 9, aTotal / 9 ];
    },

    embossLow: function (x, y, rgbaNeighborhood) {
        var neighborTotalR = 0;
        var neighborTotalG = 0;
        var neighborTotalB = 0;

        for (i = 0; i < 9; i++) {
            if (i !== 4) {
                if (i == 0 || i == 1 || i == 3 || i == 6) {
                    neighborTotalR += rgbaNeighborhood[i].r;
                    neighborTotalG += rgbaNeighborhood[i].g;
                    neighborTotalB += rgbaNeighborhood[i].b;
                } else if (i == 5 || i == 7 || i == 8) {
                    neighborTotalR -= rgbaNeighborhood[i].r;
                    neighborTotalG -= rgbaNeighborhood[i].g;
                    neighborTotalB -= rgbaNeighborhood[i].b;
                }   
            }
        }
                neighborTotalR += rgbaNeighborhood[4].r * 3;
                neighborTotalG += rgbaNeighborhood[4].g * 3;
                neighborTotalB += rgbaNeighborhood[4].b * 3;

        return [neighborTotalR/9, neighborTotalG/9, neighborTotalB/9, rgbaNeighborhood[4].a];
    },

    threshold: function (x, y, rgbaNeighborhood) {
        var x = (rgbaNeighborhood[4].r * 0.2126 + rgbaNeighborhood[4].g * 0.7152 + rgbaNeighborhood[4].b * 0.0722 >= 127) ? 255: 0;
        return [
            x,
            x,
            x,
            rgbaNeighborhood[4].a
        ];
    },

    invert: function (x, y, rgbaNeighborhood) {
        return [255 - rgbaNeighborhood[4].r, 255 - rgbaNeighborhood[4].g, 255 - rgbaNeighborhood[4].b, rgbaNeighborhood[4].a];
    },

    /*
     * This is a rudimentary edge dector---another filter that would not be possible
     * without knowing about the other pixels in our neighborhood.
     */
    basicEdgeDetector: function (x, y, rgbaNeighborhood) {
        var neighborTotal = 0;
        for (var i = 0; i < 9; i += 1) {
            if (i !== 4) {
                neighborTotal += (rgbaNeighborhood[i].r + rgbaNeighborhood[i].g + rgbaNeighborhood[i].b);
            }
        }

        var myAverage = (rgbaNeighborhood[4].r + rgbaNeighborhood[4].g + rgbaNeighborhood[4].b) / 3;
        var neighborAverage = neighborTotal / 3 / 8; // Three components, eight neighbors.

        return myAverage < neighborAverage ? [ 0, 0, 0, rgbaNeighborhood[4].a ] :
                [ 255, 255, 255, rgbaNeighborhood[4].a ];
    },

    edgeDetect2: function (x, y, rgbaNeighborhood) {
        return [rgbaNeighborhood[8].r * 5 - rgbaNeighborhood[0].r * 5, rgbaNeighborhood[8].g * 5 - rgbaNeighborhood[0].g * 5, rgbaNeighborhood[8].b * 5 - rgbaNeighborhood[0].b * 5, rgbaNeighborhood[4].a]
    },

    /*
     * Applies the given filter to the given ImageData object,
     * then modifies its pixels according to the given filter.
     *
     * A filter is a function ({r, g, b, a}[9]) that returns another
     * color as a 4-element array representing the new RGBA value
     * that should go in the center pixel.
     */
    applyFilter: function (renderingContext, imageData, filter) {
        // For every pixel, replace with something determined by the filter.
        var result = renderingContext.createImageData(imageData.width, imageData.height);
        var rowWidth = imageData.width * 4;
        var sourceArray = imageData.data;
        var destinationArray = result.data;

        // A convenience function for creating an rgba object.
        var rgba = function (startIndex) {
            return {
                r: sourceArray[startIndex],
                g: sourceArray[startIndex + 1],
                b: sourceArray[startIndex + 2],
                a: sourceArray[startIndex + 3]
            };
        };

        for (var i = 0, max = imageData.width * imageData.height * 4; i < max; i += 4) {
            // The 9-color array that we build must factor in image boundaries.
            // If a particular location is out of range, the color supplied is that
            // of the extant pixel that is adjacent to it.
            var iAbove = i - rowWidth;
            var iBelow = i + rowWidth;
            var pixelColumn = i % rowWidth;
            var firstRow = sourceArray[iAbove] === undefined;
            var lastRow = sourceArray[iBelow] === undefined;

            var pixelIndex = i / 4;
            var pixel = filter(pixelIndex % imageData.width, Math.floor(pixelIndex / imageData.height),
                [
                    // The row of pixels above the current one.
                    firstRow ?
                        (pixelColumn ? rgba(i - 4) : rgba(i)) :
                        (pixelColumn ? rgba(iAbove - 4) : rgba(iAbove)),

                    firstRow ? rgba(i) : rgba(iAbove),

                    firstRow ?
                        ((pixelColumn < rowWidth - 4) ? rgba(i + 4) : rgba(i)) :
                        ((pixelColumn < rowWidth - 4) ? rgba(iAbove + 4) : rgba(iAbove)),

                    // The current row of pixels.
                    pixelColumn ? rgba(i - 4) : rgba(i),

                    // The center pixel: the filter's returned color goes here
                    // (based on the loop, we are at least sure to have this).
                    rgba(i),

                    (pixelColumn < rowWidth - 4) ? rgba(i + 4) : rgba(i),

                    // The row of pixels below the current one.
                    lastRow ?
                        (pixelColumn ? rgba(i - 4) : rgba(i)) :
                        (pixelColumn ? rgba(iBelow - 4) : rgba(iBelow)),

                    lastRow ? rgba(i) : rgba(iBelow),

                    lastRow ?
                        ((pixelColumn < rowWidth - 4) ? rgba(i + 4) : rgba(i)) :
                        ((pixelColumn < rowWidth - 4) ? rgba(iBelow + 4) : rgba(iBelow))
                ]
            );

            // Apply the color that is returned by the filter.
            for (var j = 0; j < 4; j += 1) {
                destinationArray[i + j] = pixel[j];
            }
        }

        return result;
    }
};