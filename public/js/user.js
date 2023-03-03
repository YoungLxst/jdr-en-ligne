 $(document).ready(function(){

    function getUserId(){
/*
        $.ajax({
            url:"/ajax",
            method:"GET",
            dataType:'json',
            success:function(res){
                res
            }, 
        })*/
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/ajax', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText);
              console.log(response);
              //$('#test').html('username : '+response._id)
              sessionStorage.setItem('idUser',response._id)
            } else {
              console.log('The request failed!');
            }
          };
          
          xhr.onerror = function () {
            console.log('Network Error');
          };
          
          xhr.send();
    }
    getUserId()
})
