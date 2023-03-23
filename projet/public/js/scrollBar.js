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
    )
});