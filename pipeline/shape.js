/*
 * This module defines/generates vertex arrays for certain predefined shapes.
 * The "shapes" are returned as indexed vertices, with utility functions for
 * converting these into "raw" coordinate arrays.
 */
(function() {
    window.Shape = window.Shape || {};

    Shape = function(shapeFeatures){
        this.x = shapeFeatures.x || 0;
        this.y = shapeFeatures.y || 0;
        this.z = shapeFeatures.z || 0;
        this.children = shapeFeatures.children || [];
        this.color = shapeFeatures.color || {r: 0.0, g: 0.0, b:0.0};
        this.colors = shapeFeatures.colors || null;
        this.mode = shapeFeatures.mode;
        this.axis = shapeFeatures.axis || {x: 0.0, y: 0.0, z: 0.0};
        this.sx = shapeFeatures.sx || 1;
        this.sy = shapeFeatures.sy || 1;
        this.sz = shapeFeatures.sz || 1;
        this.tx = shapeFeatures.tx || 0;
        this.ty = shapeFeatures.ty || 0;
        this.tz = shapeFeatures.tz || 0;
        this.angle = shapeFeatures.angle || 0;
        this.rx = shapeFeatures.rx || 1;
        this.ry = shapeFeatures.ry || 1;
        this.rz = shapeFeatures.rz || 1;
        this.vertices = shapeFeatures.vertices || [];
        this.indices = shapeFeatures.indices || [];
    };

    Shape.icosahedron = function() {
        // These variables are actually "constants" for icosahedron coordinates.
        var X = 0.525731112119133606,
            Z = 0.850650808352039932;

        return {
            vertices: [
                [ -X, 0.0, Z ],
                [ X, 0.0, Z ],
                [ -X, 0.0, -Z ],
                [ X, 0.0, -Z ],
                [ 0.0, Z, X ],
                [ 0.0, Z, -X ],
                [ 0.0, -Z, X ],
                [ 0.0, -Z, -X ],
                [ Z, X, 0.0 ],
                [ -Z, X, 0.0 ],
                [ Z, -X, 0.0 ],
                [ -Z, -X, 0.0 ]
            ],

            indices: [
                [ 1, 4, 0 ],
                [ 4, 9, 0 ],
                [ 4, 5, 9 ],
                [ 8, 5, 4 ],
                [ 1, 8, 4 ],
                [ 1, 10, 8 ],
                [ 10, 3, 8 ],
                [ 8, 3, 5 ],
                [ 3, 2, 5 ],
                [ 3, 7, 2 ],
                [ 3, 10, 7 ],
                [ 10, 6, 7 ],
                [ 6, 11, 7 ],
                [ 6, 0, 11 ],
                [ 6, 1, 0 ],
                [ 10, 1, 6 ],
                [ 11, 0, 9 ],
                [ 2, 11, 9 ],
                [ 5, 2, 9 ],
                [ 11, 2, 7 ]
            ]
        };
    };

    Shape.cube = function () {
        return {
            vertices: [
                [ 0.5, 0.5, 0.5 ],
                [ 0.5, 0.5, -0.5 ],
                [ -0.5, 0.5, -0.5 ],
                [ -0.5, 0.5, 0.5 ],
                [ 0.5, -0.5, 0.5 ],
                [ 0.5, -0.5, -0.5 ],
                [ -0.5, -0.5, -0.5 ],
                [ -0.5, -0.5, 0.5 ]
            ],

            indices: [
                [ 0, 1, 3 ],
                [ 2, 3, 1 ],
                [ 0, 3, 4 ],
                [ 7, 4, 3 ],
                [ 0, 4, 1 ],
                [ 5, 1, 4 ],
                [ 1, 5, 6 ],
                [ 2, 1, 6 ],
                [ 2, 7, 3 ],
                [ 6, 7, 2 ],
                [ 4, 7, 6 ],
                [ 5, 4, 6 ]
            ]
        };
    };

    Shape.triangularPrism = function () {
        var X = -0.5,
            Y = 0.25,
            Z = 0.5;

        return {
            vertices: [
                [ X, 0.0, Z ],
                [ -X, 0.0, Z ],
                [ 0.0, Y, Z ],
                [ X, 0.0, -Z ],
                [ -X, 0.0, -Z ],
                [ 0.0, Y, -Z ]
            ],

            indices: [
                [ 0, 1, 2 ],
                [ 0, 2, 3 ], 
                [ 3, 2, 5 ],
                [ 3, 5, 4 ],
                [ 4, 5, 1 ],  
                [ 1, 5, 2 ],
                [ 0, 3, 1 ], 
                [ 4, 3, 1 ]
            ]
        };
    };

    Shape.sphere = function () {
        var radius = 1.1,
            verticalBars = 32,
            horizontalBars = 32,
            vertices = [],
            indices = [];

         for (var i = 0; i < verticalBars + 1; i += 1) {
            var theta = (i * Math.PI) / verticalBars;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var j = 0; j < horizontalBars + 1; j += 1) {
                var phi = (j * 2 * Math.PI) / horizontalBars;
                var x = radius * Math.cos(phi) * sinTheta;
                var y = radius * cosTheta;
                var z = radius * Math.sin(phi) * sinTheta;

                vertices.push([x, y, z]);
            }
        }

        for (var i = 0; i < verticalBars; i += 1) {

            for (var j = 0; j < horizontalBars; j += 1) {
                var top = (i * (horizontalBars + 1)) + j;
                var bottom = top + horizontalBars + 1;

                indices.push([top, bottom, top + 1]);
                indices.push([bottom, bottom + 1, top + 1]);
            }
        }

        return {
            vertices: vertices,
            indices: indices
            // color: { r: 0.0, g: 0.5, b: 0.0 },
            // mode: gl.LINES,
            // axis: { x: 1.0, y: 1.0, z: 1.0 }
        };
    };

    Shape.pyramid = function() {
        var X = 0.5,
            Y = -1,
            Z = -0.5;

        return {
            vertices: [
                [ X, Y, Z ],
                [ X, Y, -Z ],
                [ -X, Y, -Z ],
                [ -X, Y, Z ],
                [ 0.0, -Y, 0.0 ]
            ],

            indices: [
                [ 0, 1, 2 ],
                [ 0, 2, 3 ], 
                [ 0, 4, 1 ],
                [ 3, 4, 2 ],
                [ 2, 4, 1 ]
            ]
        };
    };

    Shape.prototype.toRawTriangleArray = function () {
        var result = [],
            i,
            j,
            maxi,
            maxj;

        for (i = 0, maxi = this.indices.length; i < maxi; i += 1) {
            for (j = 0, maxj = this.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    this.vertices[
                        this.indices[i][j]
                    ]
                );
            }
        }

        return result;
    };

    Shape.prototype.toRawLineArray = function () {
        var result = [],
            i,
            j,
            maxi,
            maxj;

        for (i = 0, maxi = this.indices.length; i < maxi; i += 1) {
            for (j = 0, maxj = this.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    this.vertices[
                        this.indices[i][j]
                    ],

                    this.vertices[
                        this.indices[i][(j + 1) % maxj]
                    ]
                );
            }
        }

        return result;
    };
}());