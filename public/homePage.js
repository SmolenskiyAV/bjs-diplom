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
       
        let addSuccsessMessage;                                             // переменная для хранения сообщений об успешных операциях пополнения счёта
        if (addMoneyRespons.success === true) {
            addSuccsessMessage = ('успешно добавлено ' + data.amount + ' ' + data.currency);
            moneyManager.setMessage(addMoneyRespons.success, addSuccsessMessage); // требуемый вывод сообщения об успешной операции
            ProfileWidget.showProfile(addMoneyRespons.data);                // обновление пополненного значения при отображении в профиле                                        
        }
        else moneyManager.setMessage(addMoneyRespons.success, addMoneyRespons.error);             // требуемый вывод сообщения об ошибке
    });
};

moneyManager.conversionMoneyCallback = (data) => {                          // конвертирование валюты
  ApiConnector.convertMoney(data, (convertMoneyResponse) => {
    
    let convertSuccessMessage;                                              // переменная для хранения сообщений об успешном конвертировании
    if (convertMoneyResponse.success === true) {
        convertSuccessMessage = ('успешно конвертировано из ' + data.fromAmount + ' ' + data.fromCurrency + ' в ' + data.targetCurrency);
        moneyManager.setMessage(convertMoneyResponse.success, convertSuccessMessage);
        ProfileWidget.showProfile(convertMoneyResponse.data);          // обновление значений после конвертирования при отображении в профиле
    } else moneyManager.setMessage(convertMoneyResponse.success, convertMoneyResponse.error);  
  });  
};

moneyManager.sendMoneyCallback = (data) => {                                // перевод средств
    ApiConnector.transferMoney(data, (transferMoneyResponse) => {
        
        let transferSuccessMessage;                                         // переменная для хранения сообщений об успешном переводе средств
        if (transferMoneyResponse.success === true) {
            transferSuccessMessage = ('успешно переведено ' + data.amount + ' ' + data.currency);
            ProfileWidget.showProfile(transferMoneyResponse.data);          // обновление значений после перевода при отображении в профиле    
            moneyManager.setMessage(transferMoneyResponse.success, transferSuccessMessage);
        } else moneyManager.setMessage(transferMoneyResponse.success, transferMoneyResponse.error);
    });
};
//==================================================================================================================================

//########### Работа с избранным ##################
const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((getFavoritesResponse) => {                       // запрос начального списка избранного
    
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
            favoritesWidget.setMessage(addUserResponse.success, 'Контакт успешно добавлен!');
        } else favoritesWidget.setMessage(addUserResponse.success, addUserResponse.error);    
            
    });
};

favoritesWidget.removeUserCallback = (data) => {                               // удаление пользователя из избранного
    ApiConnector.removeUserFromFavorites(data, (remUserResponse) => {
        if (remUserResponse.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(remUserResponse.data);
            moneyManager.updateUsersList(remUserResponse.data);
            favoritesWidget.setMessage(remUserResponse.success, 'Контакт успешно удалён!');
        } else favoritesWidget.setMessage(remUserResponse.success, remUserResponse.error);     
    });
};