"use strict";

// не самое оптимальное решение
const clickMe = document.getElementById(`clickMe`),
    clickWrap = document.getElementById(`click-wrap`);

clickMe.addEventListener(`click`, myHandler, false);
clickWrap.addEventListener(`click`, myHandler, false);

function myHandler(evt) {
    const node = getCounter(evt);
    node.innerHTML = parseInt(node.innerText) + 1;

    evt.stopPropagation(); // предотвратить дальнейшее всплытие события
    evt.preventDefault(); // предотвратить выполнение действия по умолчанию

    function getCounter(evt) {
        const counter1 = evt.target,
            counter2 = counter1.getElementsByClassName(`counter`)[0];
        return counter2 ? counter2 : counter1;
    }
}
