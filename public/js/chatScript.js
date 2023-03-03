var socket = io.connect('http://localhost')

console.log(sessionStorage.getItem('idUser'))

socket.emit('login',{id: sessionStorage.getItem('idUser')})

socket.on('newUser',()=>{
    document.querySelector('.user_list ul').innerHTML += '<li><div class="user"><div class="profil-pic"><img src="/resources/1987458.jpg" height="75px" width="75px"></div></div></li>'
})