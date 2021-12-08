'use strict';

//########### Выход из личного кабинета ##################

const logoutButton = new LogoutButton(); //создаём объект класса LogoutButton

logoutButton.action = () => {            // деавторизация
    ApiConnector.logout((response) => {
        console.log(response);
      if (response.success === true) {  // проверка успешности деавторизации
        clearTimeout(timerId);          // остановка автообновления курсов валют перед уходом с домашней страницы
        location.reload();              // обновление страницы
          
      }
    });
};

logoutButton.Click = logoutButton.action; // обработка события: нажитие кнопки "выйти"
//==================================================================================================================================


//########### Получение информации о пользователе ##################

ApiConnector.current((userDataResponse) => {
    console.log(userDataResponse);
    stockInterval();                                                                         // первоначальное заполнение таблицы курсов валют, до того как начнёт работать автообновление timerId
    if (userDataResponse.success === true) ProfileWidget.showProfile(userDataResponse.data); // заполнение таблицы текущего профиля
});
//==================================================================================================================================


//########### Получение текущих курсов валюты ##################

const ratesBoard = new RatesBoard();

function stockInterval() {                            // функция запроса курсов валют
    ApiConnector.getStocks((stocksResponse) => {
        //console.log(stocksResponse);
        if (stocksResponse.success === true) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(stocksResponse.data);
        };
    });
};

let timerId = setInterval(stockInterval,60000);       // автообновление курсов валют каж минуту;
//==================================================================================================================================

//########### Операции с деньгами ##################
const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {                                  // пополнение счёта
    ApiConnector.addMoney(data, (addMoneyRespons) => {
        console.log(data);
        if (addMoneyRespons.success === true) {
            alert('успешно добавлено ' + data.amount + ' ' + data.currency);
            favoritesWidget.setMessage(addMoneyRespons.success, 'Success!'); // требуемый вывод сообщения об успешной операции не работает.. :( Почему?
            location.reload()                                                // не понятно, как использовать отображение данных ответа от сервера (showProfile)... ??? Просто обновляем страницу и новые данные пополненного баланса актуализируются
           
        }
        else {
            alert(addMoneyRespons.error);                                   // вот такой вывод сообщения об ошибке работает
            favoritesWidget.setMessage(!addMoneyRespons.success, 'Error!'); // а требуемый вывод сообщения об ошибке не работает.. :( Почему?
        }
    });
};

moneyManager.conversionMoneyCallback = (data) => {                          // конвертирование валюты
  ApiConnector.convertMoney(data, (convertMoneyResponse) => {
    //console.log(convertMoneyResponse);
    if (convertMoneyResponse.success === true) {
        alert('успешно конвертировано из ' + data.fromAmount + data.fromCurrency + ' в ' + data.targetCurrency);
        location.reload()
    } else alert(convertMoneyResponse.error);  
  });  
};

moneyManager.sendMoneyCallback = (data) => {                                // перевод средств
    ApiConnector.transferMoney(data, (transferMoneyResponse) => {
        console.log(data);
        if (transferMoneyResponse.success === true) {
            alert('успешно переведено ' + data.amount + data.currency);
            location.reload()
        } else alert(transferMoneyResponse.error);
    });
};
//==================================================================================================================================

//########### Работа с избранным ##################
const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((getFavoritesResponse) => {                       // запрос начального списка избранного
    //console.log(getFavoritesResponse.data);
    if (getFavoritesResponse.success === true) favoritesWidget.clearTable();
    favoritesWidget.fillTable(getFavoritesResponse.data);
    moneyManager.updateUsersList(getFavoritesResponse.data);
});
 
favoritesWidget.addUserCallback = (data) => {                               // добавления пользователя в список избранных
    ApiConnector.addUserToFavorites(data, (addUserResponse) => {
        if (addUserResponse.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(addUserResponse.data);
            moneyManager.updateUsersList(addUserResponse.data);
            location.reload()
        } else alert(addUserResponse.error);     
    });
};

favoritesWidget.removeUserCallback = (data) => {                               // удаление пользователя из избранного
    ApiConnector.removeUserFromFavorites(data, (remUserResponse) => {
        if (remUserResponse.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(remUserResponse.data);
            moneyManager.updateUsersList(remUserResponse.data);
            location.reload()
        } else alert(remUserResponse.error);     
    });
};