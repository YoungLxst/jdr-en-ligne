//socket
var socket
socket = io.connect('http://localhost:80')

const url = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
const room = url.room

//canvas carte
const canvas = document.getElementById("myCanvas")
const ctxMap = canvas.getContext('2d')
canvas.height = document.getElementById('app-wrapper').clientHeight - 8 - document.getElementById('menu').clientHeight
canvas.width = document.getElementById('app-wrapper').clientWidth - 100 - 12 - document.getElementById('groupe').clientWidth - document.getElementById('coment').clientWidth
let widhtDiff = document.getElementById('groupe').clientWidth
let heightDiff = document.getElementById('menu').clientHeight

//canvas token
const canvasToken = document.getElementById("myToken")
const ctxPawn = canvasToken.getContext("2d")
canvasToken.height = document.getElementById('app-wrapper').clientHeight - 8 - document.getElementById('menu').clientHeight
canvasToken.width = document.getElementById('app-wrapper').clientWidth - 100 - 12 - document.getElementById('groupe').clientWidth - document.getElementById('coment').clientWidth

//button
var color = document.getElementById('myColor')
var bgrColor = document.getElementById('background')
var size = document.getElementById('size')
var bPawn = document.getElementById('pawn')
var undo = document.getElementById('undo')

let painting = false
let penUsed = true
let eraser = false
// drag related variables
var dragok = false
var startX
var startY

let restore_array = []
let index = -1

// an array of objects that define different rectangles
var pawns = []

canvasToken.addEventListener('mousedown', myDown)
canvasToken.addEventListener('mouseup', myUp)
canvasToken.addEventListener('mousemove', myMove)

// call to draw the scene
drawPawn()

// draw a single pawn
function pawn(x, y, w) {
    ctxPawn.beginPath()
    ctxPawn.arc(x, y, w, 0, 2 * Math.PI)
    ctxPawn.closePath()
    ctxPawn.fill()
}

// clear the canvasToken
function clear() {
    ctxPawn.clearRect(0, 0, canvasToken.width, canvasToken.height)
}

// redraw the scene
function drawPawn() {
    clear()
    // redraw each rect in the pawns[] array
    for (var i = pawns.length - 1; i >= 0; i--) {
        var r = pawns[i]
        ctxPawn.fillStyle = r.fill
        pawn(r.x, r.y, r.width)
    }
}

function addPawn() {
    var pawn = {
        x: 75,
        y: 50,
        width: 20,
        fill: document.getElementById('pawn_color').value,
        isDragging: false
    }
    pawns.push(pawn)
    drawPawn()
    socket.emit('addPawn', pawn, room)
}

function calculDistance(r, x, y) {
    var dist
    var distX
    var distY

    distX = r.x - x
    distY = r.y - y
    dist = (distX * distX) + (distY * distY)
    return Math.sqrt(dist)
}


document.getElementById('pen').onclick = function () {
    if (!penUsed) {
        penUsed = true
        eraser = false
    }
    else penUsed = false
}

document.getElementById('erase').onclick = function () {
    if (!eraser) {
        eraser = true
        penUsed = false
    }
    else eraser = false
}



function draw(e) {
    ctxMap.lineJoin = 'round'
    ctxMap.lineCap = 'round'
    var x = e.pageX - widhtDiff - 28
    var y = e.pageY - heightDiff - 28
    ctxMap.lineTo(x, y)
    ctxMap.stroke()
    var data = {
        x: x,
        y: y
    }
    socket.emit('mouse', data, room)
}

function erase(e) {
    var x = e.pageX - widhtDiff - 30
    var y = e.pageY - heightDiff - 30
    ctxMap.clearRect(x, y, 20, 20)
    var data = {
        x: x,
        y: y
    }
    socket.emit('erase', data, room)
}


document.getElementById('myColor').addEventListener('change', function () {
    ctxMap.strokeStyle = color.value
})

size.addEventListener('change', function () {
    ctxMap.lineWidth = size.value

    socket.emit('size', size.value, room)
})

bgrColor.addEventListener('change', function () {
    canvas.style.backgroundColor = bgrColor.value

    socket.emit('background', bgrColor.value, room)
})

document.getElementById('create_pawn').addEventListener('click', addPawn)

