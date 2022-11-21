$(function(){
    
    var positionElementInPage = $('#barreDesTaches').offset().top;
    $(window).scroll(
    function() {
        if ($(window).scrollTop() >= positionElementInPage) {
            // fixed
            $('#barreDesTaches').addClass("floatable");
            $('#explication').addClass("floatable");
        } else {
        // relative
            $('#barreDesTaches').removeClass("floatable");
            $('#explication').removeClass("floatable");
        }
    }
    );
/*
    window.onresize = 
        function(){
            var Size1 = document.getElementById('head').offsetWidth;
            var newSize = Size1*0.305;
            console.log(newSize);
            document.getElementById('head').style.height = '101px';
        }*/
});