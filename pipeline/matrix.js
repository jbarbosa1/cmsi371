(function () {
	window.Matrix = window.Matrix || {};

	Matrix = function () {
		if (arguments.length >= 1) {
			this.elements = [].slice.call(arguments);
		} else {
			this.elements = [ 1, 0, 0, 0,
				              0, 1, 0, 0,
				              0, 0, 1, 0,
				              0, 0, 0, 1 ];
		}
	};

	var checkDimensions = function (matrix1, matrix2) {
        if (matrix1.dimensions() !== matrix2.dimensions()) {
            throw "Matrices have different dimensions";
        }
    };

    Matrix.prototype.dimensions = function () {
        return this.elements.length;
    };

    Matrix.prototype.multiplication = function (m1) {
        var result = new Matrix,
            horizontal,
            vertical,
            total;

        checkDimensions(this, m1);

        for (horizontal = 0; horizontal < 4; horizontal++) {
            for (vertical = 0; vertical < 4; vertical++) {
            	total = 0;
            	for (i = 0; i < 4; i++) {
		            total += this.elements[horizontal * 4 + i] * m1.elements[i * 4 + vertical];
		        }
		        result.elements[horizontal * 4 + vertical] = total;
            }
        }
        return result;
    };

    Matrix.translation = function (xDiff, yDiff, zDiff) {
    	return new Matrix(
    		1, 0 , 0 , xDiff,
            0 , 1, 0 , yDiff,
            0 , 0 , 1, zDiff,
            0, 0, 0, 1 
    	);
    };

    Matrix.scale = function (sx, sy, sz) {
    	return new Matrix(
    	    sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        );
    };

    Matrix.frustrum = function (right, left, top, bottom, near, far) {
    	return new Matrix(
            ((2 * near) / (right - left)), 0 , ((right + left) / (right - left)), 0,
            0, ((2 * near) / (top - bottom)), ((top + bottom) / (top - bottom)), 0,
            0, 0, -(far + near) / (far - near), - ((2 * near * far) / (far - near)),
            0,  0, -1 , 0
    	);
    };

    /*
     * This code does not really belong here: it should live
     * in a separate library of matrix and transformation
     * functions.  It is here only to show you how matrices
     * can be used with GLSL.
     *
     * Based on the original glRotate reference:
     *     http://www.opengl.org/sdk/docs/man/xhtml/glRotate.xml
     */
    Matrix.getRotationMatrix = function (angle, x, y, z) {
        // In production code, this function should be associated
        // with a matrix object with associated functions.
        var axisLength = Math.sqrt((x * x) + (y * y) + (z * z));
        var s = Math.sin(angle * Math.PI / 180.0);
        var c = Math.cos(angle * Math.PI / 180.0);
        var oneMinusC = 1.0 - c;

        // We can't calculate this until we have normalized
        // the axis vector of rotation.
        var x2; // "2" for "squared."
        var y2;
        var z2;
        var xy;
        var yz;
        var xz;
        var xs;
        var ys;
        var zs;

        // Normalize the axis vector of rotation.
        x /= axisLength;
        y /= axisLength;
        z /= axisLength;

        // *Now* we can calculate the other terms.
        x2 = x * x;
        y2 = y * y;
        z2 = z * z;
        xy = x * y;
        yz = y * z;
        xz = x * z;
        xs = x * s;
        ys = y * s;
        zs = z * s;

        // GL expects its matrices in column major order.
        return new Matrix(
            (x2 * oneMinusC) + c,
            (xy * oneMinusC) + zs,
            (xz * oneMinusC) - ys,
            0.0,

            (xy * oneMinusC) - zs,
            (y2 * oneMinusC) + c,
            (yz * oneMinusC) + xs,
            0.0,

            (xz * oneMinusC) + ys,
            (yz * oneMinusC) - xs,
            (z2 * oneMinusC) + c,
            0.0,

            0.0,
            0.0,
            0.0,
            1.0
        );
    };

    /*
     * This is another function that really should reside in a
     * separate library.  But, because the creation of that library
     * is part of the student course work, we leave it here for
     * later refactoring and adaptation by students.
     */
    Matrix.getOrthoMatrix = function (left, right, bottom, top, zNear, zFar) {
        var width = right - left;
        var height = top - bottom;
        var depth = zFar - zNear;

        return new Matrix(
            2.0 / width,
            0.0,
            0.0,
            0.0,

            0.0,
            2.0 / height,
            0.0,
            0.0,

            0.0,
            0.0,
            -2.0 / depth,
            0.0,

            -(right + left) / width,
            -(top + bottom) / height,
            -(zFar + zNear) / depth,
            1.0
        );
    };

    Matrix.prototype.toGL = function () {
        var result = [];

        for (var i = 0; i < 4; i++) {
        	result.push(this.elements[i], this.elements[i + 4], this.elements[i + 8], this.elements[i + 12]);
        }

    	return result;
    };

    Matrix.elements = function () {
        return this.elements;
    };

    return Matrix;
}());