undo.onclick = function () {
    socket.emit('undo', room)
    if (index >= 1) {

        index--
        restore_array.pop()
        ctxMap.clearRect(0, 0, canvas.width, canvas.height)
        ctxMap.putImageData(restore_array[index], 0, 0)
        console.log(index)
        console.log(restore_array)
    } else {
        restore_array.pop()
        index = -1
        ctxMap.clearRect(0, 0, canvas.width, canvas.height)
    }
}


function myDown(e) {

    // get the current mouse position
    var mx = e.pageX - widhtDiff - 28
    var my = e.pageY - heightDiff - 28

    // test each rect to see if mouse is inside
    dragok = false
    var noPawnDrag = true
    for (var i = 0; i < pawns.length; i++) {
        var r = pawns[i]
        var dist = calculDistance(r, mx, my)
        if (dist <= r.width) {
            // if yes, set that pawns isDragging=true
            dragok = true
            r.isDragging = true
            let tmp
            let next = r
            socket.emit('dragok', i, room)
            for (var j = 0; j <= i; j++) {
                tmp = next
                next = pawns[j]
                pawns[j] = tmp
            }
            noPawnDrag = false
            drawPawn()
            break
        }
    }
    // save the current mouse position
    startX = mx
    startY = my

    if (noPawnDrag == true) {
        painting = true
    }
}

function myUp(e) {

    // clear all the dragging flags
    dragok = false
    for (var i = 0; i < pawns.length; i++) {
        pawns[i].isDragging = false
    }

    if (painting == true) {
        restore_array.push(ctxMap.getImageData(0, 0, canvas.width, canvas.height))
        index++
        socket.emit('up', room)
    }

    painting = false
    ctxMap.beginPath()


}

function myMove(e) {

    // if we're dragging anything...
    if (dragok) {

        // get the current mouse position
        var mx = e.pageX - widhtDiff - 28
        var my = e.pageY - heightDiff - 28

        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX
        var dy = my - startY


        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        var r = pawns[0]
        const data = {
            x: dx,
            y: dy
        }
        if (r.isDragging) {
            socket.emit('drag', data, room)
            r.x += dx
            r.y += dy
        }

        // redraw the scene with the new rect positions
        drawPawn()

        // reset the starting mouse position for the next mousemove
        startX = mx
        startY = my

    }


    if (painting) {
        if (penUsed) draw(e)
        if (eraser) erase(e)
    }

}

window.onresize = function () {
    canvas.height = document.getElementById('app-wrapper').clientHeight - 8 - document.getElementById('menu').clientHeight
    canvas.width = document.getElementById('app-wrapper').clientWidth - 100 - 12 - document.getElementById('groupe').clientWidth - document.getElementById('coment').clientWidth
    canvasToken.height = document.getElementById('app-wrapper').clientHeight - 8 - document.getElementById('menu').clientHeight
    canvasToken.width = document.getElementById('app-wrapper').clientWidth - 100 - 12 - document.getElementById('groupe').clientWidth - document.getElementById('coment').clientWidth
    widhtDiff = document.getElementById('groupe').clientWidth
    heightDiff = document.getElementById('menu').clientHeight
    if (restore_array.length != 0) {
        ctxMap.putImageData(restore_array[index], 0, 0)
    }
    drawPawn()
}

/**
 * socket function
 */

socket.emit('join-room',room)

socket.on('addPawn', (data) => {
    pawns.push(data)
    drawPawn()
})

socket.on('mouse', (data) => {
    ctxMap.lineJoin = 'round'
    ctxMap.lineCap = 'round'
    ctxMap.lineTo(data.x, data.y)
    ctxMap.stroke()
})

socket.on('up', () => {
    ctxMap.beginPath()
    restore_array.push(ctxMap.getImageData(0, 0, canvas.width, canvas.height))
    index++
})

socket.on('erase', (data) => {
    ctxMap.clearRect(data.x, data.y, 20, 20)
})

socket.on('size', (data) => {
    ctxMap.lineWidth = data
})

socket.on('background', (data) => {
    canvas.style.backgroundColor = data
})

socket.on('undo', () => {
    if (index >= 1) {

        index--
        restore_array.pop()
        ctxMap.clearRect(0, 0, canvas.width, canvas.height)
        ctxMap.putImageData(restore_array[index], 0, 0)
        console.log(index)
        console.log(restore_array)
    } else {
        restore_array.pop()
        index = -1
        ctxMap.clearRect(0, 0, canvas.width, canvas.height)
    }
})

