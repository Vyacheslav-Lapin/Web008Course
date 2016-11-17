// не самое оптимальное решение
const clickMe = document.getElementById(`clickMe`),
count = 0;

clickMe.addEventListener(`click`, myHandler, false);

function myHandler(evt) {
    const src = evt.target.getElementsByClassName(`counter`)[0];
    src.innerHTML = parseInt(src.innerText) + 1;

    evt.stopPropagation(); // предотвратить дальнейшее всплытие события
    evt.preventDefault(); // предотвратить выполнение действия по умолчанию
}
