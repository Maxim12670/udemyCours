function calc() {
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
}

module.exports = calc;