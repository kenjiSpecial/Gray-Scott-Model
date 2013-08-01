// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

(function () {
    function initValue() {
        for (var i = 0; i < side; i++) {
            valUs[i] = [];
            valVs[i] = [];

            dU[ i ] = [];
            dV[ i ] = [];

            for (var j = 0; j < side; j++) {
                if (i > side / 9 * 4 && i < side / 9 * 5 && j > side / 9 * 4 && j < side / 9 * 5) {
                    valUs[i][j] = 0.5;
                    valVs[i][j] = 0.25;
                } else {
                    valUs[i][j] = 1;
                    valVs[i][j] = 0;
                }


                dU[ i ][ j ] = 0;
                dV[ i ][ j ] = 0;
            }
        }
    }

    // ---------

    var side = 200,
        canvas = document.getElementById('mainCanvas');

    canvas.width = side;
    canvas.height = side;

    var context = canvas.getContext("2d");

    var valUs = [],
        valVs = [],
        dU = [],
        dV = [];
    var offset = [];

    var diffU = 0.16,
        diffV = 0.08,
        paramF = 0.035,
        paramK = 0.06;

    initValue();

    offset[0] = [];
    offset[0][0] = side - 1;
    offset[0][1] = 1;

    for (i = 1; i < side - 1; i++) {
        offset[i] = [];
        offset[i][0] = i - 1;
        offset[i][1] = i + 1;
    }

    offset[side - 1] = [];
    offset[side - 1][0] = side - 2;
    offset[side - 1][1] = 0;

    loop();

    function loop() {
        for (var num = 0; num < 9; num++) {
            for (var i = 0; i < side; i++) {
                for (var j = 0; j < side; j++) {

                    var u, v, left, right, up, down;
                    var uvv, lapU, lapV;

                    u = valUs[i][j];
                    v = valVs[i][j];

                    left = offset[i][0];
                    right = offset[i][1];

                    up = offset[ j ][ 0 ];
                    down = offset[ j ][ 1 ];

                    uvv = u * v * v;

                    lapU = valUs[left][j] + valUs[right][j] + valUs[i][up] + valUs[i][down] - 4 * u;
                    lapV = valVs[left][j] + valVs[right][j] + valVs[i][up] + valVs[i][down] - 4 * v

                    dU[i][j] = diffU * lapU - uvv + paramF * (1 - u);
                    dV[i][j] = diffV * lapV + uvv - (paramK + paramF) * v;
                }
            }

            for (i = 0; i < side; i++) {
                for (j = 0; j < side; j++) {
                    valUs[i][j] += dU[i][j];
                    valVs[i][j] += dV[i][j];
                }
            }
        }


        context.fillStyle = "#000";
        context.fillRect(0, 0, side, side);


        for (i = 0; i < side; i++) {
            for (j = 0; j < side; j++) {
                if (valUs[i][j] < 1) {
                    var color = ( 255 * ( 1 - valUs[i][j] ) ) | 0;
                    context.fillStyle = "rgb( 0, 0, " + color + ")";
                    context.fillRect(i, j, 1, 1)
                }
            }
        }


        // ------------

        requestAnimFrame(loop);
    }

    var count = 0;
    $(window).mousedown(function () {

        count = (count + 1) % 6;
        switch (count) {
            case 0:
                diffU = 0.16;
                diffV = 0.08;
                paramF = 0.035;
                paramK = 0.06;
                break;
            case 1:
                diffU = 0.16;
                diffV = 0.08;
                paramF = 0.042;
                paramK = 0.065;
                break;
            case 2:
                diffU = 0.18;
                diffV = 0.09;
                paramF = 0.02;
                paramK = 0.056;
                break;
            case 3:
                diffU = 0.14;
                diffV = 0.06;
                paramF = 0.035;
                paramK = 0.065;
                break;
            case 4:
                diffU = 0.19;
                diffV = 0.09;
                paramF = 0.062;
                paramK = 0.062;
                break;
            case 5:
                diffU = 0.16;
                diffV = 0.08;
                paramF = 0.05;
                paramK = 0.065;
                break;

        }

        initValue();

    });


})();