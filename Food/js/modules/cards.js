function cards() {
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
}

module.exports = cards;