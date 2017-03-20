
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 'auto',
        centeredSlides: true,
        paginationClickable: true,
        spaceBetween: 0,
        loop: true,
        onSlideChangeEnd:   function(){
            //alert("slided");
        }
    });
    