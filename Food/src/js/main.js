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

    setClock('.timer' ,deadline);

    //modal window
    const modalTriggers = document.querySelectorAll('[data-modal]'),
        modalWindow = document.querySelector('.modal'),
        modalClose = document.querySelector('[data-close]');

    for (const modal of modalTriggers){
        modal.addEventListener('click', () => {
            openModalWindow();
            clearInterval(modalTimerId);
        });
    }   

    modalClose.addEventListener('click', closeModalWindow);

    modalWindow.addEventListener('click', (e)=>{
        if(e.target === modalWindow){
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
        constructor(title, photo, alt, description, price, parentSelector){
            this.title = title;
            this.photo = photo;
            this.alt = alt;
            this.description = description;
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
                <img src="${this.photo}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            </div>`;
            this.parent.append(element);
        }
    }

    const title = 'Меню Жабы Клавы';
    const photo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgplcu-8Y0_o_T9alkBZ5E56_KrU2cU0s9hVawMSEd6TVJUnuwAaaXdAGP4sXiqFrDAWc&usqp=CAU';
    const alt = 'Тут должна быть фотка';
    const description = 'Меню Жабы Клавы самое вкусное и полезное. Его рекомендуют даже маленьким детям, потому что в нем много полезных витаминов, это самое главное для любого человека';
    const price = 130;
    const parentSelector = '.menu .container';
    const newCard = new Card(title, photo, alt, description, price, parentSelector);
    newCard.createCard();

    new Card(
        'Меню "Фитнес"',
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        150,
        '.menu .container'
    ).createCard();

    new Card(
        'Меню “Премиум”',
        "img/tabs/elite.jpg",
        "elite",
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        10,
        '.menu .container'
    ).createCard();

    //Forms, work with backend, receipt data from forms
    
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Мы скоро с вами свяжемся',
        failure: 'Что-то пошло не так...'
    }

    forms.forEach(item => {
        postData(item);
    })

    function postData(form){
        form.addEventListener('submit', (e)=> {
            e.preventDefault();

            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

            const formData = new FormData(form);
            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });

            const json = JSON.stringify(object);

            request.send(json);

            request.addEventListener('load', () => {
                if(request.status === 200){
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                    form.reset();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 3000);
                }else{
                    statusMessage.textContent = message.failure;
                }
            })
        })
    }
    

});
