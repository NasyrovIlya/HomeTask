// Необходимо реализовать вывод информации полученной от сервера.

// Выводить инфу надо как обычно, отрисовывая в html.
// Информацию получать от ЦБ по адресу:
// https://www.cbr-xml-daily.ru/daily_json.js

// Получение должно происходить по нажатию на кнопку.
// Далее, вывести результат запроса. (успешный или не успешный)
// Следующая кнопка отрисовать данные в красивом виде.
// Так же предусмотреть обработку ошибок от сервера.
// Сделать отрисовку кнопок по всем валютам, по нажатии на одну из них,
// отрисовывать инфу именно по необходимой валюте.


// Если ты постоянно обращаешься к localStorage то сделал бы для этого отдельную функцию в которой бы делал необходимые проверки


const URLDATA = 'https://www.cbr-xml-daily.ru/daily_json.js';

async function getData() {
  try {
    const responce = await fetch(URLDATA);
    return await responce.json();
  }
  catch (error) {
    showErrorMessage(`Произошла ошибка при получении данных: ${error.message}`);
    return [];
  }
}

function isFreshData() {
  if (localStorage.Valute) {
    let localDate = JSON.parse(localStorage.getItem('Valute'));
    let today = new Date();
    let dateLocal = new Date(localDate.Date);

    today = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`;
    dateLocal = `${dateLocal.getFullYear()}-${dateLocal.getMonth()}-${dateLocal.getDay()}`;

    if (today <= dateLocal) {
      return true;
    } else { return false };
  }
  else { return false; }
}

document.addEventListener('click', async (event) => {
  if (event.target.closest('.nav__link')) {
    const isFresh = isFreshData();
    if (isFresh) {
      clearValute();
      printValute(JSON.parse(localStorage.getItem('Valute')));
    } else {
      clearValute();
      showErrorMessage('берем новые данные');
      let obj = await getData();
      localStorage.setItem('Valute', JSON.stringify(obj));
      printValute(obj);
    }
  }

  if (event.target.closest('.btn') && event.target.hasAttribute('id')) {
    showPopupId(event.target.id);
  }

  if (event.target.closest('.popup__close')) {
    event.preventDefault();
    closePopup();
  }
})

function showPopupId(id) {
  document.getElementById(`popup${id}`).classList.add('open');
}

function printValute(obj) {
  try {
    const containerMain = document.querySelector('main');
    Object.values(obj.Valute).forEach(item => {
      containerMain.insertAdjacentHTML('beforeEnd', printValuteItem(item));
    })
  } catch (error) {
    showErrorMessage(`Произошла ошибка при обработке данных: ${error.message}`);
  }

}

function delErrorMessage() {
  let messageError = document.getElementById('error-message');
  messageError.remove();
}

function showErrorMessage(message) {
  let popupMessage = `
    <div class="error-wrap" id = "error-message">
      <div class="error">
        <h2 class="error-h2">Произошла ошибка:</h2>
        <p class="error-message">${message}</p>
      </div>
    </div>
  `;
  document.querySelector('main').insertAdjacentHTML('beforebegin', popupMessage);
  setTimeout(delErrorMessage, 5000);
}

function closePopup() {
  document.querySelectorAll('.popup').forEach(item => item.classList.remove('open'));
}

function clearValute() {
  document.querySelectorAll('.main__wrapper').forEach(elem => elem.remove());
  document.querySelectorAll('.popup').forEach(elem => elem.remove());
}

function printValuteItem(item) {
  return `
    <div class = "main__wrapper">
      <div class = "main__item">${item.Name}</div>
      <button class = "btn" id = "${item.ID}">Подробнее</button>
    </div>
    <div id="popup${item.ID}" class="popup">
      <div class="popup__body">
        <div class="popup__content">
          <a href="#" class="popup__close">X</a>
          <div id = "pupup__valute">
            <h1>${item.Name}</h1>
            <h2>${item.CharCode}</h2>
            <p>Предыдущий: ${item.Previous}</p>
            <p>Текущий: ${item.Value}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}


