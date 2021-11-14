'use strict';

const userForm = new UserForm(); //создаём объект класса UserForm

const data = userForm.getData(userForm.loginForm); //создаём объект data, со свойствами логина и пароля, взятыми из текущей формы

let login = data.login; //присваиваем переменной login значение логина из формы
let password = data.password; //присваиваем переменной password значение пароля из формы



const func = ({login,password}) => { //функция для выполнения запроса попытки авторизации на сервер, аргументом которой является объект с двумя заранее известными свойствами
    
    ApiConnector.login(login, password, () => { // запрос на авторизацию
        userForm.loginFormAction(login,password); // функция, выполняемая при попытке авторизации
    }    
    );
};


userForm.loginFormCallback = func(data); //присваиваем свойству созданного объекта значение функции func с аргументом data