socket.on('dragok', (data) => {
    console.log('receive dragok' + data)
    var r = pawns[data]
    r.isDragging = true
    let tmp
    let next = r
    for (var j = 0; j <= data; j++) {
        tmp = next
        next = pawns[j]
        pawns[j] = tmp
    }
    drawPawn()
})

socket.on('drag', (data) => {
    console.log(data)
    var r = pawns[0]
    r.x += data.x
    r.y += data.y
    drawPawn()
})

/*
window.onload = function(){
var canvas 
var ctxMap
var delay = 80
var blockSize = 30
var canvasWidth = 900
var canvasHeight = 600
var snakee
var applee

init()
 
function init(){
    canvas = document.createElement('canvas')
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    canvas.style.border = "2px solid"
    document.body.appendChild(canvas)

    ctxMap = canvas.getContext('2d')
    snakee = new Snake([[6,4],[5,4],[4,4]],"right")
    applee = new Apple([0,0])
    applee.getNewPosition(snakee.body)
    refreshCanvas()
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

function refreshCanvas(){
    ctxMap.clearRect(0,0,canvasWidth,canvasHeight)
    snakee.advance(applee.position)
    snakee.draw()
    applee.draw()
    //applee.getNewPosition(snakee.body)
    console.log(applee.position)
    setTimeout(refreshCanvas,delay)
}

function drawBlock(ctxMap, position){
    var x = position[0] * blockSize
    var y = position[1] * blockSize
    ctxMap.fillRect(x,y,blockSize,blockSize)
}

function check(a,b){
    if(a[0] == b[0] && a[1] == b[1]) return 0
    else return 1
}

function Snake(body,direction){
    this.body = body
    this.direction = direction
    this.draw = function(){
        ctxMap.save()
        ctxMap.fillStyle = "ff0000"
        for(var i = 0 i<this.body.length i++){
            drawBlock(ctxMap,this.body[i])
        }
        ctxMap.restore()
    }

    this.advance = function(applePos){
        var nextPostition = this.body[0].slice()
        switch(this.direction){
            case "left":
                nextPostition[0] -= 1
                break
            case "right":
                nextPostition[0] += 1
                break
            case "down" :
                nextPostition[1] = nextPostition[1]+1
                break
            case "up" :
                nextPostition[1] = nextPostition[1]-1
                break
            default:
                console.log("fuck you")
                return
        }
        
        this.body.unshift(nextPostition)
        if(nextPostition[0] == applePos[0] && nextPostition[1] == applePos[1]) applee.getNewPosition(this.body)
        else this.body.pop()
    }

    this.setDirection = function(newDirection){
        var allowedDirection
        switch(this.direction){
            case "left":
            case "right":
                allowedDirection = ["down","up"]
                break
            case "down":
            case "up":
                allowedDirection = ["left","right"]
                break
            default:
                throw("invalide direction")
        }
        if(allowedDirection.indexOf(newDirection)>-1){
            this.direction = newDirection
        }
    }

    this.getBiger = function(){
        var last = this.body[this.body.length-1]
        this.body.push(last)
    }

}

function Apple(position){
    this.position = position
    this.draw = function(){
        ctxMap.save()
        ctxMap.fillStyle = "#33cc33"
        ctxMap.beginPath()
        var radius = blockSize/2
        var x = this.position[0]*blockSize+radius
        var y = this.position[1]*blockSize+radius
        ctxMap.arc(x,y,radius,0,2*Math.PI,true)
        ctxMap.fill()
        ctxMap.restore()
    }
    this.getNewPosition = function(body){
        var x = getRandomInt(30)
        var y = getRandomInt(20)
        var good = 1
        for(var i = 0  i<body.lengthi++){
            if(check([x,y],body[i])==0) good = 0
        }
        if(good == 1) this.position = [x,y]
        else this.getNewPosition()
    }
}

document.onkeydown = function handleKeyDown(e){
    var key = e.code
    var newDirection
    switch(key){
        case "KeyA":
            newDirection = "left"
            break
        case "KeyW":
            newDirection = "up"
            break
        case "KeyD":
            newDirection = "right"
            break
        case "KeyS":
            newDirection = "down"
            break
        default:
            return
    }

    snakee.setDirection(newDirection)
}
}
*/