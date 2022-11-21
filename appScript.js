$(document).ready(

    function () {

        const canvas = document.getElementById("myCanvas");
        const ctxMap = canvas.getContext('2d');
        canvas.height = document.getElementById('app-wrapper').clientHeight - 8 - document.getElementById('menu').clientHeight;
        canvas.width = document.getElementById('app-wrapper').clientWidth - 100 - 12 - document.getElementById('groupe').clientWidth - document.getElementById('coment').clientWidth;
        let widhtDiff = document.getElementById('groupe').clientWidth;
        let heightDiff = document.getElementById('menu').clientHeight;

        const canvasToken = document.getElementById("myToken");
        const ctxPawn = canvasToken.getContext("2d");
        canvasToken.height = document.getElementById('app-wrapper').clientHeight - 8 - document.getElementById('menu').clientHeight;
        canvasToken.width = document.getElementById('app-wrapper').clientWidth - 100 - 12 - document.getElementById('groupe').clientWidth - document.getElementById('coment').clientWidth;
        
        var color = document.getElementById('myColor');
        var bgrColor = document.getElementById('background');
        var size = document.getElementById('size');

        let painting = false;
        let penUsed = true;
        let eraser = false;
        // drag related variables
        var dragok = false;
        var startX;
        var startY;

        // an array of objects that define different rectangles
        var rects = [];
        rects.push({
            x: 75 - 15,
            y: 50 - 15,
            width: 20,
            height: 30,
            fill: "#444444",
            isDragging: false
        });
        rects.push({
            x: 75 - 25,
            y: 50 - 25,
            width: 20,
            height: 30,
            fill: "#ff550d",
            isDragging: false
        });
        rects.push({
            x: 75 - 35,
            y: 50 - 35,
            width: 20,
            height: 30,
            fill: "#800080",
            isDragging: false
        });
        rects.push({
            x: 75 - 45,
            y: 50 - 45,
            width: 20,
            height: 30,
            fill: "#0c64e8",
            isDragging: false
        });

        document.addEventListener('mousedown', myDown);
        document.addEventListener('mouseup', myUp);
        canvasToken.addEventListener('mousemove', myMove);

        // call to draw the scene
        drawPawn();

        // draw a single rect
        function rect(x, y, w, h) {
            ctxPawn.beginPath();
            ctxPawn.arc(x, y, w, 0, 2 * Math.PI);
            ctxPawn.closePath();
            ctxPawn.fill();
        }

        // clear the canvasToken
        function clear() {
            ctxPawn.clearRect(0, 0, canvasToken.width, canvasToken.height);
        }

        // redraw the scene
        function drawPawn() {
            clear();
            // redraw each rect in the rects[] array
            for (var i = rects.length - 1; i >= 0; i--) {
                var r = rects[i];
                ctxPawn.fillStyle = r.fill;
                rect(r.x, r.y, r.width, r.height);
            }
        }

        function calculDistance(r, x, y) {
            var dist;
            var distX;
            var distY;

            distX = r.x - x;
            distY = r.y - y;
            dist = (distX * distX) + (distY * distY);
            return Math.sqrt(dist);
        }


        document.getElementById('pen').onclick = function () {
            if (!penUsed) {
                penUsed = true;
                eraser = false;
            }
            else penUsed = false;
        }

        document.getElementById('erase').onclick = function () {
            if (!eraser) {
                eraser = true;
                penUsed = false;
            }
            else eraser = false
        }



        function draw(e) {
            ctxMap.lineJoin = 'round';
            ctxMap.lineCap = 'round';
            ctxMap.lineTo(e.pageX - widhtDiff - 28, e.pageY - heightDiff - 28);
            ctxMap.stroke();
        }

        function erase(e) {
            ctxMap.clearRect(e.pageX - widhtDiff - 30, e.pageY - heightDiff - 30, 20, 20);
        }


        document.getElementById('myColor').addEventListener('change', function () {
            ctxMap.strokeStyle = color.value;
        });

        size.addEventListener('change', function () { 
            ctxMap.lineWidth = size.value; 
        });

        bgrColor.addEventListener('change', function () {
            canvas.style.backgroundColor = bgrColor.value;
        });


        function myDown(e) {

            // get the current mouse position
            var mx = e.pageX - widhtDiff - 28 ;
            var my = e.pageY - heightDiff - 28;

            // test each rect to see if mouse is inside
            dragok = false;
            var noPawnDrag = true;
            for (var i = 0; i < rects.length; i++) {
                var r = rects[i];
                var dist = calculDistance(r, mx, my);
                if (dist <= r.width) {
                    // if yes, set that rects isDragging=true
                    dragok = true;
                    r.isDragging = true;
                    let tmp;
                    let next = r;
                    for (var j = 0; j <= i; j++) {
                        tmp = next;
                        next = rects[j];
                        rects[j] = tmp;
                    }
                    noPawnDrag = false;
                    drawPawn();
                    break;
                }
            }
            // save the current mouse position
            startX = mx;
            startY = my;

            if (noPawnDrag == true) {
                painting = true;
            }
        }

        function myUp(e) {

            // clear all the dragging flags
            dragok = false;
            for (var i = 0; i < rects.length; i++) {
                rects[i].isDragging = false;
            }

            painting = false;
            ctxMap.beginPath();
        }

        function myMove(e) {

            // if we're dragging anything...
            if (dragok) {

                // get the current mouse position
                var mx = e.pageX - widhtDiff - 28;
                var my = e.pageY - heightDiff - 28;

                // calculate the distance the mouse has moved
                // since the last mousemove
                var dx = mx - startX;
                var dy = my - startY;

                // move each rect that isDragging 
                // by the distance the mouse has moved
                // since the last mousemove
                for (var i = 0; i < rects.length; i++) {
                    var r = rects[i];
                    if (r.isDragging) {
                        r.x += dx;
                        r.y += dy;
                    }
                }

                // redraw the scene with the new rect positions
                drawPawn();

                // reset the starting mouse position for the next mousemove
                startX = mx;
                startY = my;

            }


            if (painting) {
                if (penUsed) draw(e);
                if (eraser) erase(e);
            }

        }

        window.onresize = function () {
            canvas.height = document.getElementById('app-wrapper').clientHeight - 8 - document.getElementById('menu').clientHeight;
            canvas.width = document.getElementById('app-wrapper').clientWidth - 100 - 12 - document.getElementById('groupe').clientWidth - document.getElementById('coment').clientWidth;
            canvasToken.height = document.getElementById('app-wrapper').clientHeight - 8 - document.getElementById('menu').clientHeight;
            canvasToken.width = document.getElementById('app-wrapper').clientWidth - 100 - 12 - document.getElementById('groupe').clientWidth - document.getElementById('coment').clientWidth;
            widhtDiff = document.getElementById('groupe').clientWidth;
            heightDiff = document.getElementById('menu').clientHeight;
            drawPawn();
        }
    });

