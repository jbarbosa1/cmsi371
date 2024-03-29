/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
(function (canvas) {

    // Because many of these variables are best initialized then immediately
    // used in context, we merely name them here.  Read on to see how they
    // are used.
    var gl; // The WebGL context.

    // This variable stores 3D model information.
    var objectsToDraw;

    // The shader program to use.
    var shaderProgram;

    // Utility variable indicating whether some fatal has occurred.
    var abort = false;

    // Important state variables.
    var animationActive = false;
    var currentRotation = 0.0;
    var currentInterval;
    var modelViewMatrix;
    var projectionMatrix;
    var scaleMatrix;
    var rotationMatrix;
    var cameraMatrix;
    var vertexPosition;
    var vertexSpecularColor;
    var shininess;
    var vertexDiffuseColor;

    // Lighting variables
    var normalVector;
    var lightPosition;
    var lightDiffuse;
    var lightSpecular;

    var babysitter;

    // An individual "draw object" function.
    var drawObject;

    // The big "draw scene" function.
    var drawScene;

    // State and function for performing animation.
    var previousTimestamp;
    var advanceScene;

    // Reusable loop variables.
    var i;
    var maxi;
    var j;
    var maxj;

    // Grab the WebGL rendering context.
    gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Build the objects to display.  Note how each object may come with a
    // rotation axis now.
    objectsToDraw = [
        // We move our original triangles a bit to accommodate a new addition
        // to the scene (yes, a translation will also do the trick, if it
        // where implemented in this program).
        // {
        //     vertices: [].concat(
        //         [ -2.0, 0.0, 0.0 ],
        //         [ -1.5, 0.0, -0.75 ],
        //         [ -2.0, 0.5, 0.0 ]
        //     ),
        //     colors: [].concat(
        //         [ 1.0, 0.0, 0.0 ],
        //         [ 0.0, 1.0, 0.0 ],
        //         [ 0.0, 0.0, 1.0 ]
        //     ),
        //     mode: gl.TRIANGLES
        // },

        // {
        //     color: { r: 0.0, g: 1.0, b: 0 },
        //     vertices: [].concat(
        //         [ -1.75, 0.0, -0.5 ],
        //         [ -1.25, 0.0, -0.5 ],
        //         [ -1.75, 0.5, -0.5 ]
        //     ),
        //     mode: gl.TRIANGLES
        // },

        // {
        //     color: { r: 0.0, g: 0.0, b: 1.0 },
        //     vertices: [].concat(
        //         [ -2.25, 0.0, 0.5 ],
        //         [ -1.75, 0.0, 0.5 ],
        //         [ -2.25, 0.5, 0.5 ]
        //     ),
        //     mode: gl.TRIANGLES
        // },

        // {
        //     color: { r: 0.0, g: 0.0, b: 1.0 },
        //     vertices: [].concat(
        //         [ -1.0, -1.0, 0.75 ],
        //         [ -1.0, -0.1, -1.0 ],
        //         [ -0.1, -0.1, -1.0 ],
        //         [ -0.1, -1.0, 0.75 ]
        //     ),
        //     mode: gl.LINE_LOOP,
        //     axis: { x: 1.0, y: 0.0, z: 1.0 }
        // },

        // new Shape({
        //     color: { r: 0.5, g: 0.0, b: 0.5 },
        //     vertices: new Shape(Shape.pyramid()).toRawTriangleArray(),
        //     mode: gl.TRIANGLES,
        //     axis: { x: 0.0, y: 1.0, z: 1.0 }
        // }),

        // Something that would have been clipped before.
        // {
        //     vertices: [].concat(
        //         [ 3.0, 1.5, 0.0 ],
        //         [ 2.0, -1.5, 0.0 ],
        //         [ 4.0, -1.5, 0.0 ]
        //     ),
        //     colors: [].concat(
        //         [ 1.0, 0.5, 0.0 ],
        //         [ 0.0, 0.0, 0.5 ],
        //         [ 0.5, 0.75, 0.5 ]
        //     ),
        //     mode: gl.TRIANGLES,
        //     axis: { x: -0.5, y: 1.0, z: 0.0 }
        // },

        // {
        //     vertices: new Shape(Shape.triangularPrism()).toRawTriangleArray(),
        //     color: { r: 0.5, g: 0.0, b: 0.5 },
        //     mode: gl.TRIANGLES,
        //     axis: { x: -0.5, y: 1.0, z: 0.0 }
        // },

        // Show off the new shape.
        // {
        //     vertices: Shapes.toRawTriangleArray(Shapes.cube()),
        //     // 12 triangles in all.
        //     colors: [].concat(
        //         [ 1.0, 0.0, 0.0 ],
        //         [ 1.0, 0.0, 0.0 ],
        //         [ 1.0, 0.0, 0.0 ],
        //         [ 1.0, 0.0, 0.0 ],
        //         [ 1.0, 0.0, 0.0 ],
        //         [ 1.0, 0.0, 0.0 ],
        //         [ 0.0, 1.0, 0.0 ],
        //         [ 0.0, 1.0, 0.0 ],
        //         [ 0.0, 1.0, 0.0 ],
        //         [ 0.0, 1.0, 0.0 ],
        //         [ 0.0, 1.0, 0.0 ],
        //         [ 0.0, 1.0, 0.0 ],
        //         [ 0.0, 0.0, 1.0 ],
        //         [ 0.0, 0.0, 1.0 ],
        //         [ 0.0, 0.0, 1.0 ],
        //         [ 0.0, 0.0, 1.0 ],
        //         [ 0.0, 0.0, 1.0 ],
        //         [ 0.0, 0.0, 1.0 ],
        //         [ 1.0, 1.0, 0.0 ],
        //         [ 1.0, 1.0, 0.0 ],
        //         [ 1.0, 1.0, 0.0 ],
        //         [ 1.0, 1.0, 0.0 ],
        //         [ 1.0, 1.0, 0.0 ],
        //         [ 1.0, 1.0, 0.0 ],
        //         [ 1.0, 0.0, 1.0 ],
        //         [ 1.0, 0.0, 1.0 ],
        //         [ 1.0, 0.0, 1.0 ],
        //         [ 1.0, 0.0, 1.0 ],
        //         [ 1.0, 0.0, 1.0 ],
        //         [ 1.0, 0.0, 1.0 ],
        //         [ 0.0, 1.0, 1.0 ],
        //         [ 0.0, 1.0, 1.0 ],
        //         [ 0.0, 1.0, 1.0 ],
        //         [ 0.0, 1.0, 1.0 ],
        //         [ 0.0, 1.0, 1.0 ],
        //         [ 0.0, 1.0, 1.0 ]
        //     ),
        //     mode: gl.TRIANGLES,
        //     axis: { x: 1.0, y: 1.0, z: 1.0 }
        // },

        new Shape({
            color: { r: 0.0, g: 0.5, b: 0.0 },
            vertices: new Shape(Shape.sphere()).toRawTriangleArray(),
            mode: gl.TRIANGLES,
            // axis: { x: 1.0, y: 1.0, z: 1.0 },
            sx: 0.2,
            sy: 0.2,
            sz: 0.2,
            tx: 0,
            ty: 0.9,
            tz: 5,
            rx: 0.1,
            ry: 1,
            rz: 0.1,
            specularColor: {r:1.0, g: 1.0, b: 1.0},
            shininess: 10,
            normals: new Shape(Shape.sphere()).toVertexNormalArray(),
            children: [new Shape({
                color: { r: 0.5, g: 0.0, b: 0.5 },
                vertices: new Shape(Shape.pyramid()).toRawTriangleArray(),
                mode: gl.TRIANGLES,
                axis: { x: 0.0, y: 1.0, z: 1.0 },
                sx: 0.2,
                sy: 0.2,
                sz: 0.2,
                angle: 180,
                rx: 0.1,
                ry: 0.1,
                rz: 0.1,
                specularColor: {r: 1.0, g: 1.0, b: 1.0},
                shininess: 16,
                normals: new Shape(Shape.pyramid()).toVertexNormalArray(),
                children: [new Shape({
                    vertices: new Shape(Shape.triangularPrism()).toRawTriangleArray(),
                    sx: 0.1,
                    sy: 0.1,
                    sz: 0.1,
                    tx: 0.9,
                    rx: 3,
                    rz: 3,
                    specularColor: {r: 1.0, g: 1.0, b: 1.0},
                    shininess: 16,
                    normals: new Shape(Shape.triangularPrism()).toVertexNormalArray(),
                    color: { r: 1.0, g: 0.0, b: 0.0 },
                    mode: gl.TRIANGLES,
                    axis: { x: -0.5, y: 1.0, z: 0.0 }
                })]
            })]
        })
    ];

    // Pass the vertices to WebGL.
    babysitter = function(objectsToDraw) {
        // var i;
        for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            objectsToDraw[i].buffer = GLSLUtilities.initVertexBuffer(gl,
                    objectsToDraw[i].vertices);

            if (!objectsToDraw[i].colors) {
                // If we have a single color, we expand that into an array
                // of the same color over and over.
                objectsToDraw[i].colors = [];
                for (j = 0, maxj = objectsToDraw[i].vertices.length / 3;
                        j < maxj; j += 1) {
                    objectsToDraw[i].colors = objectsToDraw[i].colors.concat(
                        objectsToDraw[i].color.r,
                        objectsToDraw[i].color.g,
                        objectsToDraw[i].color.b
                    );
                }
            }

            if (!objectsToDraw[i].specularColors) {
            // Future refactor: helper function to convert a single value or
            // array into an array of copies of itself.
                objectsToDraw[i].specularColors = [];
                for (j = 0, maxj = objectsToDraw[i].vertices.length / 3;
                        j < maxj; j += 1) {
                    objectsToDraw[i].specularColors = objectsToDraw[i].specularColors.concat(
                        objectsToDraw[i].specularColor.r,
                        objectsToDraw[i].specularColor.g,
                        objectsToDraw[i].specularColor.b
                    );
                }
            }

            objectsToDraw[i].colorBuffer = GLSLUtilities.initVertexBuffer(gl,
                    objectsToDraw[i].colors);

            objectsToDraw[i].specularBuffer = GLSLUtilities.initVertexBuffer(gl,
                objectsToDraw[i].specularColors);

            objectsToDraw[i].normalBuffer = GLSLUtilities.initVertexBuffer(gl,
                    objectsToDraw[i].normals);

            if (objectsToDraw[i].children.length != 0) {
                babysitter(objectsToDraw[i].children);
            }
        }
    },

    // Initialize the shaders.
    shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        // Very cursory error-checking here...
        function (shader) {
            abort = true;
            alert("Shader problem: " + gl.getShaderInfoLog(shader));
        },

        // Another simplistic error check: we don't even access the faulty
        // shader program.
        function (shaderProgram) {
            abort = true;
            alert("Could not link shaders...sorry.");
        }
    );

    // If the abort variable is true here, we can't continue.
    if (abort) {
        alert("Fatal errors encountered; we cannot continue.");
        return;
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram);

    // Hold on to the important variables within the shaders.
    vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    vertexDiffuseColor = gl.getAttribLocation(shaderProgram, "vertexDiffuseColor");
    gl.enableVertexAttribArray(vertexDiffuseColor);
    vertexSpecularColor = gl.getAttribLocation(shaderProgram, "vertexSpecularColor");
    gl.enableVertexAttribArray(vertexSpecularColor);
    normalVector = gl.getAttribLocation(shaderProgram, "normalVector");
    gl.enableVertexAttribArray(normalVector);

    // Finally, we come to the typical setup for transformation matrices:
    // model-view and projection, managed separately.
    modelViewMatrix = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
    rotationMatrix = gl.getUniformLocation(shaderProgram, "rotationMatrix");
    projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    translationMatrix = gl.getUniformLocation(shaderProgram, "translationMatrix");
    scaleMatrix = gl.getUniformLocation(shaderProgram, "scaleMatrix");
    orthoMatrix = gl.getUniformLocation(shaderProgram, "orthoMatrix");
    cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");

    lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    shininess = gl.getUniformLocation(shaderProgram, "shininess");

    gl.uniformMatrix4fv(projectionMatrix, 
        gl.FALSE,
        new Float32Array(Matrix.frustrum(-4, 4, 2, -2, 2, 1000).toGL())
    );

    // Initialize scale matrix
    gl.uniformMatrix4fv(scaleMatrix, 
        gl.FALSE, 
        Matrix.scale(1, 1, 1).toGL()
    );

    // Initialize translation matrix
    gl.uniformMatrix4fv(translationMatrix, 
        gl.FALSE, 
        Matrix.translation(0, 0, 0).toGL()
    );

    // gl.uniformMatrix4fv(rotationMatrix,
    //     gl.FALSE,
    //     Matrix.getRotationMatrix(0, 1, 1, 1).toGL()
    // );

    gl.uniformMatrix4fv(cameraMatrix,
        gl.FALSE,
        Matrix.cameraMatrix(0, 0, 100, 0, 0, 0, 0, 1, 0).toGL()
    );

    /*
     * Displays an individual object, including a transformation that now varies
     * for each object drawn.
     */
    drawObject = function (object, parent) {
        // var i;

        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexDiffuseColor, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, object.specularBuffer);
        gl.vertexAttribPointer(vertexSpecularColor, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
        gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);

        // Set up the model-view matrix, if an axis is included.  If not, we
        // specify the identity matrix.
        // gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(object.axis ?
        //         Matrix.getRotationMatrix(currentRotation, object.axis.x, object.axis.y, object.axis.z).elements :
        //         new Matrix().elements
        //     ));

        gl.uniform1f(shininess, object.shininess);

        var exmatrixMatrix = parent || new Matrix();

        exmatrixMatrix = exmatrixMatrix.multiplication(
            Matrix.translation(
                object.tx, object.ty, object.tz
            )).multiplication(
                Matrix.scale(
                    object.sx, object.sy, object.sz
            )).multiplication(
                Matrix.getRotationMatrix(
                    currentRotation, object.rx, object.ry, object.rz
            ));

        // console.log(exmatrixMatrix);

        gl.uniformMatrix4fv(projectionMatrix,
            gl.FALSE,
            exmatrixMatrix.toGL()
        );

        // Set the varying normal vectors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
        gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(object.mode, 0, object.vertices.length / 3);

        if (object.children.length != 0) {
            for(i = 0; i < object.children.length; i++){
                drawObject(object.children[i], exmatrixMatrix);
            }
        }
    };

    /*
     * Displays the scene.
     */
    drawScene = function () {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniformMatrix4fv(rotationMatrix,
            gl.FALSE,
            Matrix.getRotationMatrix(0, 1, 1, 1).toGL()
        );

        // Display the objects.
        for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            drawObject(objectsToDraw[i]);
        }

        // All done.
        gl.flush();
    };

    // Because our canvas element will not change size (in this program),
    // we can set up the projection matrix once, and leave it at that.
    // Note how this finally allows us to "see" a greater coordinate range.
    // We keep the vertical range fixed, but change the horizontal range
    // according to the aspect ratio of the canvas.  We can also expand
    // the z range now.
    // gl.uniformMatrix4fv(projectionMatrix, gl.FALSE, Matrix.getOrthoMatrix(
    //     -2 * (canvas.width / canvas.height),
    //     2 * (canvas.width / canvas.height),
    //     -2,
    //     2,
    //     -10,
    //     10
    // ).toGL());

    babysitter(objectsToDraw);

    gl.uniform4fv(lightPosition, [30.0, 20.0, 90.0, 1.0]);
    gl.uniform3fv(lightDiffuse, [1.0, 1.0, 1.0]);
    gl.uniform3fv(lightSpecular, [1.0, 1.0, 1.0]);

    // Animation initialization/support.
    previousTimestamp = null;
    advanceScene = function (timestamp) {
        // Check if the user has turned things off.
        if (!animationActive) {
            return;
        }

        // Initialize the timestamp.
        if (!previousTimestamp) {
            previousTimestamp = timestamp;
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // Check if it's time to advance.
        var progress = timestamp - previousTimestamp;
        if (progress < 30) {
            // Do nothing if it's too soon.
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // All clear.
        currentRotation += 0.033 * progress;
        drawScene();
        if (currentRotation >= 360.0) {
            currentRotation -= 360.0;
        }

        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(advanceScene);
    };

    // Draw the initial scene.
    drawScene();

    // Set up the rotation toggle: clicking on the canvas does it.
    $(canvas).click(function () {
        animationActive = !animationActive;
        if (animationActive) {
            previousTimestamp = null;
            window.requestAnimationFrame(advanceScene);
        }
    });

}(document.getElementById("my-project")));