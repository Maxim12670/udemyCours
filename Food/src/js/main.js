window.addEventListener('DOMContentLoaded', function() {
    //Tabs
    let tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = this.document.querySelector('.tabheader__items');
    

    function hideTabContent(){
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0){
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', function(event) {
		const target = event.target;
		if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
		}
	});

    //Timer

    const deadline = '2023-09-02';

    function getTimeRemaining(endtime){
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000*60*60*24)),
            hours = Math.floor((t / (1000*60*60))%24),
            minutes = Math.floor((t/(1000*60))%60),
            seconds = Math.floor((t/1000)%60);

        return {
            'total' : t,
            'days' : days,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function getZero(num){
        if(num >= 0 && num < 10){
            return `0${num}`;
        }
        else if(num < 0){
            return 0;
        }
        else{
            return num;
        }
    }


    function setClock(selector, endtime){
        const timer = document.querySelector(selector),
            days = document.querySelector('#days'),
            hours = document.querySelector('#hours'),
            minutes = document.querySelector('#minutes'),
            seconds = document.querySelector('#seconds'),
            timerInterval = setInterval(updateClock, 1000);


        updateClock();
        function updateClock(){
            const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timerInterval);
            }
        }
    }

    setClock('.timer', deadline);

    //modal window
    const modalTriggers = document.querySelectorAll('[data-modal]'),
        modalWindow = document.querySelector('.modal');

    for (const modal of modalTriggers){
        modal.addEventListener('click', () => {
            openModalWindow();
            clearInterval(modalTimerId);
        });
    }   

    modalWindow.addEventListener('click', (e)=>{
        if(e.target === modalWindow || e.target.getAttribute('data-close') == ''){
            closeModalWindow();
        }
    });

    document.addEventListener('keydown', (e)=> {
        if(e.code === 'Escape'){
            closeModalWindow();
        }
    })

    function openModalWindow(){
        modalWindow.classList.add('show');
        modalWindow.classList.remove('hide');
        document.body.style.overflow = 'hidden';
    }

    function closeModalWindow(){
        modalWindow.classList.add('hide');
        modalWindow.classList.remove('show');
        document.body.style.overflow = '';
    }

    const modalTimerId = setTimeout(openModalWindow, 3000);

    function showModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModalWindow()
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //work with class for cards

    class Card{
        constructor(img, altimg, title, descr, price, parentSelector){
            this.img = img;
            this.altimg = altimg;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 36.95;
            this.changeToUAN();
        }

        changeToUAN(){
            this.price = this.price * this.transfer;
        }

        createCard() {
            const element = document.createElement('div');
            element.innerHTML = `
            <div class="menu__item">
                <img src="${this.img}" alt="${this.altimg}">
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            </div>`;
            this.parent.append(element);
        }
    };

    const getResource = async (url) => {
        const res = await fetch(url);

        if(!res.ok){
            throw new Error('Ошибка');
        }

        return await res.json();
    }

    getResource('http://localhost:3000/menu ')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new Card(img, altimg, title, descr, price, '.menu .container').createCard();
            });
        });

        
    //Forms, work with backend, receipt data from forms
    
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Мы скоро с вами свяжемся',
        failure: 'Что-то пошло не так...'
    }

    forms.forEach(item => {
        bindPostData(item);
    })

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: data
        });

        return await res.json();
    }

    function bindPostData(form){
        form.addEventListener('submit', (e)=> {
            e.preventDefault();

            let statusMessage = document.createElement('div');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(()=> {
                showThanksModal(message.failure);
            }).finally(()=> {
                form.reset();
            });
        })
    }


    function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__dialog');
        
        prevModalDialog.classList.add('hide');
        openModalWindow();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = 
        `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(()=> {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModalWindow();
        }, 4000)
    }

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
    

    // showSlides(1);

    // if(slides.length < 10){
    //     total.textContent = `0${slides.length}`;
    // }else{
    //     total.textContent = slides.length;
    // }

    // function showSlides(n){
    //     if(n > slides.length){
    //         slideIndex = 1;
    //     }else if(n < 1){
    //         slideIndex = slides.length;
    //     }

    //     slides.forEach(item => {
    //         item.style.display = 'none';
    //     });

    //     slides[slideIndex - 1].style.display = 'block';

    //     if(slides.length < 10){
    //         current.textContent = `0${slideIndex}`;
    //     }else{
    //         current.textContent = slideIndex;
    //     }
    // }

    // function plusSlides(n){
    //     showSlides(slideIndex += n);
    // }

    // next.addEventListener('click', function(){
    //     plusSlides(1);
    // });

    // prev.addEventListener('click', function(){
    //     plusSlides(-1);
    // });



    //Calorie calculat
    const result = document.querySelector('.calculating__result span');
    let sex = 'female', 
        height, weight, age,
        ratio = 1.375;

    function calcTotal(){
        if(!sex || !height || !weight || !age || !ratio){
            result.textContent = "____";
            return;
        }

        if(sex == 'female'){
            result.textContent = Math.round(447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)*ratio);
        }else{
            result.textContent = Math.round(88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)*ratio);
        }
    }

    calcTotal();

    function getStaticInfo(parentSelector, activeClass){
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if(e.target.getAttribute('data-ratio')){
                    ratio = +e.target.getAttribute('data-ratio');
                }else{
                    sex = e.target.getAttribute('id');
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);
                calcTotal();
            });
        })
    }

    getStaticInfo('#gender', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');


    function getDynamicInfo(selector){
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if(input.value.match(/\D/g)){
                input.style.border = '1px solid red';
            }else{
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')){
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
});
