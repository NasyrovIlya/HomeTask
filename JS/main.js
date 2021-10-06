// Необходимо реализовать вывод информации полученной от сервера.

// Выводить инфу надо как обычно, отрисовывая в html.
// Информацию получать от ЦБ по адресу:
// https://www.cbr-xml-daily.ru/daily_json.js

// Получение должно происходить по нажатию на кнопку.
// Далее, вывести результат запроса. (успешный или не успешный)
// Следующая кнопка отрисовать данные в красивом виде.
// Так же предусмотреть обработку ошибок от сервера.
// Сделать отрисовку кнопок по всем валютам, по нажатии на одну из них, отрисовывать инфу именно по необходимой валюте.

const URLDATA = 'https://www.cbr-xml-daily.ru/daily_json.js';
let obj = {};

async function getData() {
  try {
    const responce = await fetch(URLDATA);
    return await responce.json();
  } catch (e) {
    alert(`Произошла ошибка: ${e.message}`);
  }
}

document.addEventListener('click', async (event) => {
  if (event.target.closest('.nav__link')) {
    clearValute();
    obj = await getData();
    const containerMain = document.querySelector('main');
    Object.values(obj.Valute).forEach(item => { containerMain.insertAdjacentHTML('beforeEnd', printValute(item)) })
  }

  if (event.target.closest('.btn') && event.target.hasAttribute('id')) {
    const filterObj = Object.values(obj.Valute).filter(item => {
      if (item.ID === event.target.getAttribute('id')) { return item; }
    });
    ShowPopup(filterObj[0]);
  }

  if (event.target.closest('.popup__close')) {
    event.preventDefault();
    ClosePopup();
  }
})

function ShowPopup(object) {
  document.getElementById('popup').classList.add('open');
  document.querySelector('.popup__content').insertAdjacentHTML('beforeend', prinyValuteElement(object));
}

function ClosePopup() {
  document.getElementById('popup').classList.remove('open');
  document.getElementById('pupup__valute').remove();
}

function clearValute() {
  document.querySelectorAll('.main__wrapper').forEach(elem => elem.remove());
}

function prinyValuteElement(item) {
  return `
    <div id = "pupup__valute">
      <h1>${item.Name}</h1>
      <h2>${item.CharCode}</h2>
      <p>Предыдущий: ${item.Previous}</p>
      <p>Текущий: ${item.Value}</p>
    </div>
  `;
}

function printValute(item) {
  return `
    <div class = "main__wrapper">
      <div class = "main__item">${item.CharCode}</div>
      <button class = "btn" id = "${item.ID}">Подробнее</button>
    </div>
    `;
}
