import React from "react";
import InfoModal from '../info-modal';
import axios from 'axios';

export default class Registration extends React.Component {
    constructor(){
        super();
        this.state = {
            game_name: '',  //название игры
            password: '',   //пароль игры
            game_code: '',  //уникальный код игры
            status: '',     //статус окна для стиля ок или ошибка
            message: '',    //сообщение в модальном окне
            modal: '',      //флаг открытия модального
        }
    }

    onInputChange(e){ //запись данных из формы в стейт
	    this.setState({ [e.target.name] : e.target.value })
	}

    openInfoModal = (modal, message, status) => {   //открыть модалку с сообщением успеха/неуспеха регистрации
        this.setState({
            modal: modal,
            message: message,
            status: status
        })
    }
    onCloseModal = () => {   //закрыть модалку с сообщением успеха/неуспеха регистрации
        this.setState({
            modal: false,
            message: '',
            status: ''
        })
    }

    onGameSave = () => {   //при нажатии сохранить
        axios.post("./api/registrationGame.php", {
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            },
            data: {
                game_name: this.state.game_name, //передаем данные из стейта в пхп
                password: this.state.password,
                game_code: this.state.game_code,
            }
        }).then((res) => {
            this.openInfoModal(true, res.data.message, res.data.status);
            this.setState({
                game_name: '',
                password: '',
                game_code: '',
            })
        }).catch((err) => {
        this.openInfoModal(true, 'Регистрация не прошла', false);
        });
   }

    render(){
        const infoModal = this.state.modal ?  <InfoModal onCloseModal={this.onCloseModal} message={this.state.message} status={this.state.status}/> : null;
        const clazz = this.state.modal ? 'registration opacity' : 'registration';

        return(
            <>
                {infoModal}
                 <div className={clazz}>
                     <div className="registration-form">
                        <form method="post" encType="multipart/form-data" >
                            <label htmlFor="name">Название игры</label>
                            <input id="name" onChange={(e) => this.onInputChange(e)} name="game_name" type="text" value={this.state.game_name} className="form-control" />
                            <label htmlFor="game_code">Уникальный числовой код</label>
                            <input id="game_code" onChange={(e) => this.onInputChange(e)} name="game_code" type="text" value={this.state.game_code} className="form-control" />
                            <label htmlFor="password">Пароль</label>
                            <input id="password" onChange={(e) => this.onInputChange(e)} name="password" type="password" value={this.state.password} className="form-control" />
                            <button type="button" className="btn btn-success" onClick={this.onGameSave}> Зарегистрировать игру </button>
                        </form>
                    </div>
                </div>
            </>
        )
   }
};