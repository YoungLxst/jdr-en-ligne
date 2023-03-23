const url = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
const room = url.room

const user = sessionStorage.getItem('idUser')

minHeight = 650
minWidth = 520

//canvas carte
const canvas = document.getElementById("myCanvas")
const ctxMap = canvas.getContext('2d')
canvas.height = document.getElementsByClassName('app-field')[0].clientHeight - 10
canvas.width = document.getElementsByClassName('app-field')[0].clientWidth
let heightDiff = 10

//canvas token
const canvasToken = document.getElementById("myToken")
const ctxPawn = canvasToken.getContext("2d")
canvasToken.height = document.getElementsByClassName('app-field')[0].clientHeight - 10
canvasToken.width = document.getElementsByClassName('app-field')[0].clientWidth

widhtDiff = 312
heightDiff = 83

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
    ctxMap.strokeStyle = color.value
    ctxMap.lineWidth = size.value
    ctxMap.lineJoin = 'round'
    ctxMap.lineCap = 'round'
    var x = e.pageX - widhtDiff 
    var y = e.pageY - heightDiff
    ctxMap.lineTo(x, y)
    ctxMap.stroke()
    var data = {
        x: x,
        y: y,
        color:color.value,
        size:size.value
    }
    socket.emit('mouse', data, room)
}

function erase(e) {
    var x = e.pageX - widhtDiff
    var y = e.pageY - heightDiff
    ctxMap.clearRect(x, y, 20, 20)
    var data = {
        x: x,
        y: y
    }
    socket.emit('erase', data, room)
}


document.getElementById('myColor').addEventListener('change',()=> {
    ctxMap.strokeStyle = color.value
})

size.addEventListener('change', () => {
    ctxMap.lineWidth = size.value
})

bgrColor.addEventListener('change', () => {
    canvas.style.backgroundColor = bgrColor.value

    socket.emit('background', bgrColor.value, room)
})

document.getElementById('create_pawn').addEventListener('click', addPawn)

undo.onclick = () => {
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

    console.log("my down")
    // get the current mouse position
    var mx = e.pageX - widhtDiff
    var my = e.pageY - heightDiff

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
        var mx = e.pageX - widhtDiff
        var my = e.pageY - heightDiff

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

window.onresize = () =>{
    canvas.height = document.getElementsByClassName('app-field')[0].clientHeight - 10
    canvas.width = document.getElementsByClassName('app-field')[0].clientWidth
    
    canvasToken.height = document.getElementsByClassName('app-field')[0].clientHeight - 10
    canvasToken.width = document.getElementsByClassName('app-field')[0].clientWidth
    if (restore_array.length != 0) {
        ctxMap.putImageData(restore_array[index], 0, 0)
    }
    drawPawn()
}
    

/**
 * socket function
 */

socket.emit('user', user)
socket.emit('join-room',room)

socket.on('addPawn', (data) => {
    pawns.push(data)
    drawPawn()
})

socket.on('mouse', (data) => {
    ctxMap.strokeStyle = data.color
    ctxMap.lineWidth = data.size
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