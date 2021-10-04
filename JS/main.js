// Необходимо реализовать вывод информации полученной от сервера.

// Выводить инфу надо как обычно, отрисовывая в html.
// Информацию получать от ЦБ по адресу:
// https://www.cbr-xml-daily.ru/daily_json.js

// Получение должно происходить по нажатию на кнопку.
// Далее, вывести результат запроса. (успешный или не успешный)
// Следующая кнопка отрисовать данные в красивом виде.
// Так же предусмотреть обработку ошибок от сервера.
// Сделать отрисовку кнопок по всем валютам, по нажатии на одну из них, отрисовывать инфу именно по необходимой валюте.

let obj = {}

function getData(url = 'https://www.cbr-xml-daily.ru/daily_json.js') {
  fetch(url).then(function (response) {
    response.text().then(function (text) {
      obj = JSON.parse(text);
    });
  });
  return obj;
}

document.addEventListener('click', event => {
  if (event.target.closest('.nav__link')) {
    getData('https://www.cbr-xml-daily.ru/daily_json.js');
    Object.values(obj.Valute).forEach(item => {
      document.querySelector('main').insertAdjacentHTML('beforeEnd', printValute(item));
    })
  }
  if (event.target.closest('.btn')) {
    if (event.target.hasAttribute('id')) {
      let filterObj = {}

      filterObj = Object.values(obj.Valute).filter(item => {
        if (item.ID === event.target.getAttribute('id')) {
          return item;
        }
      });
      console.log(filterObj);
    }
  }
})


function printValute(item) {
  return `
    <div class = "main__wrapper">
      <div class = "main__item">${item.CharCode}</div>
      <button class = "btn" id = "${item.ID}">Подробнее</button>
    </div>
    `;
}
