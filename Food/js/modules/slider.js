function slider() {
    //Slider
    const slides = document.querySelectorAll('.offer__slide'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'),
    current = document.querySelector('#current'),
    total = document.querySelector('#total'),
    slidesWrapper = this.document.querySelector('.offer__slider-wrapper'),
    slidesField = document.querySelector('.offer__slider-inner'),
    width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let offset = 0;

    if(slides.length < 10){
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    }else{
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    function deleteNotDigits(str){
        return +str.replace(/\D/g, "");
    }

    next.addEventListener('click', () => {
        if(offset == deleteNotDigits(width) * (slides.length - 1)){
            offset = 0;
        }else{
            offset += deleteNotDigits(width);
        }

        if(slideIndex == slides.length){
            slideIndex = 1;
        }else{
            slideIndex++;
        }

        if(slides.length < 10){
            current.textContent = `0${slideIndex}`;
        }else{
            current.textContent = slideIndex;
        }

        slidesField.style.transform = `translateX(-${offset}px)`;
    });

    prev.addEventListener('click', () => {
        if(offset == 0){
            offset = deleteNotDigits(width) * (slides.length - 1);
        }else{
            offset -= deleteNotDigits(width);
        }

        if(slideIndex == 1){
            slideIndex = slides.length;
        }else{
            slideIndex--;
        }

        if(slides.length < 10){
            current.textContent = `0${slideIndex}`;
        }else{
            current.textContent = slideIndex;
        }
        
        slidesField.style.transform = `translateX(-${offset}px)`;
    });
}

module.exports = slider;