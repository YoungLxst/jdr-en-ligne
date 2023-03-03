const form = document.querySelector("#creation form"),
button = form.querySelector("#cree");

form.onsubmit = (e)=>{
    e.preventDefault();
};

button.onclick = function(){
    let xhr = new XMLHttpRequest();
    xhr.open("POST","php/createEdge.php",true);
    xhr.onload = function(){
        if(xhr.readyState === XMLHttpRequest.DONE){
            if(xhr.status === 200){
                let data = JSON.parse(xhr.response);
                if(data.success){
                    //success
                }
                document.getElementById('INT_error').innerHTML= data.INT_error;
                    document.getElementById('nom_error').innerHTML= data.nom_error;
                    document.getElementById('prenom_error').innerHTML= data.prenom_error;
                    document.getElementById('REF_error').innerHTML= data.REF_error;
                    document.getElementById('DEX_error').innerHTML= data.DEX_error;
                    document.getElementById('TECH_error').innerHTML= data.TECH_error;
                    document.getElementById('PRES_error').innerHTML= data.PRES_error;
                    document.getElementById('VOL_error').innerHTML= data.VOL_error;
                    document.getElementById('MOUV_error').innerHTML= data.MOUV_error;
                    document.getElementById('COR_error').innerHTML= data.COR_error;
                    document.getElementById('EMP_error').innerHTML= data.EMP_error;
                    document.getElementById('CARA_error').innerHTML= data.CARA_error;
                    document.getElementById('QUERY_error').innerHTML= data.QUERY_error;
                    document.getElementById('_error').innerHTML= data._error;
                
            }
        }
    }
    let formD = new FormData(form);
    xhr.send(formD);
};