/*
window.onload = function(){
var canvas ;
var ctxMap;
var delay = 80;
var blockSize = 30;
var canvasWidth = 900;
var canvasHeight = 600;
var snakee;
var applee;

init();
 
function init(){
    canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "2px solid";
    document.body.appendChild(canvas);

    ctxMap = canvas.getContext('2d');
    snakee = new Snake([[6,4],[5,4],[4,4]],"right");
    applee = new Apple([0,0]);
    applee.getNewPosition(snakee.body);
    refreshCanvas();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function refreshCanvas(){
    ctxMap.clearRect(0,0,canvasWidth,canvasHeight);
    snakee.advance(applee.position);
    snakee.draw();
    applee.draw();
    //applee.getNewPosition(snakee.body);
    console.log(applee.position);
    setTimeout(refreshCanvas,delay);
}

function drawBlock(ctxMap, position){
    var x = position[0] * blockSize;
    var y = position[1] * blockSize;
    ctxMap.fillRect(x,y,blockSize,blockSize);
}

function check(a,b){
    if(a[0] == b[0] && a[1] == b[1]) return 0;
    else return 1;
}

function Snake(body,direction){
    this.body = body;
    this.direction = direction;
    this.draw = function(){
        ctxMap.save();
        ctxMap.fillStyle = "ff0000";
        for(var i = 0; i<this.body.length; i++){
            drawBlock(ctxMap,this.body[i]);
        }
        ctxMap.restore();
    };

    this.advance = function(applePos){
        var nextPostition = this.body[0].slice();
        switch(this.direction){
            case "left":
                nextPostition[0] -= 1;
                break;
            case "right":
                nextPostition[0] += 1;
                break;
            case "down" :
                nextPostition[1] = nextPostition[1]+1;
                break;
            case "up" :
                nextPostition[1] = nextPostition[1]-1;
                break;
            default:
                console.log("fuck you");
                return;
        }
        
        this.body.unshift(nextPostition);
        if(nextPostition[0] == applePos[0] && nextPostition[1] == applePos[1]) applee.getNewPosition(this.body);
        else this.body.pop();
    };

    this.setDirection = function(newDirection){
        var allowedDirection;
        switch(this.direction){
            case "left":
            case "right":
                allowedDirection = ["down","up"];
                break;
            case "down":
            case "up":
                allowedDirection = ["left","right"];
                break;
            default:
                throw("invalide direction");
        }
        if(allowedDirection.indexOf(newDirection)>-1){
            this.direction = newDirection;
        }
    }

    this.getBiger = function(){
        var last = this.body[this.body.length-1];
        this.body.push(last);
    }

}

function Apple(position){
    this.position = position;
    this.draw = function(){
        ctxMap.save();
        ctxMap.fillStyle = "#33cc33";
        ctxMap.beginPath();
        var radius = blockSize/2;
        var x = this.position[0]*blockSize+radius;
        var y = this.position[1]*blockSize+radius;
        ctxMap.arc(x,y,radius,0,2*Math.PI,true);
        ctxMap.fill();
        ctxMap.restore();
    }
    this.getNewPosition = function(body){
        var x = getRandomInt(30);
        var y = getRandomInt(20);
        var good = 1;
        for(var i = 0 ; i<body.length;i++){
            if(check([x,y],body[i])==0) good = 0;
        }
        if(good == 1) this.position = [x,y];
        else this.getNewPosition();
    }
}

document.onkeydown = function handleKeyDown(e){
    var key = e.code;
    var newDirection;
    switch(key){
        case "KeyA":
            newDirection = "left";
            break;
        case "KeyW":
            newDirection = "up";
            break;
        case "KeyD":
            newDirection = "right";
            break;
        case "KeyS":
            newDirection = "down";
            break;
        default:
            return;
    }

    snakee.setDirection(newDirection);
}
}
*/