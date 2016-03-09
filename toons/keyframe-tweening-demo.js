/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas"),

        // First, a selection of "drawing functions" from which we
        // can choose.  Their common trait: they all accept a single
        // renderingContext argument.
        // square = function (renderingContext) {
        //     renderingContext.fillStyle = "blue";
        //     renderingContext.fillRect(-20, -20, 40, 40);
        // },

        // circle = function (renderingContext) {
        //     renderingContext.strokeStyle = "red";
        //     renderingContext.beginPath();
        //     renderingContext.arc(0, 0, 50, 0, Math.PI * 2);
        //     renderingContext.stroke();
        // },

        fosters = function(house) {
            SpriteLibrary.fosters({
                ctx: house.ctx
            });
        },

        bloo = function(mahatmaDhondi) {
            SpriteLibrary.bloo({
                ctx: mahatmaDhondi.ctx,
                smile: mahatmaDhondi.smile
            });
        },

        // egg = function(coco) {
        //     SpriteLibrary.egg({
        //         ctx: coco.ctx,
        //         open: coco.open
        //     });
        // }

        // Then, we have "easing functions" that determine how
        // intermediate frames are computed.

        // Now, to actually define the animated sprites.  Each sprite
        // has a drawing function and an array of keyframes.
        sprites = [
            // {
            //     draw: square,
            //     keyframes: [
            //         {
            //             frame: 0,
            //             tx: 20,
            //             ty: 20,
            //             ease: KeyframeTweener.linear
            //         },

            //         {
            //             frame: 30,
            //             tx: 100,
            //             ty: 50,
            //             ease: KeyframeTweener.quadEaseInOut
            //         },

            //         // The last keyframe does not need an easing function.
            //         {
            //             frame: 80,
            //             tx: 80,
            //             ty: 500,
            //             rotate: 60 // Keyframe.rotate uses degrees.
            //         }
            //     ]
            // },

            // {
            //     draw: circle,
            //     keyframes: [
            //         {
            //             frame: 50,
            //             tx: 300,
            //             ty: 600,
            //             sx: 0.5,
            //             sy: 0.5,
            //             ease: KeyframeTweener.quadEaseOut
            //         },

            //         {
            //             frame: 100,
            //             tx: 300,
            //             ty: 0,
            //             sx: 3,
            //             sy: 0.25,
            //             ease: KeyframeTweener.quadEaseOut
            //         },

            //         {
            //             frame: 150,
            //             tx: 300,
            //             ty: 600,
            //             sx: 0.5,
            //             sy: 0.5
            //         }
            //     ]
            // }

            {
                draw: fosters,
                keyframes: [
                    {
                        frame:0,
                        tx: 0,
                        ty: 0,
                        sx: 1,
                        sy: 1
                    },

                    {
                        frame: 9000,
                        tx: 0,
                        ty: 0,
                        sx: 1,
                        sy: 1
                    }
                ]
            },

            {
                draw: bloo,
                keyframes: [
                    {
                        frame: 0,
                        tx: 100,
                        ty: 175,
                        sx: .75,
                        sy: .75,
                        spriteDetails: {
                            smile: 0
                        }
                    },

                    {
                        frame: 50,
                        tx: 150,
                        ty: 200,
                        sx: .75,
                        sy: .7
                    },

                    {
                        frame: 100,
                        tx: 200,
                        ty: 225,
                        sx: .75,
                        sy: .65
                    },

                    {
                        frame: 150,
                        tx: 250,
                        ty: 250,
                        sx: .75,
                        sy: .7
                    },

                    {
                        frame: 200,
                        tx: 300,
                        ty: 250,
                        sx: .75,
                        sy: .75
                    },

                    {
                        frame: 250,
                        tx: 350,
                        ty: 250,
                        sx: .75,
                        sy: .7,
                        spriteDetails: {
                            smile: 10
                        }
                    },

                    {
                        frame: 300,
                        tx: 350,
                        ty: 250,
                        sx: .75,
                        sy: .7,
                        spriteDetails: {
                            smile: 10
                        }
                    }
                ]
            }
        ];

    // Finally, we initialize the engine.  Mainly, it needs
    // to know the rendering context to use.  And the animations
    // to display, of course.
    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        width: canvas.width,
        height: canvas.height,
        sprites: sprites
    });
}());
