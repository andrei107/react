import React, {Component} from "react";
import InfoModal from '../info-modal';
import axios from 'axios';

export default class Login extends Component {
  constructor(){
    super();
    this.state = {
      game_name: '', //название игры
      password: '',  //пароль игры
      status: '',    //статус окна
      message: '',   //сообщение в модальном окне
      modal: '',     //флаг открытия модального
    }
  }

  onInputChange(e){ //запись данных из формы в стейт
    this.setState({ [e.target.name] : e.target.value })
  }

  openInfoModal = (modal, message, status) => {   //открыть модалку
    this.setState({
      modal: modal,
      message: message,
      status: status
    })
  }
  onCloseModal = () => {   //закрыть модалку
    this.setState({
      modal: false,
      message: '',
      status: ''
    })
  }

  changeLoginStatus = () => { // валидация JWT для проверки доступа
    let jwt = this.getCookie("jwt");

    axios.post("./api/validate_token.php", {
      headers:{
        'Content-type': 'application/json; charset=UTF-8',
      },
      data: {
        jwt:jwt //отправить токен для проверки
      }
    }).then((res) => {
      this.props.changeLoginStatus(true);    //меняем статус что мы авторизованы
      this.openInfoModal(true, res.data.message, res.data.status);
    })
    .catch((err) => {
      this.openInfoModal(true, 'Регистрация не прошла', false);
    });
  }

  setCookie(cname, cvalue, exdays){ //установить значение в куки
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  getCookie(cname) { //получить значение куки
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");

    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " "){
        c = c.substring(1);
      }

      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  onLogin = () => { //при нажатии login
    axios.post("./api/loginGame.php", {
      headers:{
        'Content-type': 'application/json; charset=UTF-8',
      },
      data: {
        game_name: this.state.game_name, //отправляем данные на пхп для проверки входа
        password: this.state.password,
      }
    }).then((res) => {
      this.setCookie('jwt', res.data.jwt, 1); //ставим куки
      this.setState({ //очищаем форму
        game_name: '',
        password: ''
      })
      this.changeLoginStatus(); //запуск проверки токена
    }).catch((err) => {
      this.openInfoModal(true, 'Регистрация не прошла', false);
    });
  }
    
  render(){
    const infoModal = this.state.modal ?  <InfoModal onCloseModal={this.onCloseModal} message={this.state.message} status={this.state.status}/> : null;

    return (
      <>
      {infoModal}
      <div className="login">
        <h2>Войти в игру</h2>
        <form method="post">
          <label htmlFor="name">Название игры</label>
          <input id="name" onChange={(e) => this.onInputChange(e)} name="game_name" type="text" className="form-control" />
          <label htmlFor="nik">Пароль</label>
          <input id="nik" onChange={(e) => this.onInputChange(e)} name="password" type="password" className="form-control" />
          <button type="button" className="btn btn-success" onClick={this.onLogin}> Войти в игру </button>
        </form>
      </div>
      </>
    )
  }
};