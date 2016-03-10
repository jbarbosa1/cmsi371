/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas"),

        // First, a selection of "drawing functions" from which we
        // can choose.  Their common trait: they all accept a single
        // renderingContext argument.

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

        egg = function(coco) {
            SpriteLibrary.egg({
                ctx: coco.ctx,
                open: coco.open
            });
        }

        paddle = function(item) {
            SpriteLibrary.paddle({
                ctx: item.ctx,
                hit: item.hit
            });
        },

        cheese = function(mac) {
            SpriteLibrary.cheese({
                ctx: mac.ctx
            });    
        }

        // Then, we have "easing functions" that determine how
        // intermediate frames are computed.

        // Now, to actually define the animated sprites.  Each sprite
        // has a drawing function and an array of keyframes.
        sprites = [
            {
                draw: fosters,
                keyframes: [
                    {
                        frame: 0,
                        tx: 0,
                        ty: 0,
                        sx: 1.02,
                        sy: 1.02
                    },

                    {
                        frame: 1000,
                        tx: 0,
                        ty: 0,
                        sx: 1.02,
                        sy: 1.02
                    }
                ]
            },

            {
                draw: egg,
                keyframes: [
                    {
                        frame: 0,
                        tx: 650,
                        ty: 200,
                        sx: .9,
                        sy: .95
                    },

                    {
                        frame: 600,
                        tx: 650,
                        ty: 200,
                        sx: .9,
                        sy: .85,
                        spriteDetails: {
                            open: 1
                        }
                    },

                    {
                        frame: 650,
                        tx: 650,
                        ty: 200,
                        sx: .9,
                        sy: .85,
                        spriteDetails: {
                            open: 1
                        }
                    },

                    {
                        frame: 1000,
                        tx: 650,
                        ty: 200,
                        sx: .9,
                        sy: .85,
                        spriteDetails: {
                            open: 0
                        }
                    }
                ]
            },

            {
                draw: bloo,
                keyframes: [
                    {
                        frame: 0,
                        tx: 110,
                        ty: 185,
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
                        sy: .725
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
                        sy: .7
                    },

                    {
                        frame: 300,
                        tx: 400,
                        ty: 250,
                        sx: .75,
                        sy: .725
                    },

                    {
                        frame: 350,
                        tx: 450,
                        ty: 250,
                        sx: .75,
                        sy: .72
                    },

                    {
                        frame: 400,
                        tx: 500,
                        ty: 250,
                        sx: .75,
                        sy: .73
                    },

                    {
                        frame: 450,
                        tx: 550,
                        ty: 250,
                        sx: .75,
                        sy: .71
                    },

                    {
                        frame: 500,
                        tx: 600,
                        ty: 250,
                        sx: .75,
                        sy: .73
                    },

                    {
                        frame: 570,
                        tx: 670,
                        ty: 250,
                        sx: .75,
                        sy: .72
                    },

                    {
                        frame: 600,
                        tx: 680,
                        ty: 250,
                        sx: .75,
                        sy: .72,
                        spriteDetails: {
                            smile: 1
                        }
                    },

                    {
                        frame: 1000,
                        tx: 680,
                        ty: 250,
                        sx: .75,
                        sy: .72,
                        spriteDetails: {
                            smile: 1
                        }
                    }

                ]
            },

            {
                draw: paddle,
                keyframes: [
                    {
                        frame: 600,
                        tx: 680,
                        ty: 220,
                        sx: .9,
                        sy: .95
                    },

                    {
                        frame: 1000,
                        tx: 680,
                        ty: 160,
                        sx: .9,
                        sy: .85,
                        
                    }
                ]
            },

            {
                draw: cheese,
                keyframes: [
                    {
                        frame: 1000,
                        tx: 0,
                        ty: 0,
                        sx: .9,
                        sy: .9
                    },

                    {
                        frame: 1150,
                        tx: 0,
                        ty: 0,
                        sx: .9,
                        sy: .9
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
        sprites: sprites,
        frameRate: 36
    });

    var chorus = new Audio('../sprites/hallelujah.mp3');
    var poot = new Audio('../sprites/pooted.mp3');
    var bloo = new Audio('../sprites/bloo.mp3');

    setTimeout(mattress, 8400);
    setTimeout(notNow, 17600);
    setTimeout(now, 17800);
    setTimeout(playIt, 27000);

    function mattress() {
        bloo.play();
    }

    function notNow() {
        bloo.pause();
        bloo.currentTime = 0;    
    }

    function playIt() {
        poot.play();
    }

    function now() {
        chorus.play();
    }
}());