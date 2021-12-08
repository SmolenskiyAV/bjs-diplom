'use strict';

const userForm = new UserForm(); //создаём объект класса UserForm

userForm.loginFormCallback = (data) => {
    ApiConnector.login(data, (response) => {
        console.log(response);
        if (response.success === false) alert(response.error) // проверка успешности авторизации
        else location.reload();
    });
}

userForm.registerFormCallback = (data) => {
    ApiConnector.register(data, (response) => {
        console.log(response);
        if (response.success === false) alert(response.error) // проверка успешности регистрации
        else location.reload();
    });
}








