function modal() {
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
}

module.exports = modal;