// Задания на урок:

// 1) Реализовать функционал, что после заполнения формы и нажатия кнопки "Подтвердить" - 
// новый фильм добавляется в список. Страница не должна перезагружаться.
// Новый фильм должен добавляться в movieDB.movies.
// Для получения доступа к значению input - обращаемся к нему как input.value;
// P.S. Здесь есть несколько вариантов решения задачи, принимается любой, но рабочий.

// 2) Если название фильма больше, чем 21 символ - обрезать его и добавить три точки

// 3) При клике на мусорную корзину - элемент будет удаляться из списка (сложно)

// 4) Если в форме стоит галочка "Сделать любимым" - в консоль вывести сообщение: 
// "Добавляем любимый фильм"

// 5) Фильмы должны быть отсортированы по алфавиту

'use strict';
document.addEventListener('DOMContentLoaded', () => {

    const movieDB = {
        movies: [
            "Логан",
            "Лига справедливости",
            "Ла-ла лэнд",
            "Одержимость2",
            "Скотт Пилигрим против..."
        ]
    };
    
    const advBox = document.querySelectorAll('.promo__adv img'),
        genreText = document.querySelector('.promo__genre'),
        filmsList = document.querySelector('.promo__interactive-list'),
        bgPict = document.querySelector('.promo__bg'),
        addForm = document.querySelector('form.add'),
        addInput = addForm.querySelector('.adding__input'),
        checkbox = addForm.querySelector('[type="checkbox"]');

    const makeChanged = () => {
        genreText.textContent = 'драма';
        bgPict.style.backgroundImage = 'url("img/bg.jpg")';
    };


    function deleteAdv(arr){
        arr.forEach((item)=>{
            item.remove();
        });
    }

    function createMovieList(films, parent){
        parent.innerHTML = '';
        films.forEach((film, i) => {
            parent.innerHTML += `<li class="promo__interactive-item">${i + 1} ${film}<div class="delete"></div></li>`;
        });
        sortArray(movieDB.movies);

        document.querySelectorAll('.delete').forEach((btn,i)  => {
            btn.addEventListener('click', () => {
                btn.parentElement.remove();
                movieDB.movies.splice(i, 1);
                createMovieList(movieDB.movies, filmsList);
            });
            
        })

    }

    function sortArray(arr){
        arr.sort();
    }

    deleteAdv(advBox);
    makeChanged();
    sortArray(movieDB.movies);
    createMovieList(movieDB.movies, filmsList);

    addForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let newFilm = addInput.value;
        let favorite = checkbox.checked;

        if(newFilm.length > 21){
            newFilm = `${newFilm.substring(0, 22)}...`;
        }

        if(favorite){
            console.log('Добавляем любимый фильм');
        }

        if(newFilm){
            movieDB.movies.push(newFilm);
            createMovieList(movieDB.movies, filmsList);
            event.target.reset();
        }
    })

    
    
});


